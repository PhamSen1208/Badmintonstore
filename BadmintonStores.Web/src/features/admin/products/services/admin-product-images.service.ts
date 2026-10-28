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

export async function uploadProductImage(file: File, productId:number, isPrimary: boolean): Promise<ProductImageItem>{
    const formData = new FormData();
    formData.append("file", file);
    formData.append("productId", productId.toString());
    formData.append("isPrimary", isPrimary.toString());

    const response = await api.post<{data: ProductImageItem}>("/api/productimages/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        },
    });
    return response.data.data;
}

export async function deleteProductImage(id: number): Promise<void> {
    await api.delete(`/api/productimages/${id}`);
}
