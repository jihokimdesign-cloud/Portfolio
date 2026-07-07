import EditableText from "../Editor/EditableText";
import { createParagraphProcessor } from "./ParagraphProcessor";

export const ParagraphBig = (children: any) => (
  <p className="col-start-1 sm:col-start-2 col-span-full md:col-start-2 md:col-span-3 mt-48 mb-32 text-3xl leading-[1.16em] xl:leading-[1.16em] -tracking-[.037em] font-light lg:text-4xl xl:text-5xl">
    {children}
  </p>
);
export const Quote = ({ children, who = "", title = "" }: any) => (
  <>
    <blockquote className="col-span-full sm:col-start-2 sm:col-span-3 mt-48 mb-12 text-5xl font-light -indent-4 -tracking-[.037em]">
      “{children}”
    </blockquote>
    <div className="col-start-1 col-span-3 sm:col-start-2 sm:col-span-1 text-sm mb-24">
      {who}
    </div>
    <div className="col-start-4 sm:col-start-3  col-span-1 text-sm mb-24">
      {title}
    </div>
    {/* <div className="col-start-2 col-span-1 text-sm">{from}</div>
    <div className="col-start-2 col-span-1 text-sm mb-24">{address}</div> */}
  </>
);

export const paragraphLayout =
  "col-start-1 col-span-full sm:col-start-3 sm:col-span-4 md:col-start-2 md:col-span-3 lg:col-start-2 lg:col-span-3 xl:col-start-2 xl:col-span-2";

export const Paragraph = (children: any) => (
  <p
    className={`${paragraphLayout} leading-[1.3em] md:leading-[1.16em] opacity-60 pt-[1em]`}
  >
    {children}
  </p>
);
export const Header2 = ({ children }: any) => (
  <h2
    className={`${paragraphLayout} leading-[1.3em] md:leading-[1.16em] md:text-xl pt-48`}
  >
    {children}
  </h2>
);

export const Header3 = ({ children }: any) => (
  <h3
    className={`${paragraphLayout} opacity-90 font-bold text-xs tracking-wider uppercase pt-20`}
  >
    {children}
  </h3>
);

export const Emphasis = ({ children }: any) => {
  return <em className="not-italic bg-[rgba(230,230,230)] px-1">{children}</em>;
};
export const Link = ({ children, href }: any) => {
  return (
    <a href={href} target="blank" className="underline">
      {children}
    </a>
  );
};

export const paragraphProcessor = createParagraphProcessor(
  [
    {
      token: "--",
      output: ParagraphBig,
    },
  ],
  Paragraph
);
