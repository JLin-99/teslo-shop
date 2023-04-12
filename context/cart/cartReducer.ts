import { ICartProduct, ShippingAddress } from "@/interfaces";
import { CartState } from "./CartProvider";

type CartActionType =
  | { type: "[CART] - Load Cart"; payload: ICartProduct[] }
  | { type: "[CART] - Update Cart"; payload: ICartProduct[] }
  | { type: "[CART] - Update Item Quantity"; payload: ICartProduct }
  | { type: "[CART] - Remove Item"; payload: ICartProduct }
  | { type: "[CART] - Load Address"; payload: ShippingAddress }
  | { type: "[CART] - Update Address"; payload: ShippingAddress }
  | {
      type: "[CART] - Update Order Summary";
      payload: {
        numberOfItems: number;
        subTotal: number;
        tax: number;
        total: number;
      };
    }
  | { type: "[CART] - Complete Order" };

export const cartReducer = (
  state: CartState,
  action: CartActionType
): CartState => {
  switch (action.type) {
    case "[CART] - Load Cart":
      return {
        ...state,
        isLoaded: true,
        cart: [...action.payload],
      };

    case "[CART] - Update Cart":
      return {
        ...state,
        cart: [...action.payload],
      };

    case "[CART] - Update Item Quantity":
      return {
        ...state,
        cart: state.cart.map((product) => {
          if (product._id !== action.payload._id) return product;
          if (product.size !== action.payload.size) return product;

          return action.payload;
        }),
      };

    case "[CART] - Remove Item":
      return {
        ...state,
        cart: state.cart.filter(
          (product) =>
            !(
              product._id === action.payload._id &&
              product.size === action.payload.size
            )
        ),
      };

    case "[CART] - Update Order Summary":
      return {
        ...state,
        ...action.payload,
      };

    case "[CART] - Load Address":
    case "[CART] - Update Address":
      return {
        ...state,
        shippingAddress: action.payload,
      };

    case "[CART] - Complete Order":
      return {
        ...state,
        cart: [],
        numberOfItems: 0,
        subTotal: 0,
        tax: 0,
        total: 0,
      };

    default:
      return state;
  }
};
