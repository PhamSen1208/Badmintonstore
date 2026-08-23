import { useState } from "react";
import { Loader2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CreateBrandRequest } from "../types/admin-brands.types";

type BrandFormProps = {
    isSubmitting: boolean;
    onSubmit: (values: CreateBrandRequest) => Promise<void>;
    onCancel: () => void;
};

export function BrandForm({ isSubmitting, onSubmit, onCancel }: BrandFormProps) {
    const [brandCode, setBrandCode] = useState("");
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [logoUrl, setLogoUrl] = useState("");
    const [description, setDescription] = useState("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrorMsg(null);

        if (!brandCode.trim()) {
            setErrorMsg("Mã thương hiệu không được để trống (VD: BR-YONEX)");
            return;
        }

        if (!name.trim()) {
            setErrorMsg("Tên thương hiệu không được để trống");
            return;
        }

        await onSubmit({
            brandCode: brandCode.trim().toUpperCase(),
            name: name.trim(),
            slug: slug.trim() || undefined,
            logoUrl: logoUrl.trim() || undefined,
            description: description.trim() || undefined,
        });
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4 shadow-xl">
                <div className="flex items-center gap-2 border-b pb-3">
                    <Tag className="h-5 w-5 text-emerald-600" />
                    <h2 className="text-lg font-bold">Thêm Thương Hiệu Mới</h2>
                </div>

                {errorMsg && (
                    <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Mã thương hiệu *</label>
                        <Input
                            value={brandCode}
                            onChange={(e) => setBrandCode(e.target.value)}
                            placeholder="VD: BR-YONEX, BR-VICTOR..."
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Tên thương hiệu *</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="VD: Yonex, Victor, Li-Ning..."
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Slug (URL SEO - tùy chọn)</label>
                        <Input
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="VD: yonex, victor (tự động tạo nếu để trống)"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Link Logo (URL)</label>
                        <Input
                            value={logoUrl}
                            onChange={(e) => setLogoUrl(e.target.value)}
                            placeholder="https://example.com/logo.png"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Mô tả</label>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Mô tả thương hiệu..."
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button type="button" variant="outline" disabled={isSubmitting} onClick={onCancel}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700">
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Lưu Thương Hiệu
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
