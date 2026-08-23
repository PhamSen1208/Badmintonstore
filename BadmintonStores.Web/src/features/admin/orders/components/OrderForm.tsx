import { useState, useEffect } from "react";
import { Loader2, Plus, Trash2, ShoppingCart, User, Warehouse as WarehouseIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCustomers } from "@/features/admin/customers/services/admin-customers.service";
import { getWarehouses } from "@/features/admin/warehouses/services/admin-warehouse.service";
import type { CustomerListItem } from "@/features/admin/customers/types/admin-customers.types";
import type { WarehouseListItem } from "@/features/admin/warehouses/types/admin-warehouse.types";
import type { CreateOrderRequest, CreateOrderItemRequest } from "../types/admin-orders.types";

type OrderFormProps = {
    isSubmitting: boolean;
    onSubmit: (values: CreateOrderRequest) => Promise<void>;
    onCancel: () => void;
};

// Danh sách các Biến thể sản phẩm mẫu hiển thị thân thiện với người dùng
const variantOptions = [
    { id: 1, label: "Vợt Yonex Astrox 88D Pro - Đỏ / 4U (SKU: YONEX-88D-PRO-4U)" },
    { id: 2, label: "Giày Badminton Victor P9200 - Trắng / Size 42 (SKU: VIC-P9200-42)" },
    { id: 3, label: "Vợt Lining Halbertec 8000 - Xanh / 3U (SKU: LINING-HB8000-3U)" },
    { id: 4, label: "Quả cầu lông VinaStar - Hộp 12 quả (SKU: VINA-STAR-12)" },
    { id: 5, label: "Băng quấn cán vợt Yonex AC102EX - Đen (SKU: AC102-BLK)" },
];

export function OrderForm({ isSubmitting, onSubmit, onCancel }: OrderFormProps) {
    const [customers, setCustomers] = useState<CustomerListItem[]>([]);
    const [warehouses, setWarehouses] = useState<WarehouseListItem[]>([]);
    const [isLoadingOptions, setIsLoadingOptions] = useState(false);

    const [customerId, setCustomerId] = useState<number>(1);
    const [warehouseId, setWarehouseId] = useState<number>(1);
    const [note, setNote] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<string>("cash");
    const [taxRate, setTaxRate] = useState<number>(0.08); // Mặc định 8% VAT
    const [shippingFee, setShippingFee] = useState<number>(0);

    const [items, setItems] = useState<CreateOrderItemRequest[]>([
        { productVariantId: 1, quantity: 1 }
    ]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Tải danh sách Khách hàng và Kho hàng thực tế từ DB
    useEffect(() => {
        async function fetchOptions() {
            try {
                setIsLoadingOptions(true);
                const [custRes, whRes] = await Promise.all([
                    getCustomers({ pageSize: 100 }),
                    getWarehouses({ pageSize: 100 }),
                ]);
                setCustomers(custRes.items);
                setWarehouses(whRes.items);

                if (custRes.items.length > 0) {
                    setCustomerId(custRes.items[0].customerId);
                }
                if (whRes.items.length > 0) {
                    setWarehouseId(whRes.items[0].warehouseId);
                }
            } catch {
                // Fallback nếu có lỗi
            } finally {
                setIsLoadingOptions(false);
            }
        }
        fetchOptions();
    }, []);

    function handleAddItem() {
        setItems([...items, { productVariantId: variantOptions[0].id, quantity: 1 }]);
    }

    function handleRemoveItem(index: number) {
        if (items.length <= 1) {
            setErrorMsg("Đơn hàng phải có ít nhất 1 sản phẩm");
            return;
        }
        setItems(items.filter((_, i) => i !== index));
    }

    function handleItemChange(index: number, field: "productVariantId" | "quantity", value: number) {
        const updated = [...items];
        updated[index] = { ...updated[index], [field]: value };
        setItems(updated);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrorMsg(null);

        if (!customerId || customerId <= 0) {
            setErrorMsg("Vui lòng chọn Khách hàng hợp lệ");
            return;
        }
        if (!warehouseId || warehouseId <= 0) {
            setErrorMsg("Vui lòng chọn Kho xuất hàng hợp lệ");
            return;
        }
        if (items.some(i => i.productVariantId <= 0 || i.quantity <= 0)) {
            setErrorMsg("Vui lòng kiểm tra lại Sản phẩm chọn và Số lượng (> 0)");
            return;
        }

        await onSubmit({
            customerId,
            warehouseId,
            taxRate,
            shippingFee,
            note: note.trim() || undefined,
            items,
            payment: {
                paymentMethod
            }
        });
    }

    return (
        <div className="rounded-lg border bg-white p-5 space-y-5 shadow-sm">
            <div className="flex items-center gap-2 border-b pb-3">
                <ShoppingCart className="h-5 w-5 text-emerald-600" />
                <div>
                    <h2 className="text-lg font-semibold">Tạo Đơn hàng Mới (Bán tại quầy / POS)</h2>
                    <p className="text-sm text-muted-foreground">Chọn thông tin khách hàng, kho xuất và sản phẩm mua</p>
                </div>
            </div>

            {errorMsg && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {errorMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Chọn Khách hàng */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-1">
                            <User className="h-4 w-4 text-blue-600" /> Khách hàng mua *
                        </label>
                        <select
                            value={customerId}
                            onChange={(e) => setCustomerId(Number(e.target.value))}
                            className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm"
                            disabled={isLoadingOptions}
                        >
                            {customers.length > 0 ? (
                                customers.map((c) => (
                                    <option key={c.customerId} value={c.customerId}>
                                        [{c.customerCode}] {c.fullName}
                                    </option>
                                ))
                            ) : (
                                <option value={1}>[CUS000001] Nguyễn Văn Thành</option>
                            )}
                        </select>
                    </div>

                    {/* Chọn Kho xuất hàng */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-1">
                            <WarehouseIcon className="h-4 w-4 text-emerald-600" /> Kho xuất hàng *
                        </label>
                        <select
                            value={warehouseId}
                            onChange={(e) => setWarehouseId(Number(e.target.value))}
                            className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm"
                            disabled={isLoadingOptions}
                        >
                            {warehouses.length > 0 ? (
                                warehouses.map((w) => (
                                    <option key={w.warehouseId} value={w.warehouseId}>
                                        [{w.warehouseCode}] {w.warehouseName}
                                    </option>
                                ))
                            ) : (
                                <option value={1}>[WH-001] Kho Tổng Hà Nội</option>
                            )}
                        </select>
                    </div>

                    {/* Hình thức thanh toán */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Hình thức thanh toán *</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm"
                        >
                            <option value="cash">Tiền mặt (Cash)</option>
                            <option value="bank_transfer">Chuyển khoản (Bank Transfer)</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* Chọn Mức Thuế VAT */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Mức Thuế VAT (%) *</label>
                        <select
                            value={taxRate}
                            onChange={(e) => setTaxRate(Number(e.target.value))}
                            className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm font-medium"
                        >
                            <option value={0}>0% (Miễn thuế / Không có VAT)</option>
                            <option value={0.05}>5% VAT (Hàng hoá nông sản / Thiết bị y tế)</option>
                            <option value={0.07}>7% VAT (Mức thuế ưu đãi đặc thù)</option>
                            <option value={0.08}>8% VAT (Áp dụng giảm thuế GTGT Việt Nam)</option>
                            <option value={0.10}>10% VAT (Mức thuế GTGT tiêu chuẩn)</option>
                        </select>
                    </div>

                    {/* Phí vận chuyển */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Phí vận chuyển (₫)</label>
                        <Input
                            type="number"
                            min={0}
                            value={shippingFee}
                            onChange={(e) => setShippingFee(Number(e.target.value))}
                            placeholder="Nhập phí ship (nếu có)..."
                            className="bg-white"
                        />
                    </div>
                </div>

                {/* Danh sách sản phẩm mua */}
                <div className="space-y-3 pt-2 border-t">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold">Danh sách sản phẩm chọn mua *</label>
                        <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                            <Plus className="h-4 w-4 mr-1" /> Thêm món
                        </Button>
                    </div>

                    {items.map((item, index) => (
                        <div key={index} className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg border">
                            <div className="flex-1 space-y-1">
                                <span className="text-xs text-muted-foreground font-medium">Sản phẩm & Biến thể #{index + 1}</span>
                                <select
                                    value={item.productVariantId}
                                    onChange={(e) => handleItemChange(index, "productVariantId", Number(e.target.value))}
                                    className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm"
                                >
                                    {variantOptions.map((v) => (
                                        <option key={v.id} value={v.id}>
                                            {v.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-32 space-y-1">
                                <span className="text-xs text-muted-foreground font-medium">Số lượng</span>
                                <Input
                                    type="number"
                                    min={1}
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                                    placeholder="Số lượng"
                                    className="bg-white"
                                />
                            </div>

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-5"
                                onClick={() => handleRemoveItem(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Ghi chú */}
                <div className="space-y-2 pt-2">
                    <label className="text-sm font-medium">Ghi chú đơn hàng</label>
                    <Input
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="VD: Giao giờ hành chính, khách thanh toán đủ..."
                    />
                </div>

                {/* Nút Submit */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button type="button" variant="outline" disabled={isSubmitting} onClick={onCancel}>
                        Hủy
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Tạo Đơn Hàng
                    </Button>
                </div>
            </form>
        </div>
    );
}
