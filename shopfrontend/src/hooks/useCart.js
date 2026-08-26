import { useContext } from "react";
import { CartContext } from "../context/CartContextValue";

const useCart = () => {
  return useContext(CartContext);
};

export default useCart;