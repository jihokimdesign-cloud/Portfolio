import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import {
  breakpoints,
  useBreakpoint,
  useMobileBreakpoint,
} from "../../hooks/useBreakpoints";
import { getProjectLogo, ProjectInfo } from "../../lib/ProjectInfo";

type Props = {
  projectInfo: ProjectInfo;
};

const ProjectHeader = ({ projectInfo }: Props) => {
  const isBiggerThanMd = useBreakpoint(breakpoints.md);
  return (
    <div className="2xl:absolute left-0 right-0 top-0 px-4 lg:px-8 py-4 lg:py-8 grid gap-4 grid-cols-[1fr_1fr_4fr] md:grid-cols-[1fr_1fr_2fr] lg:grid-cols-[2fr_1fr] z-20">
      {
        //@ts-ignore
        <Image
          src={getProjectLogo(projectInfo.slug, !isBiggerThanMd)}
          className="lg:max-h-12 mt-1 ml-1 md:mt-0 md:ml-0"
          alt={""}
          width={144}
          height={144}
          priority={true}
        />
      }
      <div className="col-start-3 lg:col-start-2">
        <h1 className="text-lg lg:text-2xl text-normal lg:tracking-[-.018em] leading-tight lg:leading-[1.12] max-w-[32ch]">
          {projectInfo.description}
        </h1>
        <div className="text-sm lg:text-base mt-4 lg:mt-8 opacity-50 leading-tight lg:leading-tight">
          {projectInfo.scope}
        </div>
        {projectInfo.tags && (
          <div className="text-sm lg:text-base mt-4 lg:mt-6 opacity-50 leading-tight lg:leading-tight">
            {projectInfo.tags.map((tag: string, index: number) => {
              return <div key={index}>{tag}</div>;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectHeader;
