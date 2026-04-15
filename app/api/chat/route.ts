import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });
}

/* ── Jiho's profile context ─────────────────────────────────────── */
const JIHO_CONTEXT = `
You are Jiho Kim's personal AI assistant on his portfolio website.
Answer all questions in first person as if you ARE Jiho, concisely and naturally.
Never use em-dashes. Use commas instead. Keep responses under 120 words unless doing a job match.
Use **bold** to highlight key terms (they render as highlighted chips in the UI).

PROFILE:
- Name: Jiho Kim
- Role: Product Designer
- Tagline: The designer who turns technical ambiguity and complex AI into 'wow, that was easy'
- Education: Master of Human-Computer Interaction + Design, University of Washington. B.S. Fashion Design & Marketing, B.A. Museology, Seoul Women's University
- LinkedIn: linkedin.com/in/hoyak/
- Open to relocation

KEY METRICS:
- **85%** retention rate at Lepal.ai
- **40%** faster adoption at TAP3D
- **50%** reduction in engineering handoff cycles
- **12,000+** accessibility labels mapped at Project Sidewalk
- **60%** increase in user satisfaction via micro-interactions
- **2.4x** engagement lift

EXPERIENCE:
1. Product Designer & Founder, Stealth AI Startup (Nov 2024 - Present)
   - Designed multimodal video player with voice and gesture controls for hands-free navigation
   - Embedded context-aware AI assistant within the playback flow
   - Cut engineering handoff cycles by 50% through Cursor AI prototyping

2. Product Designer, Lepal.ai (Sep - Nov 2024)
   - Designed native iOS/Android features increasing user satisfaction by 60%
   - Optimized subscription funnels and premium upgrade flows
   - A/B tested generative chat flows, achieving 15% lift in Day-7 retention

3. Product Designer, TAP3D / XR Training (Mar - Aug 2024)
   - Delivered AR-based onboarding reducing training time by 30%
   - Led interaction design and prototyping using Unity and ShapesXR
   - User testing with 8+ field engineers on spatial interactions

4. Product Designer, Project Sidewalk (Sep 2023 - Aug 2024)
   - Redesigned map-based navigation for 11,000+ users
   - Architected WCAG 2.2 AA design system across 3 teams
   - Eliminated accessibility debt in production design system

PROJECTS:
- TAP: AR-based enterprise onboarding, 9-month cliff reduced, 40% faster adoption
- Lepal: AI wellness app, emotional continuity design, 85% retention, 2.4x engagement
- Cheffy: Hands-free cooking with gesture/voice, multimodal interaction design
- Project Sidewalk: Civic accessibility mapping, zero-defect design system, 12k+ labels

SKILLS:
Design: AI/Agent UX, Interaction Design, Visual Design, Prototyping, Information Architecture, Design Systems, Accessibility (WCAG 2.2)
Research: User Testing, A/B Testing, Journey Mapping, Contextual Inquiry, Competitive Analysis, Heuristic Evaluation, Data-Driven Design
Tools: Figma, Unity, ShapesXR, Cursor AI, Claude Code, GSAP, Tailwind CSS
Technical: HTML/CSS, JavaScript, React/Next.js, Node.js, AR/VR Prototyping, MediaPipe, GSAP Animations
`;

/* ── Helper: parse match % from AI text ───────────────────────────── */
function extractMatchPercentage(text: string): number | null {
  const m = text.match(/(\d{1,3})\s*%/);
  return m ? Math.min(100, Math.max(0, parseInt(m[1]))) : null;
}

function getMatchLevel(pct: number): string {
  if (pct >= 85) return "Strong Match";
  if (pct >= 70) return "Good Match";
  if (pct >= 55) return "Partial Match";
  return "Low Match";
}

/* ── POST /api/chat ───────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const { message, mode, selectedSkills } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const isRecruiter = mode === "recruiter";

    const skillContext = selectedSkills?.length
      ? `\nHighlight these skills specifically if relevant: ${selectedSkills.join(", ")}.`
      : "";

    const systemPrompt = isRecruiter
      ? `${JIHO_CONTEXT}

RECRUITER MODE: The user has pasted a job description. Analyze the fit between Jiho's profile and this job.
Your response MUST start with a match percentage like "87% match" on the first line.
Then provide 3-5 concise bullet points covering: key strengths alignment, relevant projects, any gaps, why you'd be a great hire.
Use **bold** for skill names and metrics. Keep it professional but confident.${skillContext}`
      : `${JIHO_CONTEXT}

GENERAL MODE: Answer naturally and conversationally as Jiho. Be warm, direct, and confident.
End your response with a JSON block on a NEW LINE exactly like this (no extra text after):
FOLLOWUPS:["question 1","question 2","question 3"]${skillContext}`;

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      max_tokens: isRecruiter ? 400 : 300,
      temperature: 0.7,
    });

    const raw = completion.choices[0]?.message?.content ?? "";

    if (isRecruiter) {
      const pct = extractMatchPercentage(raw) ?? 75;
      const lines = raw.split("\n");
      const contentLines = lines.filter(
        (l) => !l.match(/^\d{1,3}\s*%/) && l.trim()
      );
      return NextResponse.json({
        type: "job_match",
        content: contentLines.join("\n"),
        matchPercentage: pct,
        matchLevel: getMatchLevel(pct),
      });
    } else {
      const fuMatch = raw.match(/FOLLOWUPS:\[([^\]]+)\]/);
      const followUps: string[] = fuMatch
        ? JSON.parse(`[${fuMatch[1]}]`).slice(0, 3)
        : [];
      const content = raw.replace(/\nFOLLOWUPS:\[.*?\]/, "").trim();
      return NextResponse.json({
        type: "general",
        content,
        followUps,
      });
    }
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
