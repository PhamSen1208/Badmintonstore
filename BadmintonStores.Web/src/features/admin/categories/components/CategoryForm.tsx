import { useState } from "react";
import { Loader2, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CreateCategoryRequest } from "../types/admin-categories.types";

type CategoryFormProps = {
    isSubmitting: boolean;
    onSubmit: (values: CreateCategoryRequest) => Promise<void>;
    onCancel: () => void;
};

export function CategoryForm({ isSubmitting, onSubmit, onCancel }: CategoryFormProps) {
    const [categoryCode, setCategoryCode] = useState("");
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrorMsg(null);

        if (!categoryCode.trim()) {
            setErrorMsg("Mã danh mục không được để trống (VD: CAT-RACKET)");
            return;
        }

        if (!name.trim()) {
            setErrorMsg("Tên danh mục không được để trống");
            return;
        }

        await onSubmit({
            categoryCode: categoryCode.trim().toUpperCase(),
            name: name.trim(),
            slug: slug.trim() || undefined,
            description: description.trim() || undefined,
        });
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4 shadow-xl">
                <div className="flex items-center gap-2 border-b pb-3">
                    <Layers className="h-5 w-5 text-emerald-600" />
                    <h2 className="text-lg font-bold">Thêm Danh Mục Mới</h2>
                </div>

                {errorMsg && (
                    <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Mã danh mục *</label>
                        <Input
                            value={categoryCode}
                            onChange={(e) => setCategoryCode(e.target.value)}
                            placeholder="VD: CAT-RACKET, CAT-SHOES..."
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Tên danh mục *</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="VD: Vợt cầu lông, Giày cầu lông..."
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Slug (URL SEO - tùy chọn)</label>
                        <Input
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="VD: vot-cau-long (tự động tạo nếu để trống)"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Mô tả</label>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Mô tả danh mục..."
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button type="button" variant="outline" disabled={isSubmitting} onClick={onCancel}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700">
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Lưu Danh Mục
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
