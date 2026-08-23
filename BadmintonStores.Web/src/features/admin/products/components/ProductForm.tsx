import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getCategories } from "@/features/admin/categories/services/admin-categories.service";
import { getBrands } from "@/features/admin/brands/services/admin-brands.service";
import type { CategoryListItem } from "@/features/admin/categories/types/admin-categories.types";
import type { BrandListItem } from "@/features/admin/brands/types/admin-brands.types";

// Validate dữ liệu form
const productFormSchema = z.object({
  productCode: z.string().trim().optional(),
  productName: z
    .string()
    .trim()
    .min(1, "Tên sản phẩm không được để trống"),
  basePrice: z.coerce
    .number({
      message: "Giá bán phải là số",
    })
    .positive("Giá bán phải lớn hơn 0"),
  categoryId: z.coerce.number().optional(),
  brandId: z.coerce.number().optional(),
  description: z.string().trim().optional(),
  warranty: z.string().trim().optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

type ProductFormProps = {
  mode: "create" | "update";
  initialValues?: Partial<ProductFormValues>;
  isSubmitting: boolean;
  onSubmit: (values: ProductFormValues) => Promise<void>;
  onCancel: () => void;
};

export function ProductForm({
    mode,
    initialValues,
    isSubmitting,
    onSubmit,
    onCancel,
}: ProductFormProps) {
    const [categories, setCategories] = useState<CategoryListItem[]>([]);
    const [brands, setBrands] = useState<BrandListItem[]>([]);

    useEffect(() => {
        async function fetchDropdowns() {
            try {
                const [cats, bnds] = await Promise.all([
                    getCategories(),
                    getBrands()
                ]);
                setCategories(cats);
                setBrands(bnds);
            } catch {
                // Fallback nếu lỗi
            }
        }
        fetchDropdowns();
    }, []);

    const form = useForm({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            productCode: "",
            productName: "",
            basePrice: 0,
            categoryId: undefined,
            brandId: undefined,
            description: "",
            warranty: "",
            ...initialValues,
        },
    });

    useEffect(() => {
        form.reset({
            productCode: "",
            productName: "",
            basePrice: 0,
            categoryId: undefined,
            brandId: undefined,
            description: "",
            warranty: "",
            ...initialValues,
        });
    }, [form, initialValues]);

    async function handleSubmit(values: ProductFormValues) {
        if (mode === "create" && !values.productCode?.trim()) {
            form.setError("productCode", {
                message: "Mã sản phẩm không được để trống"
            });
            return;
        }
        await onSubmit(values);
    }

    return (
        <div className="rounded-lg border bg-white p-5 shadow-sm">
            <div className="mb-5 border-b pb-3">
                <h2 className="text-lg font-semibold text-slate-800">
                    {mode === "create" ? "Thêm sản phẩm mới" : "Cập nhật sản phẩm"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Điền đầy đủ thông tin chi tiết về sản phẩm
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    {mode === "create" && (
                        <FormField
                            control={form.control}
                            name="productCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mã sản phẩm *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="VD: RACKET-YONEX-001" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <FormField
                        control={form.control}
                        name="productName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên sản phẩm *</FormLabel>
                                <FormControl>
                                    <Input placeholder="VD: Vợt cầu lông Yonex Arcsaber 11" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Danh mục sản phẩm</FormLabel>
                                    <FormControl>
                                        <select
                                            value={(field.value as string | number) ?? ""}
                                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                            className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm"
                                        >
                                            <option value="">-- Chọn danh mục --</option>
                                            {categories.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.name} ({c.categoryCode})
                                                </option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="brandId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Thương hiệu sản phẩm</FormLabel>
                                    <FormControl>
                                        <select
                                            value={(field.value as string | number) ?? ""}
                                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                            className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm"
                                        >
                                            <option value="">-- Chọn thương hiệu --</option>
                                            {brands.map((b) => (
                                                <option key={b.id} value={b.id}>
                                                    {b.name} ({b.brandCode})
                                                </option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="basePrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Giá gốc (₫) *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={0}
                                            placeholder="VD: 1200000"
                                            {...field}
                                            value={(field.value as number) ?? ""}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="warranty"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bảo hành</FormLabel>
                                    <FormControl>
                                        <Input placeholder="VD: 12 tháng" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mô tả</FormLabel>
                                <FormControl>
                                    <Input placeholder="Mô tả ngắn về sản phẩm" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isSubmitting}
                            onClick={onCancel}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-emerald-600 hover:bg-emerald-700"
                        >
                            {isSubmitting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {mode === "create" ? "Thêm mới" : "Lưu thay đổi"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
