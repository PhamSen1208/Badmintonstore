export type CartItem = {
    productId: number;
    productCode: string;
    productName: string;
    basePrice: number;
    image?: string;
    selectedVariant?: string;
    quantity: number;
};

export type CartContextType = {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
    removeFromCart: (productId: number, variant?: string) => void;
    updateQuantity: (productId: number, quantity: number, variant?: string) => void;
    clearCart: () => void;
    totalItems: number;
    subtotal: number;
    vat: number;
    shippingFee: number;
    totalAmount: number;
};
