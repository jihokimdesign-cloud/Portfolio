// factory for paragraph processor
interface IParagraphProcessor {
  token: string;
  output: Function;
}
export const createParagraphProcessor = (
  processorList: Array<IParagraphProcessor>,
  DefaultParagraph: React.FC<any>
) => {
  // function that would be called in runtime
  const combinedProcessor = ({ children }: any) => {
    const isChildrenString = typeof children === "string";
    const paragraphHeadingChunk = (() => {
      if (isChildrenString) return children;
      if (Array.isArray(children)) return children[0];
    })();

    const defaultParagraphFormat = DefaultParagraph;

    if (typeof paragraphHeadingChunk !== "string")
      return defaultParagraphFormat({ children });

    const reducerFunction = (
      accumulator: IParagraphProcessor,
      { token, output }: IParagraphProcessor
    ) => {
      const isMatchingToken =
        paragraphHeadingChunk.substring(0, token.length) === token;
      if (isMatchingToken) {
        return output(trimTextLeadingToken(children, token));
      }
      return accumulator;
    };

    const result = processorList.reduce<
      React.ReactElement | IParagraphProcessor
    >(
      //@ts-ignore
      reducerFunction,
      // default value is the children
      defaultParagraphFormat(children)
    );
    return result;
  };
  return combinedProcessor;
};

const trimTextLeadingToken = (children: any, token: string) => {
  if (Array.isArray(children)) {
    let newChildren = [...children];
    newChildren[0] = children[0].substring(token.length);
    return newChildren;
  }

  if (typeof children === "string") return children.substring(token.length);
};
