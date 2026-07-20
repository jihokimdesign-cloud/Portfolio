import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { useBoundingBox } from "../../hooks/useBoundingClientRect";
import useIsFirstRender from "../../hooks/useIsFirstRender";
import { useEditableContext } from "./EditableContext";

type Props = {
  children: React.ReactNode;
};

const EditableText = ({ children }: Props) => {
  const editableContext = useEditableContext();
  // if (!editableContext || !editableContext.editable) return <>{children}</>;

  const textAreaRef = useRef() as MutableRefObject<HTMLTextAreaElement>;
  const [textAreaValue, setTextAreaValue] = useState(children || "");
  const [isEditing, setIsEditing] = useState(false);

  const [containerRef, bounds] = useBoundingBox<HTMLDivElement>([
    isEditing,
    textAreaValue,
  ]);

  useOnClickOutside(containerRef, (e) => {
    setIsEditing(false);
  });

  useEffect(() => {
    if (isEditing) {
      textAreaRef.current.focus();
      textAreaRef.current.selectionEnd = textAreaRef.current.selectionEnd;
    }
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === "Enter") {
      setIsEditing(false);
      e.preventDefault();
    }
  };

  return (
    <span
      ref={containerRef}
      onClick={() => setIsEditing(true)}
      className="block"
    >
      <span className="relative w-full">
        <textarea
          ref={textAreaRef}
          className="absolute padding-inherit text-inherit overflow-hidden bg-transparent resize-none"
          style={{
            padding: "inherit",
            letterSpacing: "inherit",
            lineHeight: "inherit",
            width: bounds.width,
            height: bounds.height + 4,
            visibility: isEditing ? "visible" : "hidden",
          }}
          onChange={(e) => setTextAreaValue(e.target.value)}
          onKeyDown={handleKeyDown}
          //@ts-ignore
          value={textAreaValue}
        />
      </span>
      <span
        // className="invisible"
        style={{
          visibility: isEditing ? "hidden" : "visible",
          cursor: "pointer",
        }}
      >
        {textAreaValue}
      </span>
    </span>
  );
};

export default EditableText;
