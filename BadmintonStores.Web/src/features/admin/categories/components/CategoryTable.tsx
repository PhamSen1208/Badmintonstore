import { Layers } from "lucide-react";
import type { CategoryListItem } from "../types/admin-categories.types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type CategoryTableProps = {
    categories: CategoryListItem[];
    isLoading: boolean;
};

export function CategoryTable({ categories, isLoading }: CategoryTableProps) {
    if (isLoading) {
        return (
            <div className="rounded-lg border bg-white p-8 text-center text-sm text-muted-foreground">
                Đang tải danh sách danh mục...
            </div>
        );
    }

    if (categories.length === 0) {
        return (
            <div className="rounded-lg border bg-white p-8 text-center">
                <Layers className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-3 font-medium">Chưa có danh mục nào</p>
                <p className="text-sm text-muted-foreground">
                    Bấm nút "+ Thêm danh mục" để thêm mới
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Mã danh mục</TableHead>
                        <TableHead>Tên danh mục</TableHead>
                        <TableHead>Slug (URL)</TableHead>
                        <TableHead>Mô tả</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.map((cat) => (
                        <TableRow key={cat.id}>
                            <TableCell className="font-semibold text-slate-900">
                                {cat.categoryCode}
                            </TableCell>
                            <TableCell className="font-medium">
                                {cat.name}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground font-mono">
                                /{cat.slug}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                                {cat.description || "-"}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                                {new Date(cat.createdAt).toLocaleDateString("vi-VN")}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
