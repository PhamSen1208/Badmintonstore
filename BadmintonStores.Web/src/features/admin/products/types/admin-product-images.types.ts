export type ProductImageItem = {
    id: number;
    productId: number;
    productVariantId?: number | null;
    imageUrl: string;
    isPrimary: boolean;
    displayOrder: number;
    createdAt: string;
};

export type AddProductImageRequest = {
    productId: number;
    productVariantId?: number;
    imageUrl: string;
    isPrimary: boolean;
    displayOrder: number;
};
