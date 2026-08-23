import { useEffect, useState } from "react";
import { Plus, RefreshCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryTable } from "../categories/components/CategoryTable";
import { CategoryForm } from "../categories/components/CategoryForm";
import { getCategories, createCategory } from "../categories/services/admin-categories.service";
import type { CategoryListItem, CreateCategoryRequest } from "../categories/types/admin-categories.types";

export function AdminCategoriesPage() {
    const [categories, setCategories] = useState<CategoryListItem[]>([]);
    const [keyword, setKeyword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

    async function loadCategories() {
        try {
            setIsLoading(true);
            setErrorMessage(null);
            const data = await getCategories();
            setCategories(data);
        } catch {
            setErrorMessage("Không thể tải danh sách danh mục.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadCategories();
    }, []);

    async function handleCreateCategory(values: CreateCategoryRequest) {
        try {
            setIsSubmitting(true);
            setErrorMessage(null);
            await createCategory(values);
            setIsCreateFormOpen(false);
            await loadCategories();
        } catch (err: any) {
            setErrorMessage(err?.response?.data?.message || "Không thể tạo danh mục.");
        } finally {
            setIsSubmitting(false);
        }
    }

    const filteredCategories = categories.filter((c) => {
        const q = keyword.trim().toLowerCase();
        if (!q) return true;
        return (
            c.categoryCode.toLowerCase().includes(q) ||
            c.name.toLowerCase().includes(q)
        );
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Quản lý Danh mục</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Danh sách các danh mục phân loại sản phẩm của cửa hàng
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={loadCategories} title="Tải lại">
                        <RefreshCcw className="h-4 w-4 mr-1" /> Tải lại
                    </Button>
                    <Button onClick={() => setIsCreateFormOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="h-4 w-4 mr-1" />
                        Thêm danh mục
                    </Button>
                </div>
            </div>

            <div className="rounded-lg border bg-white p-4">
                <div className="relative max-w-md">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Tìm kiếm theo Tên hoặc Mã danh mục..."
                        className="pl-9"
                    />
                </div>
            </div>

            {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                </div>
            )}

            <CategoryTable categories={filteredCategories} isLoading={isLoading} />

            {isCreateFormOpen && (
                <CategoryForm
                    isSubmitting={isSubmitting}
                    onSubmit={handleCreateCategory}
                    onCancel={() => setIsCreateFormOpen(false)}
                />
            )}
        </div>
    );
}
