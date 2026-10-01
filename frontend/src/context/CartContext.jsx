import { useEffect, useState } from 'react';
import { CartContext } from './CartContextValue';

const CART_STORAGE_KEY = 'amazonCart';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
      return Array.isArray(storedCart) ? storedCart : [];
    } catch {
      localStorage.removeItem(CART_STORAGE_KEY);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    if (!product?._id) return { success: false, message: 'This product is unavailable.' };

    setCartItems((items) => {
      const existing = items.find((item) => item.product === product._id);
      if (existing) {
        return items.map((item) => item.product === product._id
          ? { ...item, qty: item.qty + 1 }
          : item);
      }

      return [...items, {
        product: product._id,
        name: product.name,
        image: product.image || product.images?.[0],
        price: Number(product.price || 0),
        qty: 1,
      }];
    });

    return { success: true };
  };

  const removeFromCart = (id) => setCartItems((items) => items.filter((item) => item.product !== id));

  const updateQuantity = (id, qty) => setCartItems((items) => items.map((item) => (
    item.product === id ? { ...item, qty: Math.max(1, Number(qty) || 1) } : item
  )));

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
