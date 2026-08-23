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

const variantFormSchema = z.object({
    sku: z.string().trim().optional(),
    price: z.coerce
        .number({ message: "Giá gốc phải là số" })
        .positive("Giá gốc phải lớn hơn 0"),
    salePrice: z.preprocess(
        (val) => (val === "" || val === null || val === undefined || Number.isNaN(val) ? undefined : Number(val)),
        z.number().positive("Giá bán phải lớn hơn 0").optional()
    ),
    weight: z.preprocess(
        (val) => (val === "" || val === null || val === undefined || Number.isNaN(val) ? undefined : Number(val)),
        z.number().positive("Trọng lượng phải lớn hơn 0").optional()
    ),

    color: z.string().trim().optional(),
    size: z.string().trim().optional(),
});

export type VariantFormValues = z.infer<typeof variantFormSchema>;

type VariantFormProps = {
    mode: "create" | "update";
    initialValues?: Partial<VariantFormValues>;
    isSubmitting: boolean;
    onSubmit: (values: VariantFormValues) => Promise<void>;
    onCancel: () => void;
}

export function VariantForm({
    mode,
    initialValues,
    isSubmitting,
    onSubmit,
    onCancel,
}: VariantFormProps) {
    const form = useForm({
        resolver: zodResolver(variantFormSchema),
        defaultValues: {
            sku: "",
            price: 0,
            salePrice: undefined,
            weight: undefined,
            color: "",
            size: "",
            ...initialValues,
        },
    });

    useEffect(() => {
        form.reset({
            sku: "",
            price: 0,
            salePrice: undefined,
            weight: undefined,
            color: "",
            size: "",
            ...initialValues,
        });
    }, [form, initialValues]);

    //Hàm xử lý submit dữ liệu
    async function handleSubmit(values: VariantFormValues) {
        if (mode === "create" && !values.sku?.trim()) {
            form.setError("sku", {
                message: "Mã SKU không được để trống"
            });
            return;
        }
        await onSubmit(values);
    }
    return (
        <div className="rounded-lg border bg-white p-5">
            <div className="mb-5">
                <h2 className="text-lg font-semibold">
                    {mode === "create" ? "Thêm biến thể" : "Cập nhật biến thể"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Cập nhật thông tin biến thể
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    {mode === "create" && (
                        <FormField
                            control={form.control}
                            name="sku"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mã SKU</FormLabel>
                                    <FormControl>
                                        <Input placeholder="VD: RACKET-YONEX-001-RED" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                    {/* Form giá gốc */}
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Giá bán</FormLabel>
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
                    {/* Form giá bán */}
                    <FormField
                        control={form.control}
                        name="salePrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Giá khuyến mãi</FormLabel>
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
                    {/* Form trọng lượng */}
                    <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Trọng lượng (gram)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={0}
                                        placeholder="VD: 80"
                                        {...field}
                                        value={(field.value as number) ?? ""}
                                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Form màu sắc */}
                    <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Màu sắc</FormLabel>
                                <FormControl>
                                    <Input placeholder="VD: Đỏ" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Form kích cỡ */}
                    <FormField
                        control={form.control}
                        name="size"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Kích cỡ</FormLabel>
                                <FormControl>
                                    <Input placeholder="VD: 3U" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isSubmitting}
                            onClick={onCancel}>
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}>
                            {isSubmitting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {mode === "create" ? "Thêm mới" : "Lưu thay đổi"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )

}