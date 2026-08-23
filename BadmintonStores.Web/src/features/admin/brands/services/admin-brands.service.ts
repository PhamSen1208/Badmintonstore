import { api } from "@/lib/api";
import type { BrandListItem, CreateBrandRequest } from "../types/admin-brands.types";

export async function getBrands(): Promise<BrandListItem[]> {
    const response = await api.get<{ data: BrandListItem[] }>("/api/brands");
    return response.data.data;
}

export async function createBrand(data: CreateBrandRequest): Promise<BrandListItem> {
    const response = await api.post<{ data: BrandListItem }>("/api/brands", data);
    return response.data.data;
}
