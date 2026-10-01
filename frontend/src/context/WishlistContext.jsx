import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContextValue';
import { useCart } from './CartContextValue';
import { WishlistContext } from './WishlistContextValue';

export const WishlistProvider = ({ children }) => {
  const [wishlistState, setWishlistState] = useState({ userId: null, wishlist: null });
  const { user } = useAuth();
  const { fetchCart } = useCart();
  const userId = user?._id || null;
  const hasLoadedUser = wishlistState.userId === userId;
  const wishlist = user && hasLoadedUser ? wishlistState.wishlist : null;
  const loading = Boolean(user && !hasLoadedUser);

  const fetchWishlist = async () => {
    if (!userId) return;
    try {
      const { data } = await api.get('/api/wishlist');
      setWishlistState({ userId, wishlist: data.wishlist });
    } catch (error) {
      console.error('Error fetching wishlist', error);
    }
  };

  useEffect(() => {
    if (!userId) return undefined;

    let isActive = true;
    api.get('/api/wishlist')
      .then(({ data }) => {
        if (isActive) setWishlistState({ userId, wishlist: data.wishlist });
      })
      .catch((error) => {
        console.error('Error fetching wishlist', error);
        if (isActive) setWishlistState({ userId, wishlist: null });
      });

    return () => {
      isActive = false;
    };
  }, [userId]);

  const toggleWishlist = async (productId) => {
    try {
      const { data } = await api.post('/api/wishlist/toggle', { productId });
      setWishlistState({ userId, wishlist: data.wishlist });
      const isAdded = data.message.includes('added');
      return { success: true, isAdded };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error updating wishlist.'
      };
    }
  };

  const moveWishlistToCart = async (productId) => {
    try {
      await api.post('/api/wishlist/move-to-cart', { productId });
      // Refresh both states
      await fetchWishlist();
      await fetchCart();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error moving item to cart.'
      };
    }
  };

  const hasItem = (productId) => {
    if (!wishlist || !wishlist.products) return false;
    return wishlist.products.some(p => p._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, toggleWishlist, moveWishlistToCart, hasItem, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
