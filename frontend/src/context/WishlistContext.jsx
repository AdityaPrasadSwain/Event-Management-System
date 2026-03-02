import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState([]);

    // Load wishlist from local storage on mount or user change
    useEffect(() => {
        if (user) {
            const savedWishlist = localStorage.getItem(`wishlist_${user.email}`);
            if (savedWishlist) {
                setWishlist(JSON.parse(savedWishlist));
            } else {
                setWishlist([]);
            }
        } else {
            setWishlist([]);
        }
    }, [user]);

    // Save wishlist to local storage whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem(`wishlist_${user.email}`, JSON.stringify(wishlist));
        }
    }, [wishlist, user]);

    const addToWishlist = (event) => {
        if (!isInWishlist(event.id)) {
            setWishlist((prev) => [...prev, event]);
        }
    };

    const removeFromWishlist = (eventId) => {
        setWishlist((prev) => prev.filter((item) => item.id !== eventId));
    };

    const isInWishlist = (eventId) => {
        return wishlist.some((item) => item.id === eventId);
    };

    const clearWishlist = () => {
        setWishlist([]);
    };

    const value = {
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};
