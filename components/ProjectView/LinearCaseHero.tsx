// Linear-style case hero — the ONE owner of the case title/cover.
// Mirrors Home's featured-card split (reference case-linear-reference.html):
// accent tag + one-liner, .t-display title left, lead + tags right, 4-col
// meta row, then the cover image as a 16:9 panel (kept as the transition target).
import { ProjectInfo } from "../../lib/ProjectInfo";

type Props = {
  projectInfo: ProjectInfo;
  coverImage: string;
  meta: any;
};

const split = (s?: string, by = ",") =>
  (s ?? "").split(by).map((x) => x.trim()).filter(Boolean);

export default function LinearCaseHero({ projectInfo, coverImage, meta }: Props) {
  const tags = split(meta.heroTags);
  const metaItems = split(meta.heroMeta, "||").map((pair) => split(pair, "::"));

  return (
    <>
      <header
        className="case-hero"
        style={{ ["--accent" as any]: meta.accent || "var(--accent)" }}
      >
        <div className="ch-grid">
          <div>
            <div className="ch-top">
              <span className="ch-tag accent">{projectInfo.title}</span>
              {meta.heroKicker && (
                <span className="ch-small">{meta.heroKicker}</span>
              )}
            </div>
            <h1 className="ch-title">{meta.heroTitle}</h1>
          </div>
          <div className="ch-right">
            <p className="ch-lead">
              {meta.heroLeadBold && <b>{meta.heroLeadBold}</b>}{" "}
              {meta.heroLead}
            </p>
            {tags.length > 0 && (
              <div className="ch-tags">
                {tags.map((t) => (
                  <span key={t} className="ch-tag">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        {metaItems.length > 0 && (
          <div className="ch-meta">
            {metaItems.map(([k, v]) => (
              <div key={k}>
                <div className="ch-cap">{k}</div>
                <div className="ch-lab">{v}</div>
              </div>
            ))}
          </div>
        )}
      </header>

      <div
        className="case-panel"
        style={{ ["--accent" as any]: meta.accent || "var(--accent)" }}
      >
        <div className="inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverImage} alt={`${projectInfo.title} — case study cover`} />
        </div>
      </div>
    </>
  );
}
