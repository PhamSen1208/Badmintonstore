import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, RefreshCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VariantTable } from "../product-variants/components/VariantTable";
import type { ProductVariantListItem } from "../product-variants/types/product-variant.types";
import { VariantForm, type VariantFormValues } from "../product-variants/components/VariantForm";
import {
    createProductVariant,
    getProductVariantById,
    getProductVariants,
    updateProductVariant,
    updateProductVariantStatus,
} from "../product-variants/services/product-variant.service";

type ProductVariantFilerStatus = "all" | "active" | "inactive";

export function AdminProductVariantPage() {
    const { productId } = useParams<{ productId: string }>();
    const productIdNum = Number(productId);
    const navigate = useNavigate();

    const [variants, setVariants] = useState<ProductVariantListItem[]>([]);
    const [keyword, setKeyword] = useState("");
    const [status, setStatus] = useState<ProductVariantFilerStatus>("all");
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const [totalPage, setTotalPage] = useState(1);
    const [editingVariant, setEditingVariant] = useState<ProductVariantListItem | null>(null); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

    const loadVariants = async () => {
        try {
            setIsLoading(true);
            setErrorMessage(null);

            const result = await getProductVariants(productIdNum, {
                keyword: keyword.trim() || undefined,
                status: status === "all" ? undefined : status,
                pageNumber,
                pageSize,
            });
            setVariants(result.items); //Lấy danh sách sản phẩm từ response.data.data
            setTotalPage(result.totalPages); //Lấy tổng số trang từ response.data.data
        } catch (error) {
            setErrorMessage("Lỗi khi tải danh sách biến thể");
            setVariants([]);
            setTotalPage(0);
        } finally {
            setIsLoading(false);
        }
    } 

    useEffect(() => {
        loadVariants();
    },[pageNumber, status]);

    //Hàm tìm kiếm
    function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>)
    {
        event.preventDefault();
        setPageNumber(1);
        loadVariants();
    }

    function handleStatusChange(nextStatus: ProductVariantFilerStatus) {
        setStatus(nextStatus);
        setPageNumber(1);
    }

    async function handleViewDetail(variant: ProductVariantListItem) {
        try {
            setIsLoading(true);
            setErrorMessage(null);
            const detail = await getProductVariantById(variant.productVariantId); //Lấy thông tin chi tiết biến thể
            setEditingVariant(detail); //Set thông tin chi tiết biến thể
            setIsCreateFormOpen(false); //Đóng form tạo mới
        } catch {
            setErrorMessage("Không thể tải thông tin biến thể");
        } finally {
            setIsLoading(false);
        }
    }

    //Hàm sửa biến thể
    async function handleEdit(variant: ProductVariantListItem) {
        try {
            setErrorMessage(null);
            const detail = await getProductVariantById(variant.productVariantId); //Lấy thông tin chi tiết biến thể
            setEditingVariant(detail); //Set thông tin chi tiết biến thể
            setIsCreateFormOpen(false); //Đóng form tạo mới
        } catch {
            setErrorMessage("Không thể tải thông tin biến thể");
        }
    }
    //Hàm thay đổi trạng thái biến thể
    async function handleToggleStatus(variant: ProductVariantListItem) {
        const currentStatus = variant.status.toLowerCase();
        const nextStatus = currentStatus === "active" ? "inactive" : "active";

        try {
            setErrorMessage(null);
            await updateProductVariantStatus(variant.productVariantId, {
                status: nextStatus
            });
            await loadVariants();
        } catch {
            setErrorMessage("Không thể cập nhật trạng thái sản phẩm");
        }
    }

        return (
            <div className="space-y-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-x-7">
                        <Button 
                            type="button"
                            size="default"
                            onClick={() => navigate("/admin/products")}
                            title="Quay lại danh sách sản phẩm"
                            className="bg-black hover:bg-white hover:text-black hover:border-black transition-all duration-200 ease-in-out"
                            >
                            <ArrowLeft className="h-4 w-8" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">Biến thể sản phẩm</h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Quản lý danh sách biến thể sản phẩm của cửa hàng
                            </p>
                        </div>
                    </div>
    
                    <Button 
                        type="button"
                        onClick={() => {
                            setIsCreateFormOpen(true);
                            setEditingVariant(null); //Đóng form update
                        }}
                        >
                        <Plus className="h-4 w-4" />
                        Thêm mới
                    </Button>
                </div>
    
                <div className="rounded-lg border bg-white p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        {/* Thanh tìm kiếm và lọc trạng thái */}
                        <form
                            onSubmit={handleSearchSubmit}
                            className="flex w-full gap-2 lg:max-w-md">
                            {/* Thanh tìm kiếm */}
                            <div className="relative flex-1">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={keyword}
                                    onChange={(event) => setKeyword(event.target.value)}
                                    placeholder="Tìm kiếm theo mã SKU hoặc tên biến thể..."
                                    className="pl-9" />
                            </div>
                            <Button type="submit" variant="outline">
                                Tìm kiếm
                            </Button>
                        </form>
    
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant={status === "all" ? "default" : "outline"}
                                onClick={() => handleStatusChange("all")}
                            >
                                Tất cả
                            </Button>
                            <Button
                                type="button"
                                variant={status === "active" ? "default" : "outline"}
                                onClick={() => handleStatusChange("active")}
                            >
                                Đang bán
                            </Button>
                            <Button
                                type="button"
                                variant={status === "inactive" ? "default" : "outline"}
                                onClick={() => handleStatusChange("inactive")}>
                                Ngừng bán
                            </Button>
    
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                title="Tải lại"
                                onClick={loadVariants}>
                                <RefreshCcw className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
    
                {/* Form them moi san pham */}
                {isCreateFormOpen && (
                <VariantForm
                    mode="create"
                    isSubmitting={isSubmitting}
                    onSubmit={handleCreateVariant}
                    onCancel={() => setIsCreateFormOpen(false)}
                />
                )}
                {editingVariant && (
                    <VariantForm
                        mode="update" 
                        initialValues={{
                            sku: editingVariant.sku,
                            price: editingVariant.price,
                            salePrice: editingVariant.salePrice ?? undefined,
                            weight: editingVariant.weight ?? undefined,
                            color: editingVariant.color ?? undefined,
                            size: editingVariant.size ?? undefined,
                        }}
                        isSubmitting={isSubmitting}
                        onSubmit={handleUpdateVariant}
                        onCancel={() => setEditingVariant(null)}
                    />
                )}
                {errorMessage && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {errorMessage}
                    </div>
                )}
                {/* Bang bien the */}
                <VariantTable
                    variants={variants}
                    isLoading={isLoading}
                    onViewDetail={handleViewDetail} 
                    onEdit={handleEdit}
                    onToggleStatus={handleToggleStatus}
                />
                {/* Phan trang */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Trang {pageNumber}/{totalPage}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={pageNumber <= 1 || isLoading}
                            onClick={() => setPageNumber((current) => current - 1)}>
                            Trang trước
                        </Button>
    
                        <Button
                            type="button"
                            variant="outline"
                            disabled={pageNumber >= totalPage || isLoading}
                            onClick={() => setPageNumber((current) => current + 1)}>
                            Trang sau
                        </Button>
                    </div>
                </div>
    
            </div>
        )
    
        //Thêm mới biến thể sản phẩm
        async function handleCreateVariant(values: VariantFormValues) {
            try {
                setIsSubmitting(true); 
                setErrorMessage(null);
                
                await createProductVariant(productIdNum, {
                    sku: values.sku ?? "",
                    price: values.price,
                    salePrice: values.salePrice,
                    weight: values.weight,
                    color: values.color,
                    size: values.size,
                });
                setIsCreateFormOpen(false); // Đóng form sau khi xong
               if(pageNumber === 1)
               {
                await loadVariants ();
               }
               else
               {
                setPageNumber(1);
               }  
            } catch (error) {
                setErrorMessage("Không thể tạo sản phẩm. Vui lòng kiểm tra lại thông tin.");
            } finally {
                setIsSubmitting(false);
            }
        }
    
        //Cập nhật sản phẩm
        async function handleUpdateVariant(values: VariantFormValues)
        {
            if(!editingVariant)
            {
                return;
            }
            try {
                setIsSubmitting(true);
                setErrorMessage(null);
    
                await updateProductVariant(editingVariant.productVariantId, {
                    price: values.price,
                    salePrice: values.salePrice,
                    weight: values.weight,
                    color: values.color?.trim() || undefined, 
                    size: values.size?.trim() || undefined,
                });
                setEditingVariant(null);// Về chế độ xem
                await loadVariants();
            } catch {
                setErrorMessage("Không thể cập nhật biến thể sản phẩm. Vui lòng kiểm tra lại thông tin.");
            } finally {
                setIsSubmitting(false);
            }
        }

}