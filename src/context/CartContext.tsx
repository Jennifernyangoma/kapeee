import { createContext, useState } from 'react';

export type CartItem = {
    id: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
};

export type CartContextType = {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    isCartSidebarOpen: boolean;
    openCartSidebar: () => void;
    closeCartSidebar: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);
export default CartContext;

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);

    const addToCart = (item: CartItem) => {
        setCart((prev) => {
            const exists = prev.find((p) => p.id === item.id);
            if (exists) {
                return prev.map((p) =>
                    p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
        // Open sidebar when item is added
        setIsCartSidebarOpen(true);
    };

    const removeFromCart = (id: string) => {
        setCart((prev) => prev.filter((p) => p.id !== id));
    };

    const clearCart = () => setCart([]);

    const openCartSidebar = () => setIsCartSidebarOpen(true);
    const closeCartSidebar = () => setIsCartSidebarOpen(false);

    return (
        <CartContext.Provider
            value={{ 
                cart, 
                addToCart, 
                removeFromCart, 
                clearCart,
                isCartSidebarOpen,
                openCartSidebar,
                closeCartSidebar
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
