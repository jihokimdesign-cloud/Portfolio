// Minimal CDP harness: drives a headless Chrome over the DevTools protocol to
// screenshot pages AND exercise click interactions (summary mode, filters, WoZ
// upload). Uses setDeviceMetricsOverride so sub-500px widths aren't clamped.
//
// Usage: node scripts/cdp-shoot.mjs <config.json>
//   config = { chrome, port, outDir, shots: [
//     { url, out, width, height, dpr?, reducedMotion?, settle?, actions?:[{click}|{wait}] }
//   ] }
import fs from "fs";
import { spawn } from "child_process";
import os from "os";
import path from "path";

const cfg = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const PORT = cfg.port || 9333;
const CHROME = cfg.chrome || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const userDir = fs.mkdtempSync(path.join(os.tmpdir(), "cdp-"));

const chrome = spawn(CHROME, [
  "--headless=new", "--disable-gpu=false", "--hide-scrollbars", "--mute-audio",
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${userDir}`, "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getWsUrl() {
  for (let i = 0; i < 50; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      const j = await r.json();
      if (j.webSocketDebuggerUrl) return j.webSocketDebuggerUrl;
    } catch {}
    await sleep(200);
  }
  throw new Error("CDP not reachable");
}

function cdp(ws) {
  let id = 0;
  const pending = new Map();
  const listeners = [];
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      const { resolve, reject } = pending.get(m.id);
      pending.delete(m.id);
      m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result);
    } else if (m.method) {
      listeners.forEach((fn) => fn(m));
    }
  });
  const send = (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      const mid = ++id;
      pending.set(mid, { resolve, reject });
      ws.send(JSON.stringify({ id: mid, method, params, sessionId }));
    });
  return { send, on: (fn) => listeners.push(fn) };
}

async function main() {
  const wsUrl = await getWsUrl();
  const ws = new WebSocket(wsUrl);
  await new Promise((res) => (ws.onopen = res));
  const { send, on } = cdp(ws);

  // attach to a page target
  const { targetInfos } = await send("Target.getTargets");
  let pageTarget = targetInfos.find((t) => t.type === "page");
  const { sessionId } = await send("Target.attachToTarget", { targetId: pageTarget.targetId, flatten: true });
  const S = (m, p) => send(m, p, sessionId);

  await S("Page.enable");
  await S("Runtime.enable");

  for (const shot of cfg.shots) {
    const dpr = shot.dpr || 2;
    await S("Emulation.setDeviceMetricsOverride", {
      width: shot.width, height: shot.height, deviceScaleFactor: dpr, mobile: !!shot.mobile,
    });
    if (shot.reducedMotion) {
      await S("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
    } else {
      await S("Emulation.setEmulatedMedia", { features: [] });
    }

    let loaded = false;
    const onLoad = (m) => { if (m.method === "Page.loadEventFired") loaded = true; };
    on(onLoad);
    // Force a fresh document: a URL differing only by #hash is a same-document
    // navigation (no reload), which would leak page state between shots.
    await S("Page.navigate", { url: "about:blank" });
    await sleep(250);
    await S("Page.navigate", { url: shot.url });
    for (let i = 0; i < 60 && !loaded; i++) await sleep(100);
    await sleep(shot.settle ?? 2500);

    for (const a of shot.actions || []) {
      if (a.wait) { await sleep(a.wait); continue; }
      if (a.eval) {
        const r = await S("Runtime.evaluate", { expression: a.eval, returnByValue: true });
        console.log(`  eval: ${JSON.stringify(r.result.value)}`);
        await sleep(a.after ?? 600);
        continue;
      }
      if (a.click) {
        const expr = `(()=>{const el=document.querySelector(${JSON.stringify(a.click)});if(!el)return 'NOT_FOUND';el.click();return 'OK';})()`;
        const r = await S("Runtime.evaluate", { expression: expr, returnByValue: true });
        console.log(`  click ${a.click}: ${r.result.value}`);
        await sleep(a.after ?? 1200);
      }
    }

    const { data } = await S("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
    fs.writeFileSync(path.join(cfg.outDir, shot.out + ".png"), Buffer.from(data, "base64"));
    console.log(`✓ ${shot.out}`);
  }

  ws.close();
  chrome.kill();
  await sleep(300);
  try { fs.rmSync(userDir, { recursive: true, force: true }); } catch {}
}

main().catch((e) => { console.error(e); chrome.kill(); process.exit(1); });
