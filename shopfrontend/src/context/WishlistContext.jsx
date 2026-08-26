import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { WishlistContext } from "./WishlistContextValue";
import api from "../services/api";

function getCurrentUserName() {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub || payload.email || null;
  } catch {
    return null;
  }
}

function mapWishlistItem(item, products = []) {
  const product = products.find(
    (candidate) => candidate.productName === item.productName
  );

  return {
    ...item,
    productId: product?.id,
    name: item.productName,
    image: product?.imageUrl
      ? product.imageUrl
      : "",
  };
}

function WishlistProvider({ children }) {

  const [wishlistItems, setWishlistItems] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const userName = getCurrentUserName();

    if (!userName) {
      return;
    }

    const loadWishlist = async () => {
      try {
        const [wishlistResponse, productsResponse] = await Promise.all([
          api.get("/wishlist"),
          api.get("/products"),
        ]);

        setWishlistItems(
          wishlistResponse.data
            .filter((item) => item.userName === userName)
            .map((item) => mapWishlistItem(item, productsResponse.data))
        );
      } catch (error) {
        console.error("Error loading wishlist:", error);
      }
    };

    loadWishlist();
  }, [location.pathname]);

  const addToWishlist = async (product) => {
    const userName = getCurrentUserName();

    if (!userName) {
      return;
    }

    const exists = wishlistItems.find(
      (item) => item.productId === product.id
    );

    if (!exists) {
      const response = await api.post("/wishlist", {
        userName,
        productName: product.productName || product.name,
        price: product.price,
      });

      setWishlistItems((items) => [
        ...items,
        mapWishlistItem({
          ...response.data,
          productName: product.productName || product.name,
        }, [product]),
      ]);
    }
  };

  const removeFromWishlist = async (wishlistId) => {
    await api.delete(`/wishlist/${wishlistId}`);
    setWishlistItems((items) =>
      items.filter((item) => item.id !== wishlistId)
    );
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        wishlistCount: wishlistItems.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export default WishlistProvider;