export type CreateOrderItemRequest = {
    productVariantId?: number;
    productId?: number;
    quantity: number;
    unitPrice: number;
}

export type CreateOrderPaymentRequest = {
    paymentMethod: "cash" | "cod" | "bank_transfer"; 
};

export type CreateClientOrderRequest = {
    customerId: number;
    warehouseId: number;
    fullName: string;
    shippingPhone: string;
    shippingAddress: string;
    shippingFee: number;
    discountAmount: number;
    couponCode?: string;
    note?: string;
    items: CreateOrderItemRequest[];
    payment: CreateOrderPaymentRequest;
};

export type CreateClientOrderResponse = {
    orderId: number;
    orderCode: string;
    status: string;
    paymentStatus: string;
    subtotal: number;
    discountAmount: number;
    totalAmount: number;
};
