import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, RefreshCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductTable } from "../products/components/ProductTable";
import type { GetProductDetailResponse, ProductListItem } from "../products/types/admin-product.types";
import { ProductForm, type ProductFormValues } from "../products/components/ProductForm";
import { ProductImageModal } from "../products/components/ProductImageModal";
import { getCategories } from "@/features/admin/categories/services/admin-categories.service";
import { getBrands } from "@/features/admin/brands/services/admin-brands.service";
import type { CategoryListItem } from "@/features/admin/categories/types/admin-categories.types";
import type { BrandListItem } from "@/features/admin/brands/types/admin-brands.types";
import {
  createProduct,
  getProductById,
  getProducts,
  updateProduct,
  updateProductStatus,
} from "../products/services/admin-product.service";
type ProductFilterStatus = "all" | "active" | "inactive";

export function AdminProductsPage() {
    const [searchParams] = useSearchParams();
    const urlCategoryId = searchParams.get("categoryId");

    const [products, setProducts] = useState<ProductListItem[]>([]);
    const [categories, setCategories] = useState<CategoryListItem[]>([]);
    const [brands, setBrands] = useState<BrandListItem[]>([]);

    const [keyword, setKeyword] = useState("");
    const [status, setStatus] = useState<ProductFilterStatus>("all");
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(
        urlCategoryId ? Number(urlCategoryId) : undefined
    );
    const [selectedBrandId, setSelectedBrandId] = useState<number | undefined>(undefined);

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const [totalPage, setTotalPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingProduct, setEditingProduct] = useState<GetProductDetailResponse | null>(null);
    const [selectedImageProduct, setSelectedImageProduct] = useState<ProductListItem | null>(null);

    const navigate = useNavigate();

    // Tự động cập nhật selectedCategoryId khi URL thay đổi (VD click sub-menu ở Sidebar)
    useEffect(() => {
        const catId = searchParams.get("categoryId");
        if (catId) {
            setSelectedCategoryId(Number(catId));
        } else {
            setSelectedCategoryId(undefined);
        }
        setPageNumber(1);
    }, [searchParams]);

    // Lấy danh sách Categories & Brands cho bộ lọc
    useEffect(() => {
        async function fetchFilterDropdowns() {
            try {
                const [cats, bnds] = await Promise.all([getCategories(), getBrands()]);
                setCategories(cats);
                setBrands(bnds);
            } catch {
                // Fallback nếu lỗi
            }
        }
        fetchFilterDropdowns();
    }, []);

    //Lấy danh sách sản phẩm
    async function loadProducts() {
        try {
            setIsLoading(true);
            setErrorMessage(null);

            const result = await getProducts({
                keyword: keyword.trim() || undefined,
                status: status === "all" ? undefined : status,
                categoryId: selectedCategoryId,
                brandId: selectedBrandId,
                pageNumber,
                pageSize,
            });
            setProducts(result.items);
            setTotalPage(result.totalPages);
        } catch {
            setErrorMessage("Lỗi khi tải danh sách sản phẩm"); 
            setProducts([]);
            setTotalPage(0);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadProducts();
    }, [pageNumber, status, selectedCategoryId, selectedBrandId]);

    function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setPageNumber(1);
        loadProducts();
    }

    function handleStatusChange(nextStatus: ProductFilterStatus) {
        setStatus(nextStatus);
        setPageNumber(1);
    }

    // Xem chi tiết hoặc mở form chỉnh sửa sản phẩm
    async function handleViewOrEdit(product: ProductListItem) {
        try {
            setErrorMessage(null);
            const detail = await getProductById(product.productId);
            setEditingProduct(detail);
            setIsCreateFormOpen(false);
        } catch {
            setErrorMessage("Không thể tải thông tin sản phẩm");
        }
    }

    async function handleToggleStatus(product: ProductListItem) {
        const currentStatus = product.status.toLowerCase();
        const nextStatus = currentStatus === "active" ? "inactive" : "active";

        try {
            setErrorMessage(null);
            await updateProductStatus(product.productId, {
                status: nextStatus
            });
            await loadProducts();
        } catch {
            setErrorMessage("Không thể cập nhật trạng thái sản phẩm");
        }
    }

    function handleViewVariants(product: ProductListItem) {
        navigate(`/admin/products/${product.productId}/variants`);
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Sản phẩm</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Quản lý danh sách sản phẩm và biến thể của cửa hàng
                    </p>
                </div>
                <Button 
                    type="button"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => {
                        setIsCreateFormOpen(true);
                        setEditingProduct(null); //Đóng form update
                    }}
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Thêm mới
                </Button> 
            </div>

            <div className="rounded-lg border bg-white p-4 space-y-3">
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
                                placeholder="Tìm kiếm theo mã hoặc tên sản phẩm..."
                                className="pl-9" />
                        </div>
                        <Button type="submit" variant="outline">
                            Tìm kiếm
                        </Button>
                    </form>

                    <div className="flex flex-wrap gap-2 items-center">
                        {/* Lọc theo Danh mục */}
                        <select
                            value={selectedCategoryId ?? ""}
                            onChange={(e) => {
                                const val = e.target.value ? Number(e.target.value) : undefined;
                                setSelectedCategoryId(val);
                                setPageNumber(1);
                            }}
                            className="h-9 rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm font-medium text-slate-700"
                        >
                            <option value="">📂 Tất cả danh mục</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>

                        {/* Lọc theo Thương hiệu */}
                        <select
                            value={selectedBrandId ?? ""}
                            onChange={(e) => {
                                const val = e.target.value ? Number(e.target.value) : undefined;
                                setSelectedBrandId(val);
                                setPageNumber(1);
                            }}
                            className="h-9 rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm font-medium text-slate-700"
                        >
                            <option value="">🏷️ Tất cả thương hiệu</option>
                            {brands.map((b) => (
                                <option key={b.id} value={b.id}>
                                    {b.name}
                                </option>
                            ))}
                        </select>

                        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

                        <Button
                            type="button"
                            variant={status === "all" ? "default" : "outline"}
                            className={status === "all" ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600" : ""}
                            onClick={() => handleStatusChange("all")}
                        >
                            Tất cả
                        </Button>
                        <Button
                            type="button"
                            variant={status === "active" ? "default" : "outline"}
                            className={status === "active" ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600" : ""}
                            onClick={() => handleStatusChange("active")}
                        >
                            Đang bán
                        </Button>
                        <Button
                            type="button"
                            variant={status === "inactive" ? "default" : "outline"}
                            className={status === "inactive" ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600" : ""}
                            onClick={() => handleStatusChange("inactive")}>
                            Ngừng bán
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            title="Tải lại"
                            onClick={loadProducts}>
                            <RefreshCcw className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Form them moi san pham */}
            {isCreateFormOpen && (
            <ProductForm
                mode="create"
                isSubmitting={isSubmitting}
                onSubmit={handleCreateProduct}
                onCancel={() => setIsCreateFormOpen(false)}
            />
            )}
            {editingProduct && (
                <ProductForm
                    mode="update"
                    initialValues={{
                        productName: editingProduct.productName,
                        basePrice: editingProduct.basePrice,
                        categoryId: editingProduct.categoryId ?? undefined,
                        brandId: editingProduct.brandId ?? undefined,
                        description: editingProduct.description ?? undefined,
                        warranty: editingProduct.warranty ?? undefined
                    }}
                    isSubmitting={isSubmitting}
                    onSubmit={handleUpdateProduct}
                    onCancel={() => setEditingProduct(null)}
                />
            )}
            {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                </div>
            )}
            {/* Bảng sản phẩm */}
            <ProductTable
                products={products}
                isLoading={isLoading}
                onViewDetail={handleViewOrEdit}
                onEdit={handleViewOrEdit}
                onToggleStatus={handleToggleStatus}
                onViewVariants={handleViewVariants}
                onManageImages={(prod) => setSelectedImageProduct(prod)}
            />

            {selectedImageProduct && (
                <ProductImageModal
                    product={selectedImageProduct}
                    onClose={() => setSelectedImageProduct(null)}
                />
            )}
            {/* Phân trang */}
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

    // Thêm mới sản phẩm
    async function handleCreateProduct(values: ProductFormValues) {
        try {
            setIsSubmitting(true); 
            setErrorMessage(null);
            
            await createProduct({
                productCode: values.productCode?.trim() ?? "",
                productName: values.productName.trim(),
                basePrice: values.basePrice,
                categoryId: values.categoryId,
                brandId: values.brandId,
                description: values.description?.trim() || undefined,
                warranty: values.warranty?.trim() || undefined,
            });
            setIsCreateFormOpen(false); // Đóng form sau khi xong
           if(pageNumber === 1)
           {
            await loadProducts();
           }
           else
           {
            setPageNumber(1);
           }  
        } catch {
            setErrorMessage("Không thể tạo sản phẩm. Vui lòng kiểm tra lại thông tin.");
        } finally {
            setIsSubmitting(false);
        }
    }

    // Cập nhật sản phẩm
    async function handleUpdateProduct(values: ProductFormValues)
    {
        if(!editingProduct)
        {
            return;
        }
        try {
            setIsSubmitting(true);
            setErrorMessage(null);

            await updateProduct(editingProduct.productId, {
                productName: values.productName.trim(),
                basePrice: values.basePrice,
                categoryId: values.categoryId,
                brandId: values.brandId,
                description: values.description?.trim() || undefined,
                warranty: values.warranty?.trim() || undefined,
            });
            setEditingProduct(null);// Về chế độ xem
            await loadProducts();
        } catch {
            setErrorMessage("Không thể cập nhật sản phẩm. Vui lòng kiểm tra lại thông tin.");
        } finally {
            setIsSubmitting(false);
        }
    }
}