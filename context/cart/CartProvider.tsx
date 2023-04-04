import { FC, PropsWithChildren, useEffect, useReducer } from "react";

import Cookie from "js-cookie";

import { ICartProduct } from "@/interfaces";
import { CartContext } from "./CartContext";
import { cartReducer } from "./cartReducer";

export interface CartState {
  cart: ICartProduct[];
}

const CART_INITIAL_STATE: CartState = {
  cart: [],
};

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  useEffect(() => {
    try {
      const productsCookie = Cookie.get("cart")
        ? JSON.parse(Cookie.get("cart")!)
        : [];
      dispatch({ type: "[CART] - Load Cart", payload: productsCookie });
    } catch {
      dispatch({ type: "[CART] - Load Cart", payload: [] });
    }
  }, []);

  useEffect(() => {
    Cookie.set("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  const addProductToCart = (product: ICartProduct) => {
    const productInCart = state.cart.some((item) => item._id === product._id);

    if (!productInCart) {
      return dispatch({
        type: "[CART] - Update Cart",
        payload: [...state.cart, product],
      });
    }

    const productSameSize = state.cart.some(
      (item) => item._id === product._id && item.size === product.size
    );
    if (!productSameSize) {
      return dispatch({
        type: "[CART] - Update Cart",
        payload: [...state.cart, product],
      });
    }

    const updatedProducts = state.cart.map((item) => {
      if (item._id !== product._id) return item;
      if (item.size !== product.size) return item;

      item.quantity += product.quantity;

      return item;
    });

    dispatch({ type: "[CART] - Update Cart", payload: updatedProducts });
  };

  const updateItemQuantity = (product: ICartProduct) => {
    dispatch({ type: "[CART] - Update Item Quantity", payload: product });
  };

  return (
    <CartContext.Provider
      value={{ ...state, addProductToCart, updateItemQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};
