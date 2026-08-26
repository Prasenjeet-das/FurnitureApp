import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CartContext } from "./CartContextValue";
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

function mapCartItem(item, products = []) {
  const product = products.find(
    (candidate) => candidate.productName === item.productName
  );

  return {
    ...item,
    productId: item.productId || product?.id,
    name: item.productName,
    image: item.imageUrl || (product?.imageUrl
      ? product.imageUrl
      : ""),
  };
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const userName = getCurrentUserName();

    if (!userName) {
      return;
    }

    const loadCart = async () => {
      setCartLoading(true);

      try {
        const [cartResponse, productsResponse] = await Promise.all([
          api.get("/cart"),
          api.get("/products"),
        ]);
        const userCart = cartResponse.data
          .filter((item) => item.userName === userName)
          .map((item) => mapCartItem(item, productsResponse.data));
        setCartItems(userCart);
      } catch (error) {
        console.error("Error loading cart:", error);
      } finally {
        setCartLoading(false);
      }
    };

    loadCart();
  }, [location.pathname]);

  const addToCart = async (product, quantity = 1) => {
    const userName = getCurrentUserName();

    if (!userName) {
      return;
    }

    const existingProduct = cartItems.find(
      (item) => item.productId === product.id
    );

    if (existingProduct) {
      await updateQuantity(
        existingProduct.id,
        existingProduct.quantity + quantity,
        existingProduct
      );
    } else {
      const response = await api.post("/cart", {
        userName,
        productName: product.productName || product.name,
        price: product.price,
        quantity,
        totalPrice: product.price * quantity,
      });
      setCartItems((items) => [
        ...items,
        mapCartItem({
          ...response.data,
          productId: product.id,
          imageUrl: product.imageUrl || product.image,
        }),
      ]);
    }
  };

  const updateQuantity = async (cartId, quantity, item) => {
    if (quantity < 1) {
      return removeFromCart(cartId);
    }

    const response = await api.put(`/cart/${cartId}`, {
      userName: item.userName || getCurrentUserName(),
      productName: item.productName || item.name,
      quantity,
      price: item.price,
      totalPrice: item.price * quantity,
    });

    setCartItems((items) =>
      items.map((cartItem) =>
        cartItem.id === cartId ? mapCartItem(response.data) : cartItem
      )
    );
  };

  const removeFromCart = async (cartId) => {
    await api.delete(`/cart/${cartId}`);
    setCartItems((items) => items.filter((item) => item.id !== cartId));
  };

  const clearCart = async () => {
    await Promise.all(cartItems.map((item) => api.delete(`/cart/${item.id}`)));
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount: cartItems.reduce((count, item) => count + item.quantity, 0),
        cartLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
