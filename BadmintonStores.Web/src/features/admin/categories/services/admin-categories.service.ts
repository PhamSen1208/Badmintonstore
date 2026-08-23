import { api } from "@/lib/api";
import type { CategoryListItem, CreateCategoryRequest } from "../types/admin-categories.types";

export async function getCategories(): Promise<CategoryListItem[]> {
    const response = await api.get<{ data: CategoryListItem[] }>("/api/categories");
    return response.data.data;
}

export async function createCategory(data: CreateCategoryRequest): Promise<CategoryListItem> {
    const response = await api.post<{ data: CategoryListItem }>("/api/categories", data);
    return response.data.data;
}
