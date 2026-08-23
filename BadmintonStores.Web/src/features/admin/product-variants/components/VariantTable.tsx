import { Edit, Eye, PackageSearch, ToggleLeft } from "lucide-react";
import type { ProductVariantListItem } from "../types/product-variant.types";
import { VariantStatusBadge } from "./VariantStatusBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type VariantTableProp = {
    variants: ProductVariantListItem[];
    isLoading: boolean;
    onViewDetail: (variant: ProductVariantListItem) => void;
    onEdit: (variant: ProductVariantListItem) => void;
    onToggleStatus: (variant: ProductVariantListItem) => void; 
};

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
})

export function VariantTable({ variants, isLoading, onViewDetail, onEdit, onToggleStatus }: VariantTableProp) {
    if (isLoading) {
        return (
            <div className="rounded-lg border bg-white p-8 text-center text-sm text-muted-foreground">
                Đang tải danh sách biến thể sản phẩm...
            </div>
        );
    }

    if (variants.length === 0) {
        return (
            <div className="rounded-lg border bg-white p-8 text-center">
                <PackageSearch className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-3 font-medium">Chưa có biến thể</p>
                <p className="text-sm text-muted-foreground">
                    Hãy thêm biến thể đầu tiên để bắt đầu
                </p>
            </div>
        )
    }
    return (
        <div className="overflow-hidden rounded-lg border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="">Mã SKU</TableHead>
                        <TableHead className="">Màu sắc</TableHead>
                        <TableHead className="">Kích thước</TableHead>
                        <TableHead className="">Trọng lượng</TableHead>
                        <TableHead className="">Giá bán</TableHead>
                        <TableHead className="">Trạng thái</TableHead>
                        <TableHead className="w-55 text-center">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {variants.map((variant) => (
                        <TableRow key={variant.productVariantId}>
                            <TableCell className="font-medium">
                                {variant.sku}
                            </TableCell>
                            <TableCell>
                                {variant.color || "-"}
                            </TableCell>

                            <TableCell>
                                {variant.size || "-"}
                            </TableCell>

                            <TableCell>
                                {variant.weight != null ? `${variant.weight} g` : "-"}
                            </TableCell>
                            
                            <TableCell>
                                {currencyFormatter.format(variant.price)}
                            </TableCell>

                            <TableCell>
                                <VariantStatusBadge status={variant.status} />
                            </TableCell>

                            <TableCell>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        title="Xem chi tiết"
                                        onClick={() => onViewDetail(variant)}
                                        className="hover:bg-gray-200">
                                        <Eye className="h-4 w-4"/>
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        title="Sửa biến thể"
                                        onClick={() => onEdit(variant)}
                                        className="hover:bg-gray-200">
                                        <Edit className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        title="Đổi trạng thái"
                                        onClick={() => onToggleStatus(variant)}
                                        className="hover:bg-gray-200">
                                        <ToggleLeft className="h-4 w-4" />
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
