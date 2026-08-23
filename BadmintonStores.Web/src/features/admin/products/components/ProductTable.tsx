import { Edit, Eye, Image as ImageIcon, PackageSearch, ToggleLeft } from "lucide-react";
import type { ProductListItem } from "../types/admin-product.types";
import { ProductStatusBadge } from "./ProductStatusBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { currencyFormatter } from "@/lib/formatters";
type ProductTableProp = {
    products: ProductListItem[];
    isLoading: boolean;
    onViewDetail: (product: ProductListItem) => void;
    onEdit: (product: ProductListItem) => void;
    onToggleStatus: (product: ProductListItem) => void;
    onViewVariants: (product: ProductListItem) => void;
    onManageImages?: (product: ProductListItem) => void;
};


export function ProductTable({ products, isLoading, onViewDetail, onEdit, onToggleStatus, onViewVariants, onManageImages }: ProductTableProp) {
    if (isLoading) {
        return (
            <div className="rounded-lg border bg-white p-8 text-center text-sm text-muted-foreground">
                Đang tải danh sách sản phẩm...
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="rounded-lg border bg-white p-8 text-center">
                <PackageSearch className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-3 font-medium">Chưa có sản phẩm</p>
                <p className="text-sm text-muted-foreground">
                    Hãy thêm sản phẩm đầu tiên để bắt đầu
                </p>
            </div>
        )
    }
    return (
        <div className="overflow-hidden rounded-lg border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="">Mã sản phẩm</TableHead>
                        <TableHead className="">Tên sản phẩm</TableHead>
                        <TableHead className="">Danh mục</TableHead>
                        <TableHead className="">Thương hiệu</TableHead>
                        <TableHead className="">Giá gốc</TableHead>
                        <TableHead className="">Trạng thái</TableHead>
                        <TableHead className="">Ngày tạo</TableHead>
                        <TableHead className="w-55 text-center">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.productId}>
                            <TableCell className="font-medium">
                                {product.productCode}
                            </TableCell>
                            <TableCell className="font-semibold text-slate-800">
                                {product.productName}
                            </TableCell>
                            <TableCell>
                                {product.categoryName ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        {product.categoryName}
                                    </span>
                                ) : (
                                    <span className="text-xs text-slate-400">-</span>
                                )}
                            </TableCell>
                            <TableCell>
                                {product.brandName ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                        {product.brandName}
                                    </span>
                                ) : (
                                    <span className="text-xs text-slate-400">-</span>
                                )}
                            </TableCell>
                            <TableCell>
                                {currencyFormatter.format(product.basePrice)}
                            </TableCell>

                            <TableCell>
                                <ProductStatusBadge status={product.status} />
                            </TableCell>

                            <TableCell>
                                {new Date(product.createdAt).toLocaleDateString("vi-VN")}
                            </TableCell>

                            <TableCell>
                                <div className="flex justify-end gap-1">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        title="Xem chi tiết sản phẩm"
                                        onClick={() => onViewDetail(product)}
                                        className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                                        <Eye className="h-4 w-4"/>
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        title="Chỉnh sửa sản phẩm"
                                        onClick={() => onEdit(product)}
                                        className="h-8 w-8 text-amber-600 hover:bg-amber-50">
                                        <Edit className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        title="Đổi trạng thái kinh doanh"
                                        onClick={() => onToggleStatus(product)}
                                        className="h-8 w-8 text-slate-600 hover:bg-slate-100">
                                        <ToggleLeft className="h-4 w-4" />
                                    </Button>

                                    {onManageImages && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            title="Thư viện ảnh sản phẩm"
                                            onClick={() => onManageImages(product)}
                                            className="h-8 w-8 text-purple-600 hover:bg-purple-50">
                                            <ImageIcon className="h-4 w-4" />
                                        </Button>
                                    )}

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        title="Quản lý biến thể (Màu / Size)"
                                        onClick={() => onViewVariants(product)}
                                        className="h-8 w-8 text-emerald-600 hover:bg-emerald-50">
                                        <PackageSearch className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
