import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],
            
            addToCart: (product, quantity = 1) => {
                const currentItems = get().items;
                const existingItem = currentItems.find(item => item.product._id === product._id);
                
                if (existingItem) {
                    set({
                        items: currentItems.map(item => 
                            item.product._id === product._id 
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                        )
                    });
                } else {
                    set({ items: [...currentItems, { product, quantity }] });
                }
            },
            
            removeFromCart: (productId) => {
                set({
                    items: get().items.filter(item => item.product._id !== productId)
                });
            },
            
            updateQuantity: (productId, quantity) => {
                if (quantity < 1) return;
                set({
                    items: get().items.map(item => 
                        item.product._id === productId 
                        ? { ...item, quantity }
                        : item
                    )
                });
            },
            
            clearCart: () => set({ items: [] }),
            
            getCartTotal: () => {
                return get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
            }
        }),
        {
            name: 'hungryhunt-cart'
        }
    )
);
