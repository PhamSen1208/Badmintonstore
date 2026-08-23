import { useEffect, useState } from "react";
import { Image as ImageIcon, Loader2, Plus, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProductListItem } from "../types/admin-product.types";
import type { ProductImageItem } from "../types/admin-product-images.types";
import { getProductImages, addProductImage } from "../services/admin-product-images.service";

type ProductImageModalProps = {
    product: ProductListItem;
    onClose: () => void;
};

export function ProductImageModal({ product, onClose }: ProductImageModalProps) {
    const [images, setImages] = useState<ProductImageItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState("");
    const [isPrimary, setIsPrimary] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    async function loadImages() {
        try {
            setIsLoading(true);
            setErrorMsg(null);
            const data = await getProductImages(product.productId);
            setImages(data);
        } catch {
            setErrorMsg("Không thể tải danh sách ảnh sản phẩm.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadImages();
    }, [product.productId]);

    async function handleAddImage(e: React.FormEvent) {
        e.preventDefault();
        setErrorMsg(null);
        setSuccessMsg(null);

        if (!newImageUrl.trim()) {
            setErrorMsg("Vui lòng nhập Link ảnh (URL)");
            return;
        }

        try {
            setIsAdding(true);
            await addProductImage({
                productId: product.productId,
                imageUrl: newImageUrl.trim(),
                isPrimary: isPrimary || images.length === 0,
                displayOrder: images.length + 1,
            });
            setNewImageUrl("");
            setIsPrimary(false);
            setSuccessMsg("Thêm ảnh sản phẩm thành công!");
            await loadImages();
        } catch {
            setErrorMsg("Không thể thêm ảnh. Kiểm tra lại đường dẫn link ảnh.");
        } finally {
            setIsAdding(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
                <div className="flex justify-between items-start border-b pb-3">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <ImageIcon className="h-5 w-5 text-blue-600" />
                            Thư viện Ảnh sản phẩm
                        </h2>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Sản phẩm: <span className="font-semibold text-slate-800">{product.productName}</span> ({product.productCode})
                        </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        ✕
                    </Button>
                </div>

                {errorMsg && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {errorMsg}
                    </div>
                )}

                {successMsg && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 flex items-center gap-1.5">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                        {successMsg}
                    </div>
                )}

                {/* Form Thêm Ảnh Mới */}
                <form onSubmit={handleAddImage} className="bg-slate-50 p-4 rounded-lg border space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-800">Thêm URL Ảnh Mới:</h3>
                        <span className="text-[11px] text-blue-600 font-medium">
                            💡 Chuột phải vào ảnh ➔ Chọn "Copy Image Address" để lấy link ảnh trực tiếp
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <Input
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            placeholder="VD: https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600"
                            className="bg-white flex-1 text-sm"
                        />
                        <Button type="submit" disabled={isAdding} className="bg-blue-600 hover:bg-blue-700">
                            {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />}
                            Thêm ảnh
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isPrimaryCheckbox"
                            checked={isPrimary}
                            onChange={(e) => setIsPrimary(e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                        />
                        <label htmlFor="isPrimaryCheckbox" className="text-xs font-medium text-slate-700 cursor-pointer">
                            Đặt làm Ảnh đại diện chính (IsPrimary)
                        </label>
                    </div>
                </form>

                {/* Thư viện Ảnh */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-800">Danh sách Ảnh hiện có ({images.length}):</h3>
                    {isLoading ? (
                        <div className="p-8 text-center text-sm text-muted-foreground">Đang tải ảnh...</div>
                    ) : images.length === 0 ? (
                        <div className="p-8 text-center text-sm text-muted-foreground border rounded-lg bg-slate-50">
                            Chưa có ảnh nào trong thư viện. Thêm đường dẫn link ảnh ở trên để bắt đầu!
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {images.map((img) => (
                                <ImageCard key={img.id} img={img} />
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end pt-3 border-t">
                    <Button variant="outline" onClick={onClose}>
                        Đóng
                    </Button>
                </div>
            </div>
        </div>
    );
}

function ImageCard({ img }: { img: ProductImageItem }) {
    const [hasError, setHasError] = useState(false);

    return (
        <div className="relative group rounded-lg border bg-slate-50 overflow-hidden space-y-2 p-2">
            <div className="aspect-square w-full rounded overflow-hidden bg-white border flex items-center justify-center relative">
                {hasError ? (
                    <div className="p-2 text-center text-xs text-red-500 space-y-1">
                        <p className="font-semibold">⚠️ Lỗi tải ảnh</p>
                        <p className="text-[10px] text-slate-400 break-all line-clamp-2">
                            Cần link trực tiếp (.jpg/.png)
                        </p>
                    </div>
                ) : (
                    <img
                        src={img.imageUrl}
                        alt="Product"
                        className="h-full w-full object-contain"
                        onError={() => setHasError(true)}
                    />
                )}
            </div>
            <div className="flex items-center justify-between">
                {img.isPrimary ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        <Star className="h-3 w-3 mr-0.5 fill-amber-500 text-amber-500" /> Ảnh đại diện
                    </span>
                ) : (
                    <span className="text-[10px] text-muted-foreground">Thứ tự #{img.displayOrder}</span>
                )}
            </div>
        </div>
    );
}
