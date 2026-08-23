import { api } from "@/lib/api";
import type { ProductImageItem, AddProductImageRequest } from "../types/admin-product-images.types";

export async function getProductImages(productId: number): Promise<ProductImageItem[]> {
    const response = await api.get<{ data: ProductImageItem[] }>(`/api/productimages/product/${productId}`);
    return response.data.data;
}

export async function addProductImage(data: AddProductImageRequest): Promise<ProductImageItem> {
    const response = await api.post<{ data: ProductImageItem }>("/api/productimages", data);
    return response.data.data;
}
