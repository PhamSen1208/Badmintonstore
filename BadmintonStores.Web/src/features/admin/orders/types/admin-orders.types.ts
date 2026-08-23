export type OrderListItem = {
    orderId: number;
    orderCode: string;
    customerId: number | null;
    customerName: string | null;
    status: string;
    paymentStatus: string;
    totalAmount: number;
    address?: string | null;
    orderDate: string;
};

export type GetOrdersParams = {
    customerId?: number;
    paymentStatus?: string;
    status?: string;
    pageNumber?: number;
    pageSize?: number;
};

export type GetOrdersResponse = {
    totalPages: number;
    totalItems: number;
    items: OrderListItem[];
    pageNumber: number;
    pageSize: number;
};

export type GetOrderDetailItem = {
    productVariantId: number;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
};

// Chi tiết thanh toán
export type OrderPaymentDetail = {
    paymentMethod: string;
    paymentStatus: string;
    amount: number;
};

// Response chi tiết đơn hàng
export type GetOrderDetailResponse = {
    orderId: number;
    orderCode: string;
    status: string;
    paymentStatus: string;
    customerId?: number;
    customerName?: string;
    recipientName?: string | null;
    shippingPhone?: string | null;
    shippingAddress?: string | null;
    subtotal: number;
    note: string | null;
    address?: string | null;
    discountAmount: number;
    shippingFee?: number;
    taxRate?: number;
    taxAmount?: number;
    totalAmount: number;
    items: GetOrderDetailItem[];
    payment: OrderPaymentDetail | null;
};

// Request tạo đơn hàng mới
export type CreateOrderItemRequest = {
    productVariantId: number;
    quantity: number;
};

export type CreateOrderRequest = {
    customerId: number;
    warehouseId: number;
    recipientName?: string;
    shippingPhone?: string;
    shippingAddress?: string;
    shippingFee?: number;
    taxRate?: number;
    note?: string;
    address?: string;
    items: CreateOrderItemRequest[];
    payment?: {
        paymentMethod: string;
    };
};

// Request cập nhật ghi chú đơn hàng
export type UpdateOrderNoteRequest = {
    note: string;
};