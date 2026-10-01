import { useState, useEffect } from 'react';
import { CartContext } from './CartContextValue';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem('amazonCart');
    if (!storedCart) return [];

    try {
      const parsedCart = JSON.parse(storedCart);
      return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (error) {
      console.error('Unable to restore saved cart', error);
      localStorage.removeItem('amazonCart');
      return [];
    }
  });

  // Save to localStorage every time the cart updates
  useEffect(() => {
    localStorage.setItem('amazonCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Check if item is already in cart
      const itemExists = prevItems.find((item) => item.product === product._id);
      
      if (itemExists) {
        // Increase quantity if it exists
        return prevItems.map((item) =>
          item.product === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        // Add new item to cart
        return [...prevItems, { 
          product: product._id, 
          name: product.name, 
          image: product.image, 
          price: product.price, 
          qty: 1 
        }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product !== id));
  };

  const updateQuantity = (id, qty) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.product === id ? { ...item, qty: Number(qty) } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};  
