import { FC, PropsWithChildren, useReducer } from "react";

import { UIContext } from "./UIContext";
import { uiReducer } from "./uiReducer";

export interface UIState {
  isMenuOpen: boolean;
}

const UI_INITIAL_STATE: UIState = {
  isMenuOpen: false,
};

export const UIProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

  const toggleSideMenu = () => {
    dispatch({ type: "[UI] - Toggle Menu" });
  };

  return (
    <UIContext.Provider
      value={{
        ...state,

        toggleSideMenu,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
