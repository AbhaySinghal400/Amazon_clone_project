import { useState, useEffect } from 'react';
import { CartContext, useCart } from './CartContextValue';

export { useCart, CartContext };

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem('amazonCart');
    if (!storedCart) return [];

    try {
      const parsedCart = JSON.parse(storedCart);
      if (!Array.isArray(parsedCart)) return [];
      // Filter out invalid items that have no valid product ID
      return parsedCart.filter(item => item && item.product);
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

  const addToCart = async (productOrId, quantity = 1) => {
    try {
      let productObj = productOrId;
      const qtyToAdd = Number(quantity) || 1;

      // If an ID string was passed instead of product object, look up in cart or fetch
      if (typeof productOrId === 'string') {
        const existing = cartItems.find((item) => item.product === productOrId);
        if (existing) {
          productObj = {
            _id: existing.product,
            name: existing.name,
            image: existing.image,
            price: existing.price,
          };
        } else {
          try {
            const res = await fetch(`/api/products/${productOrId}`);
            if (res.ok) {
              productObj = await res.json();
            }
          } catch (e) {
            console.error('Failed to fetch product for cart:', e);
          }
        }
      }

      if (!productObj || !productObj._id) {
        return { success: false, message: 'Invalid product details' };
      }

      const prodId = productObj._id;
      const prodName = productObj.name || 'Amazon Product';
      const prodImage = productObj.image || (productObj.images && productObj.images[0]) || '';
      const prodPrice = Number(productObj.price) || 0;

      setCartItems((prevItems) => {
        const itemExists = prevItems.find((item) => item.product === prodId);
        
        if (itemExists) {
          return prevItems.map((item) =>
            item.product === prodId ? { ...item, qty: item.qty + qtyToAdd } : item
          );
        } else {
          return [...prevItems, { 
            product: prodId, 
            name: prodName, 
            image: prodImage, 
            price: prodPrice, 
            qty: qtyToAdd 
          }];
        }
      });

      return { success: true, message: 'Item added to cart successfully!' };
    } catch (err) {
      console.error('addToCart error:', err);
      return { success: false, message: 'Failed to add item to cart.' };
    }
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
