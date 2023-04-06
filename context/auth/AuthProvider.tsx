import { FC, PropsWithChildren, useEffect, useReducer } from "react";

import axios from "axios";
import Cookies from "js-cookie";

import { AuthContext } from "./AuthContext";
import { authReducer } from "./authReducer";
import { IUser } from "@/interfaces";
import { tesloAPI } from "@/api";

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
};
export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);

  useEffect(() => {
    if (!Cookies.get("token")) return;

    const checkToken = async () => {
      try {
        const { data } = await tesloAPI.get("/user/validate-token");
        const { token, user } = data;
        Cookies.set("token", token);
        dispatch({ type: "[Auth] - Log In", payload: user });
      } catch (error) {
        Cookies.remove("token");
      }
    };
    checkToken();
  }, []);

  const loginUser = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { data } = await tesloAPI.post("/user/login", { email, password });
      const { token, user } = data;

      Cookies.set("token", token);
      dispatch({ type: "[Auth] - Log In", payload: user });

      return true;
    } catch (error) {
      return false;
    }
  };

  const registerUser = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ hasError: boolean; message?: string }> => {
    try {
      const { data } = await tesloAPI.post("/user/register", {
        name,
        email,
        password,
      });
      const { token, user } = data;

      Cookies.set("token", token);
      dispatch({ type: "[Auth] - Log In", payload: user });

      return { hasError: false };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: error.response?.data.message,
        };
      }

      return {
        hasError: true,
        message: "Failed to create user, please try again",
      };
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, loginUser, registerUser }}>
      {children}
    </AuthContext.Provider>
  );
};
