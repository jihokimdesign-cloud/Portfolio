import React, { createContext, useContext } from "react";

type Props = {
  children: React.ReactNode;
};

const EditableContext = createContext({
  editable: false,
});

const EditableContextProvider = ({ children }: Props) => {
  return (
    <EditableContext.Provider
      value={{
        editable: false,
      }}
    >
      {children}
    </EditableContext.Provider>
  );
};

const useEditableContext = () => useContext(EditableContext);

export { EditableContextProvider, useEditableContext };
