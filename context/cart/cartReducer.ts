import { ICartProduct } from "@/interfaces";
import { CartState } from "./CartProvider";

type CartActionType =
  | { type: "[CART] - Load Cart"; payload: ICartProduct[] }
  | { type: "[CART] - Update Cart"; payload: ICartProduct[] }
  | { type: "[CART] - Update Item Quantity"; payload: ICartProduct };

export const cartReducer = (
  state: CartState,
  action: CartActionType
): CartState => {
  switch (action.type) {
    case "[CART] - Load Cart":
      return {
        ...state,
        cart: action.payload,
      };

    case "[CART] - Update Cart":
      return {
        ...state,
        cart: action.payload,
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

    default:
      return state;
  }
};
