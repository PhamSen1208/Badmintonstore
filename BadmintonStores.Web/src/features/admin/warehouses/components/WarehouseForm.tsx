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

//Validate dữ liệu form
const warehouseFormSchema = z.object({
    warehouseCode: z.string().trim().optional(),
    warehouseName: z
        .string()
        .trim()
        .min(1, "Tên kho không được để trống"),
    address: z.string()
        .trim()
        .min(1, "Địa chỉ không được để trống"),
});

export type WarehouseFormValues = z.infer<typeof warehouseFormSchema>;

type WarehouseFormProps = {
    mode: "create" | "update";
    initialValues?: Partial<WarehouseFormValues> & {
        status?:string;
        createdAt: string;
        updatedAt?: string;
    }
    isSubmitting: boolean;
    onSubmit: (values: WarehouseFormValues) => Promise<void>;
    onCancel: () => void;
};

export function WarehouseForm({
    mode,
    initialValues,
    isSubmitting,
    onSubmit,
    onCancel,
}: WarehouseFormProps) {
    const form = useForm({
        resolver: zodResolver(warehouseFormSchema),
        defaultValues: {
            warehouseCode: "",
            warehouseName: "",
            address:"",
            ...initialValues,
        },
    });
  
    useEffect(() => {
        form.reset({
            warehouseCode: "",
            warehouseName: "",
            address:"",
            ...initialValues,
        });
    },[form,initialValues]);
    
    async function handleSubmit(values:WarehouseFormValues) {
        if(mode === "create" && !values.warehouseCode?.trim())
        {
            form.setError("warehouseCode",{
                message:"Mã kho không được để trống"
            });
            return;
        }
        await onSubmit(values);
    }
    return(
        <div className="rounded-lg border bg-white p-5">
            <div className="mb-5">
                <h2 className="text-lg font-semibold">
                    {mode === "create" ? "Thêm kho" : "Cập nhật kho"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Cập nhật thông tin kho hàng
                </p>
            </div>

            <Form {...form}>
                {mode === "update" && initialValues && (
                    <div className="space-y-4 pt-2 border-t">
                        {/* Trường Trạng thái */}
                        <div className="space-y-2">
                            <FormLabel>Trạng thái</FormLabel>
                            <Input 
                                disabled 
                                value={initialValues.status?.toLowerCase() === "active" ? "Đang hoạt động" : "Ngừng hoạt động"} 
                                className="bg-gray-100 text-gray-600 font-medium cursor-not-allowed" 
                            />
                        </div>

                        {/* Trường Ngày tạo */}
                        {initialValues.createdAt && (
                            <div className="space-y-2">
                                <FormLabel>Ngày tạo</FormLabel>
                                <Input 
                                    disabled 
                                    value={new Date(initialValues.createdAt).toLocaleString("vi-VN")} 
                                    className="bg-gray-100 text-gray-500 cursor-not-allowed" 
                                />
                            </div>
                        )}

                        {/* Trường Cập nhật lần cuối */}
                        {initialValues.updatedAt && (
                            <div className="space-y-2">
                                <FormLabel>Cập nhật lần cuối</FormLabel>
                                <Input 
                                    disabled 
                                    value={new Date(initialValues.updatedAt).toLocaleString("vi-VN")} 
                                    className="bg-gray-100 text-gray-500 cursor-not-allowed" 
                                />
                            </div>
                        )}
                    </div>
                )}

                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    {
                        <FormField
                            control={form.control}
                            name="warehouseCode"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Mã kho*</FormLabel>
                                <FormControl>
                                    <Input 
                                    placeholder="VD: WH-001" 
                                    {...field} 
                                    disabled={mode === "update"} // Khóa không cho sửa khi Update
                                    className={mode === "update" ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    }
                    <FormField
                        control={form.control}
                        name="warehouseName"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Tên kho</FormLabel>
                                <FormControl>
                                    <Input placeholder="VD: Vợt cầu lông Yonex Arcsaber 11" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}>
                    </FormField>

                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Địa chỉ</FormLabel>
                            <FormControl>
                                <Input placeholder="VD:Số 143, Ngõ 12 Phú Diễn, Bắc Từ Liêm, Hà Nội." {...field} />
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




