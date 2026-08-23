import { useEffect, useState } from "react";
import { Plus, RefreshCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandTable } from "../brands/components/BrandTable";
import { BrandForm } from "../brands/components/BrandForm";
import { getBrands, createBrand } from "../brands/services/admin-brands.service";
import type { BrandListItem, CreateBrandRequest } from "../brands/types/admin-brands.types";

export function AdminBrandsPage() {
    const [brands, setBrands] = useState<BrandListItem[]>([]);
    const [keyword, setKeyword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

    async function loadBrands() {
        try {
            setIsLoading(true);
            setErrorMessage(null);
            const data = await getBrands();
            setBrands(data);
        } catch {
            setErrorMessage("Không thể tải danh sách thương hiệu.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadBrands();
    }, []);

    async function handleCreateBrand(values: CreateBrandRequest) {
        try {
            setIsSubmitting(true);
            setErrorMessage(null);
            await createBrand(values);
            setIsCreateFormOpen(false);
            await loadBrands();
        } catch (err: any) {
            setErrorMessage(err?.response?.data?.message || "Không thể tạo thương hiệu.");
        } finally {
            setIsSubmitting(false);
        }
    }

    const filteredBrands = brands.filter((b) => {
        const q = keyword.trim().toLowerCase();
        if (!q) return true;
        return (
            b.brandCode.toLowerCase().includes(q) ||
            b.name.toLowerCase().includes(q)
        );
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Quản lý Thương hiệu</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Danh sách các thương hiệu sản phẩm cầu lông của cửa hàng
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={loadBrands} title="Tải lại">
                        <RefreshCcw className="h-4 w-4 mr-1" /> Tải lại
                    </Button>
                    <Button onClick={() => setIsCreateFormOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="h-4 w-4 mr-1" />
                        Thêm thương hiệu
                    </Button>
                </div>
            </div>

            <div className="rounded-lg border bg-white p-4">
                <div className="relative max-w-md">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Tìm kiếm theo Tên hoặc Mã thương hiệu..."
                        className="pl-9"
                    />
                </div>
            </div>

            {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                </div>
            )}

            <BrandTable brands={filteredBrands} isLoading={isLoading} />

            {isCreateFormOpen && (
                <BrandForm
                    isSubmitting={isSubmitting}
                    onSubmit={handleCreateBrand}
                    onCancel={() => setIsCreateFormOpen(false)}
                />
            )}
        </div>
    );
}
