import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
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

// 1. Zod Schema CHỈ chứa các trường cho phép nhập liệu
const stockFormSchema = z.object({
    productVariantId: z.coerce.number().optional(), // Dùng khi create
    quantity: z.coerce.number()
        .int("Số lượng phải là số nguyên")
        .min(0, "Số lượng không được âm"),
    note: z.string().optional(), // Dùng khi update (ghi chú điều chỉnh)
});

export type StockFormValues = z.infer<typeof stockFormSchema>;

type StockFormProps = {
    mode: "create" | "update";
    //Thêm danh sách biến thể
    variantoptions?: Array<{
        productVariantId: number;
        sku: string;
        productName: string;
    }>
    // initialValues chứa cả giá trị form VÀ thông tin read-only
    initialValues?: Partial<StockFormValues> & {
        sku?: string;
        productName?: string;
        reservedQuantity?: number;
        updatedAt?: string | null;
    };
    isSubmitting: boolean;
    onSubmit: (values: StockFormValues) => Promise<void>;
    onCancel: () => void;
};

export function StockForm({
    mode,
    variantoptions,
    initialValues,
    isSubmitting,
    onSubmit,
    onCancel,
}: StockFormProps) {
    const form = useForm({
        resolver: zodResolver(stockFormSchema),
        defaultValues: {
            productVariantId: initialValues?.productVariantId || 0,
            quantity: initialValues?.quantity || 0,
            note: initialValues?.note || "",
        },
    });
  
    useEffect(() => {
        form.reset({
            productVariantId: initialValues?.productVariantId || 0,
            quantity: initialValues?.quantity || 0,
            note: initialValues?.note || "",
        });
    }, [form, initialValues]);
    
    async function handleSubmit(values: StockFormValues) {
        if (mode === "create" && (!values.productVariantId || values.productVariantId <= 0)) {
            form.setError("productVariantId", { message: "Vui lòng nhập ID biến thể hợp lệ" });
            return;
        }
        await onSubmit(values);
    }

    return (
        <div className="rounded-lg border bg-white p-5">
            <div className="mb-5">
                <h2 className="text-lg font-semibold">
                    {mode === "create" ? "Thêm SKU vào kho" : "Điều chỉnh tồn kho"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    {mode === "create" ? "Nhập hàng mới vào kho" : "Cập nhật lại số lượng tồn kho"}
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit((val) => handleSubmit(val as StockFormValues))} className="space-y-4">
                    
                    {/* KHU VỰC 1: THÔNG TIN CHỈ ĐỌC (READ-ONLY) - HIỂN THỊ KHI UPDATE */}
                    {mode === "update" && initialValues && (
                        <div className="space-y-4 pt-2 pb-4 border-b">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <FormLabel>Mã SKU</FormLabel>
                                    <Input disabled value={initialValues.sku} className="bg-gray-100 font-medium text-gray-700" />
                                </div>
                                <div className="space-y-2">
                                    <FormLabel>Tên sản phẩm</FormLabel>
                                    <Input disabled value={initialValues.productName} className="bg-gray-100 text-gray-700" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <FormLabel>Đang giữ</FormLabel>
                                    <Input disabled value={initialValues.reservedQuantity} className="bg-amber-50 text-amber-700 font-semibold text-center" />
                                </div>
                                <div className="space-y-2">
                                    <FormLabel>Khả dụng</FormLabel>
                                    <Input disabled value={(initialValues.quantity ?? 0) - (initialValues.reservedQuantity ?? 0)} className="bg-emerald-50 text-emerald-700 font-semibold text-center" />
                                </div>
                                <div className="space-y-2">
                                    <FormLabel>Lần cập nhật cuối</FormLabel>
                                    <Input disabled value={initialValues.updatedAt ? new Date(initialValues.updatedAt).toLocaleDateString("vi-VN") : "-"} className="bg-gray-100 text-gray-500 text-center" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* KHU VỰC 2: CÁC TRƯỜNG CHO PHÉP NHẬP LIỆU */}
                    {mode === "create" && (
                        <FormField
                            control={form.control as any}
                            name="productVariantId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Chọn sản phẩm/Mã SKU*</FormLabel>
                                    <FormControl> 
                                        <select
                                            value={field.value || 0}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                                            <option value={0}>--Chọn sản phẩm/ biến thể nhập kho--</option>
                                            {variantoptions?.map((option) => (
                                                <option key={option.productVariantId} value={option.productVariantId}>
                                                    {option.sku} - {option.productName}
                                                </option>
                                            ))} 
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <FormField
                        control={form.control as any}
                        name="quantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{mode === "create" ? "Số lượng ban đầu *" : "Số lượng mới (Tổng kho) *"}</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="VD: 100" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {mode === "update" && (
                        <FormField
                            control={form.control as any}
                            name="note"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ghi chú điều chỉnh</FormLabel>
                                    <FormControl>
                                        <Input placeholder="VD: Khách hoàn hàng, Kiểm kho bị lệch..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    {/* NÚT SUBMIT */}
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" disabled={isSubmitting} onClick={onCancel}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {mode === "create" ? "Thêm vào kho" : "Lưu điều chỉnh"}
                        </Button>
                    </div>
                </form>
            </Form>   
        </div>
    );
}
