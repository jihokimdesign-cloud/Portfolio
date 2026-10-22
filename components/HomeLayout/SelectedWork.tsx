import { getProjectInfo } from "../../lib/ProjectInfo";
import FeaturedCaseTap from "./FeaturedCaseTap";
import ProjectGrid from "./ProjectGrid";

type Props = { projects: any[] };

// Selected Work = featured TAP case (full width) on top, then the remaining
// cases in a two-column grid. Order is preserved; CookAR stays last.
export default function SelectedWork({ projects }: Props) {
  const visible = projects.filter((p) => !getProjectInfo(p.meta).hidden);
  const rest = visible.filter((p) => p.meta.slug !== "tap3d");

  return (
    <div className="flex flex-col gap-16">
      <FeaturedCaseTap />
      <ProjectGrid projects={rest} />
    </div>
  );
}
