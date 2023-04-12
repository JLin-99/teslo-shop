import { FC, PropsWithChildren, useEffect, useReducer } from "react";

import Cookies from "js-cookie";

import { ICartProduct, IOrder, ShippingAddress } from "@/interfaces";
import { CartContext } from "./CartContext";
import { cartReducer } from "./cartReducer";
import { tesloAPI } from "@/api";

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  shippingAddress?: ShippingAddress;
}

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined,
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
    if (Cookies.get("lastName")) {
      const shippingAddress = {
        firstName: Cookies.get("firstName") || "",
        lastName: Cookies.get("lastName") || "",
        phone: Cookies.get("phone") || "",
        address: Cookies.get("address") || "",
        address2: Cookies.get("address2") || "",
        city: Cookies.get("city") || "",
        country: Cookies.get("country") || "",
        state: Cookies.get("state") || "",
        zipCode: Cookies.get("zipCode") || "",
      };

      dispatch({ type: "[CART] - Load Address", payload: shippingAddress });
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

  const updateAddress = (address: ShippingAddress) => {
    Cookies.set("firstName", address.firstName);
    Cookies.set("lastName", address.lastName);
    Cookies.set("phone", address.phone || "");
    Cookies.set("address", address.address);
    Cookies.set("address2", address.address2 || "");
    Cookies.set("city", address.city);
    Cookies.set("country", address.country);
    Cookies.set("state", address.state);
    Cookies.set("zipCode", address.zipCode);

    dispatch({ type: "[CART] - Update Address", payload: address });
  };

  const createOrder = async () => {
    if (!state.shippingAddress) throw new Error("There is no shipping address");

    const body: IOrder = {
      orderItems: state.cart.map((product) => ({
        ...product,
        size: product.size!,
      })),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.numberOfItems,
      subTotal: state.subTotal,
      tax: state.tax,
      total: state.total,
      isPaid: false,
    };

    try {
      const { data } = await tesloAPI.post("/orders", body);

      console.log({ data });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addProductToCart,
        updateProductQuantity,
        removeProduct,
        updateAddress,
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
