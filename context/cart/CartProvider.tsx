import { FC, PropsWithChildren, useEffect, useReducer } from "react";

import Cookies from "js-cookie";

import { ICartProduct } from "@/interfaces";
import { CartContext } from "./CartContext";
import { cartReducer } from "./cartReducer";

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
}

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
};

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  useEffect(() => {
    try {
      const productsCookie = Cookies.get("cart")
        ? JSON.parse(Cookies.get("cart")!)
        : [];
      dispatch({ type: "[CART] - Load Cart", payload: productsCookie });
    } catch {
      dispatch({ type: "[CART] - Load Cart", payload: [] });
    }
  }, []);

  useEffect(() => {
    if (state.isLoaded) {
      Cookies.set("cart", JSON.stringify(state.cart));
    }
  }, [state.cart]);

  useEffect(() => {
    const numberOfItems = state.cart.reduce(
      (prev, curr) => curr.quantity + prev,
      0
    );
    const subTotal = state.cart.reduce(
      (prev, curr) => curr.quantity * curr.price + prev,
      0
    );
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

    const orderSummary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total: subTotal * (taxRate + 1),
    };

    dispatch({ type: "[CART] - Update Order Summary", payload: orderSummary });
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

  const updateProductQuantity = (product: ICartProduct) => {
    dispatch({ type: "[CART] - Update Item Quantity", payload: product });
  };

  const removeProduct = (product: ICartProduct) => {
    dispatch({ type: "[CART] - Remove Item", payload: product });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addProductToCart,
        updateProductQuantity,
        removeProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
