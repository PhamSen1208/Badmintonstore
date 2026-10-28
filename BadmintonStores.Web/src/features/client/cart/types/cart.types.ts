export type CartItem = {
    productId: number;
    productVariantId: number;
    productCode: string;
    productName: string;
    basePrice: number;
    image?: string;
    selectedVariant?: string;//Tên hiển thị
    quantity: number;
};

export type CartContextType = {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
    removeFromCart: (productVariantId: number) => void;
    updateQuantity: (productVariantId: number, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    subtotal: number;
    vat: number;
    shippingFee: number;
    totalAmount: number;
};
