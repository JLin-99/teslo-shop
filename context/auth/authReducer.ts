import { AuthState } from "./AuthProvider";
import { IUser } from "@/interfaces";

type AuthActionType =
  | { type: "[Auth] - Log In"; payload: IUser }
  | { type: "[Auth] - Log Out" };

export const authReducer = (
  state: AuthState,
  action: AuthActionType
): AuthState => {
  switch (action.type) {
    case "[Auth] - Log In":
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload,
      };

    case "[Auth] - Log Out":
      return {
        ...state,
        isLoggedIn: false,
        user: undefined,
      };

    default:
      return state;
  }
};
