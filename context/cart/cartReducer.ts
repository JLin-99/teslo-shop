import { ICartProduct } from "@/interfaces";
import { CartState } from "./CartProvider";

type CartActionType =
  | { type: "[CART] - Load Cart"; payload: ICartProduct[] }
  | { type: "[CART] - Update Cart"; payload: ICartProduct[] };

export const cartReducer = (
  state: CartState,
  action: CartActionType
): CartState => {
  switch (action.type) {
    case "[CART] - Load Cart":
      return {
        ...state,
      };

    case "[CART] - Update Cart":
      return {
        ...state,
        cart: [...action.payload],
      };

    default:
      return state;
  }
};
