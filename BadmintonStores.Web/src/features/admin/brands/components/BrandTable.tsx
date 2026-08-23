import { Tag } from "lucide-react";
import type { BrandListItem } from "../types/admin-brands.types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type BrandTableProps = {
    brands: BrandListItem[];
    isLoading: boolean;
};

export function BrandTable({ brands, isLoading }: BrandTableProps) {
    if (isLoading) {
        return (
            <div className="rounded-lg border bg-white p-8 text-center text-sm text-muted-foreground">
                Đang tải danh sách thương hiệu...
            </div>
        );
    }

    if (brands.length === 0) {
        return (
            <div className="rounded-lg border bg-white p-8 text-center">
                <Tag className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-3 font-medium">Chưa có thương hiệu nào</p>
                <p className="text-sm text-muted-foreground">
                    Bấm nút "+ Thêm thương hiệu" để thêm mới
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Mã thương hiệu</TableHead>
                        <TableHead>Tên thương hiệu</TableHead>
                        <TableHead>Slug (URL)</TableHead>
                        <TableHead>Mô tả</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {brands.map((brand) => (
                        <TableRow key={brand.id}>
                            <TableCell className="font-semibold text-slate-900">
                                {brand.brandCode}
                            </TableCell>
                            <TableCell className="font-medium flex items-center gap-2">
                                {brand.logoUrl ? (
                                    <img src={brand.logoUrl} alt={brand.name} className="h-6 w-6 object-contain rounded" />
                                ) : (
                                    <div className="h-6 w-6 rounded bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">
                                        {brand.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                {brand.name}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground font-mono">
                                /{brand.slug}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                                {brand.description || "-"}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                                {new Date(brand.createdAt).toLocaleDateString("vi-VN")}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
