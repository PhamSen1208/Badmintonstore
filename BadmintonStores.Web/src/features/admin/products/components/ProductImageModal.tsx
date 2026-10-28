import { useEffect, useState } from "react";
import { Image as ImageIcon, Loader2, Plus, Star, CheckCircle, Upload, Trash2 } from "lucide-react";import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProductListItem } from "../types/admin-product.types";
import type { ProductImageItem } from "../types/admin-product-images.types";
import { getProductImages, addProductImage, uploadProductImage, deleteProductImage  } from "../services/admin-product-images.service";



type ProductImageModalProps = {
    product: ProductListItem;
    onClose: () => void;
};

export function ProductImageModal({ product, onClose }: ProductImageModalProps) {
    const [images, setImages] = useState<ProductImageItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const [selected, setSelectedFile] = useState<File | null>(null);
    const [uploadMode, setUploadMode] = useState<"file" | "url">("file"); // Cho phép chọn upload file từ máy hoặc dán link URL

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

    async function handleUploadFile(e: React.FormEvent) {
        e.preventDefault();
        if (!selected) {
            setErrorMsg("Vui lòng chọn file ảnh trước");
            return;
        }

        // 1. Kiểm tra số lượng ảnh tối đa
        if (images.length >= 8) {
            setErrorMsg("Sản phẩm đã có đủ 8 ảnh. Vui lòng xóa bớt ảnh cũ trước khi tải thêm.");
            return;
        }

        const img = new window.Image();
        const objectUrl = URL.createObjectURL(selected);
        img.src = objectUrl;

        img.onload = async () => {
            URL.revokeObjectURL(objectUrl);

            if (img.width < 400 || img.height < 400) {
                setErrorMsg(`Kích thước ảnh quá nhỏ (${img.width}x${img.height}px). Kích thước tối thiểu là 400x400px.`);
                return;
            }

            // Tùy chọn: Cảnh báo nếu tỷ lệ quá lệch (ảnh quá dẹt hoặc quá dài)
            const ratio = img.width / img.height;
            if (ratio < 0.6 || ratio > 1.8) {
                setErrorMsg("Tỷ lệ ảnh không phù hợp. Vui lòng chọn ảnh gần vuông (tỷ lệ 1:1) để hiển thị đẹp nhất.");
                return;
            }

            // Đủ điều kiện -> Tiến hành tải lên
            try {
                setIsAdding(true);
                setErrorMsg(null);
                setSuccessMsg(null);

                await uploadProductImage(selected, product.productId, isPrimary || images.length === 0);
                setSelectedFile(null);
                setIsPrimary(false);
                setSuccessMsg("Tải ảnh thành công!");
                await loadImages();
            } catch {
                setErrorMsg("Không thể tải ảnh. Vui lòng thử lại.");
            } finally {
                setIsAdding(false);
            }
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            setErrorMsg("File ảnh bị lỗi hoặc không thể đọc được.");
        };
    }

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

    async function handleDeleteImage(id:number) {
        if(!window.confirm("Bạn có chắc muốn xóa ảnh này không?"))
        {
            return;
        }
        try {
            setIsLoading(true);
            setErrorMsg(null);
            setSuccessMsg(null);
            await deleteProductImage(id);
            setSuccessMsg("Xóa ảnh thành công!");
            await loadImages();
        } catch {
            setErrorMsg("Không thể xóa ảnh. Vui lòng thử lại");
        }
        finally
        {
            setIsLoading(false);
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

            {/* Chuyển đổi chế độ tải ảnh */}
            <div className="bg-slate-50 p-4 rounded-xl border space-y-4">
                <div className="flex gap-2 border-b pb-2">
                    <button
                        type="button"
                        onClick={() => setUploadMode("file")}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                            uploadMode === "file" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-200"
                        }`}
                    >
                        📁 Tải ảnh từ máy tính
                    </button>
                    <button
                        type="button"
                        onClick={() => setUploadMode("url")}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                            uploadMode === "url" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-200"
                        }`}
                    >
                        🔗 Dán link ảnh (URL)
                    </button>
                </div>

                {uploadMode === "file" ? (
                    <form onSubmit={handleUploadFile} className="space-y-3">
                        <div className="flex items-center gap-2">
                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/jpg, image/webp"
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                className="text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 flex-1 border rounded-xl p-1 bg-white"
                            />
                            <Button type="submit" disabled={isAdding || !selected} className="bg-blue-600 hover:bg-blue-700">
                                {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-1" />}
                                Tải lên
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isPrimaryFile"
                                checked={isPrimary}
                                onChange={(e) => setIsPrimary(e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 h-4 w-4"
                            />
                            <label htmlFor="isPrimaryFile" className="text-xs font-medium text-slate-700 cursor-pointer">
                                Đặt làm Ảnh đại diện chính
                            </label>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleAddImage} className="space-y-3">
                        <div className="flex gap-2">
                            <Input
                                value={newImageUrl}
                                onChange={(e) => setNewImageUrl(e.target.value)}
                                placeholder="VD: https://images.unsplash.com/photo-..."
                                className="bg-white flex-1 text-xs"
                            />
                            <Button type="submit" disabled={isAdding} className="bg-blue-600 hover:bg-blue-700">
                                {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />}
                                Thêm link
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isPrimaryUrl"
                                checked={isPrimary}
                                onChange={(e) => setIsPrimary(e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 h-4 w-4"
                            />
                            <label htmlFor="isPrimaryUrl" className="text-xs font-medium text-slate-700 cursor-pointer">
                                Đặt làm Ảnh đại diện chính
                            </label>
                        </div>
                    </form>
                )}
            </div>

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
                                <ImageCard key={img.id} img={img} onDelete={handleDeleteImage}/>
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

function ImageCard({ img, onDelete }: { img: ProductImageItem; onDelete: (id: number) => void }) {
    const [hasError, setHasError] = useState(false);
    const fullImageUrl = img.imageUrl.startsWith("http")
        ? img.imageUrl
        : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5006"}${img.imageUrl}`;

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
                        src={fullImageUrl}
                        alt="Product"
                        className="h-full w-full object-contain"
                        onError={() => setHasError(true)}
                    />
                )}

                {/* Nút Xóa ảnh màu đỏ xuất hiện khi hover */}
                <button
                    type="button"
                    onClick={() => onDelete(img.id)}
                    title="Xóa ảnh này"
                    className="absolute top-1.5 right-1.5 h-7 w-7 rounded-lg bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition-all hover:scale-110 cursor-pointer"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
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
