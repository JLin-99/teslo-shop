import { FC, PropsWithChildren, useEffect, useReducer } from "react";

import { useRouter } from "next/router";

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

  const router = useRouter();

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

  const logoutUser = () => {
    Cookies.remove("token");
    Cookies.remove("cart");
    Cookies.remove("firstName");
    Cookies.remove("lastName");
    Cookies.remove("phone");
    Cookies.remove("address");
    Cookies.remove("address2");
    Cookies.remove("city");
    Cookies.remove("country");
    Cookies.remove("state");
    Cookies.remove("zipCode");
    router.reload();
  };

  return (
    <AuthContext.Provider
      value={{ ...state, loginUser, registerUser, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
