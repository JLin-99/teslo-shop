import { FC, PropsWithChildren, useReducer } from "react";

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
  return (
    <CartContext.Provider value={{ ...state, addProductToCart }}>
      {children}
    </CartContext.Provider>
  );
};
