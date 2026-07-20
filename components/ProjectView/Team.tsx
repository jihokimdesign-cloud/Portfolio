import React from "react";

interface Teammate {
  name: string;
  position: string;
}

type Props = {
  teammates: Teammate[];
};

const Team = ({ teammates }: Props) => {
  return (
    <>
      <h3 className="sm:col-start-2 col-span-full pb-6 text-[1rem] leading-none">
        Team
      </h3>
      <div className="sm:col-start-2 col-span-full md:col-start-2 md:col-span-2 2xl:col-start-2 2xl:col-span-2 grid grid-cols-2 text-[1rem] leading-[120%] mb-[12em]">
        {teammates.map((teammate, index) => (
          <React.Fragment key={index}>
            <div className="col-start-1">{teammate.name}</div>
            {teammate.position && (
              <div className="col-start-2">{teammate.position}</div>
            )}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default Team;
