import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext"; // to scope cart per logged-in user

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();

  // key used for persisting cart in localStorage; includes user identifier when available
  const storageKey = user ? `cart_${user._id || user.email}` : "cart_guest";

  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  /* ========= SAVE TO LOCAL STORAGE ========= */
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cart));
  }, [cart, storageKey]);

  // when the user (or corresponding storage key) changes we reload the cart
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      setCart(stored ? JSON.parse(stored) : []);
    } catch {
      setCart([]);
    }
  }, [storageKey]);

  /* ========= ADD TO CART ========= */
  const addToCart = (build) => {
    setCart(prev => {
      // assign a unique identifier if the incoming build doesn't have one
      const id = build.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      // prevent duplicate builds by id
      const exists = prev.find(item => item.id === id);
      if (exists) return prev;

      return [...prev, { ...build, id, qty: 1 }];
    });
  };

  /* ========= REMOVE ========= */
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  /* ========= CHANGE QTY ========= */
  const changeQty = (id, type) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              qty: type === "inc"
                ? item.qty + 1
                : Math.max(1, item.qty - 1)
            }
          : item
      )
    );
  };

  /* ========= UPDATE BUILD ========= */
  // merge new data into an existing cart entry (components, price, etc.)
  const updateCartItem = (id, changes) => {
    setCart(prev =>
      prev.map(item => (item.id === id ? { ...item, ...changes } : item))
    );
  };

  /* ========= CLEAR ========= */
  const clearCart = () => setCart([]);

  // if user logs out or changes, we might also clear guest or previous user cart if desired

  /* ========= TOTAL ITEMS ========= */
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        addToCart,
        removeFromCart,
        changeQty,
        updateCartItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);