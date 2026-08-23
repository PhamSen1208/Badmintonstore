import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, RefreshCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StockTable } from "../stocks/components/StockTable";
import { StockForm, type StockFormValues } from "../stocks/components/StockForm";
import { getWareHouseStocks, createStock, updateStockQuantity } from "../stocks/services/admin-stock.service";
import type { StockListItem } from "../stocks/types/admin-stock.types";

export function AdminWarehouseStocksPage() {
    const { warehouseId } = useParams<{ warehouseId: string }>();
    const navigate = useNavigate();

    const [variantList] = useState<Array<{
        productVariantId: number;
        sku: string;
        productName: string;
    }>>([
        { productVariantId: 1, sku: "VT-YONEX-88D-4U", productName: "Vợt cầu lông Yonex Astrox 88D (Đỏ - 4U)" },
        { productVariantId: 2, sku: "VT-LINING-TC75-3U", productName: "Vợt cầu lông Li-Ning Turbo Charging 75 (Đen)" },
        { productVariantId: 3, sku: "VT-VICTOR-ARS90K", productName: "Vợt cầu lông Victor Auraspeed 90K (Xanh)" },
    ]);

    const [stocks, setStocks] = useState<StockListItem[]>([]);
    const [warehouseName, setWarehouseName] = useState("");
    const [keyword, setKeyword] = useState("");
    
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // States cho Form
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [editingStock, setEditingStock] = useState<StockListItem | null>(null);

    async function loadStocks() {
        if (!warehouseId) return;
        try {
            setIsLoading(true);
            const response = await getWareHouseStocks(Number(warehouseId));
            setStocks(response.items);
            setWarehouseName(response.warehouseName);
        } catch (error) {
            console.error("Lỗi khi tải tồn kho:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadStocks();
    }, [warehouseId]);

    // Xử lý tạo mới
    async function handleCreateStock(values: StockFormValues) {
        if (!warehouseId) return;
        try {
            setIsSubmitting(true);
            await createStock({
                warehouseId: Number(warehouseId),
                productVariantId: values.productVariantId!,
                quantity: values.quantity,
            });
            setIsCreateFormOpen(false);
            await loadStocks();
        } catch (error) {
            console.error("Lỗi khi tạo:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    // Xử lý cập nhật
    async function handleUpdateStock(values: StockFormValues) {
        if (!editingStock) return;
        try {
            setIsSubmitting(true);
            await updateStockQuantity(editingStock.stockId, {
                quantity: values.quantity,
                note: values.note,
            });
            setEditingStock(null);
            await loadStocks();
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    // Lọc dữ liệu client-side theo keyword
    const filteredStocks = stocks.filter((stock) => {
        const query = keyword.trim().toLowerCase();
        if (!query) return true;
        return (
            stock.sku.toLowerCase().includes(query) ||
            stock.productName.toLowerCase().includes(query)
        );
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-x-7">
                    <Button 
                        type="button" 
                        size="default"
                        onClick={() => navigate("/admin/warehouses")}
                        title="Quay lại danh sách kho"
                        className="bg-black hover:bg-white hover:text-black hover:border-black transition-all duration-200"
                    >
                        <ArrowLeft className="h-4 w-8" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Tồn kho: {warehouseName || "Đang tải..."}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Quản lý số lượng sản phẩm trong kho này
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={loadStocks} title="Tải lại">
                        <RefreshCcw className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => { setIsCreateFormOpen(true); setEditingStock(null); }}>
                        <Plus className="h-4 w-4 mr-1" />
                        Nhập SKU mới
                    </Button>
                </div>
            </div>

            {/* Thanh Tìm kiếm */}
            <div className="rounded-lg border bg-white p-4">
                <div className="relative max-w-md">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Tìm kiếm theo Mã SKU hoặc Tên sản phẩm..."
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Form Thêm Mới */}
            {isCreateFormOpen && (
                <StockForm 
                    mode="create" 
                    variantoptions={variantList}
                    isSubmitting={isSubmitting} 
                    onSubmit={handleCreateStock} 
                    onCancel={() => setIsCreateFormOpen(false)} 
                />
            )}

            {/* Form Cập Nhật */}
            {editingStock && (
                <StockForm 
                    mode="update" 
                    initialValues={{
                        sku: editingStock.sku,
                        productName: editingStock.productName,
                        quantity: editingStock.quantity,
                        reservedQuantity: editingStock.reservedQuantity,
                        updatedAt: editingStock.updatedAt,
                    }}
                    isSubmitting={isSubmitting} 
                    onSubmit={handleUpdateStock} 
                    onCancel={() => setEditingStock(null)} 
                />
            )}

            {/* Bảng Tồn Kho */}
            <StockTable 
                stocks={filteredStocks} 
                isLoading={isLoading} 
                onViewDetail={() => alert("Chức năng xem chi tiết sản phẩm sẽ phát triển sau")} 
                onEdit={(stock) => {
                    setEditingStock(stock);
                    setIsCreateFormOpen(false);
                }} 
            />
        </div>
    );
}
