import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContextValue";

const useWishlist = () => {
  return useContext(WishlistContext);
};

export default useWishlist;