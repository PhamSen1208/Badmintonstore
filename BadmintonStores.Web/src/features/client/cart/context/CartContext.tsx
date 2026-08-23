import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import type { CartItem, CartContextType } from "../types/cart.types";

const CART_STORAGE_KEY = "badminton_store_cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => {
        try {
            const saved = localStorage.getItem(CART_STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        } catch {
            // Ignored
        }
    }, [items]);

    function addToCart(newItem: Omit<CartItem, "quantity">, qtyToAdd = 1) {
        setItems(prevItems => {
            const existingIndex = prevItems.findIndex(
                item => item.productId === newItem.productId && item.selectedVariant === newItem.selectedVariant
            );

            if (existingIndex > -1) {
                const updated = [...prevItems];
                updated[existingIndex].quantity += qtyToAdd;
                return updated;
            }

            return [...prevItems, { ...newItem, quantity: qtyToAdd }];
        });

        toast.success(`Đã thêm "${newItem.productName}" vào giỏ hàng!`, {
            description: newItem.selectedVariant ? `Phân loại: ${newItem.selectedVariant}` : undefined,
        });
    }

    function removeFromCart(productId: number, variant?: string) {
        setItems(prev => prev.filter(item => !(item.productId === productId && item.selectedVariant === variant)));
        toast.info("Đã xóa sản phẩm khỏi giỏ hàng");
    }

    function updateQuantity(productId: number, quantity: number, variant?: string) {
        if (quantity <= 0) {
            removeFromCart(productId, variant);
            return;
        }

        setItems(prev => prev.map(item => {
            if (item.productId === productId && item.selectedVariant === variant) {
                return { ...item, quantity };
            }
            return item;
        }));
    }

    function clearCart() {
        setItems([]);
    }

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.basePrice * item.quantity, 0);
    const vat = 0; // Giá sản phẩm niêm yết đã bao gồm VAT
    const shippingFee = subtotal >= 1000000 || subtotal === 0 ? 0 : 30000;
    const totalAmount = subtotal + shippingFee;

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                subtotal,
                vat,
                shippingFee,
                totalAmount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart phải được sử dụng trong <CartProvider>");
    }
    return context;
}
