import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, RefreshCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WarehouseTable } from "../warehouses/components/WarehouseTable";
import type { WarehouseListItem } from "../warehouses/types/admin-warehouse.types";
import { WarehouseForm, type WarehouseFormValues } from "../warehouses/components/WarehouseForm";
import {
    createWarehouse,
    getWarehouseById,
    getWarehouses,
    updateWarehouse,
    updateWarehouseStatus,
} from "../warehouses/services/admin-warehouse.service";

type WarehouseFilerStatus = "all" | "active" | "inactive";

export function AdminWarehousesPage() {
    const navigate = useNavigate();

    const [warehouses, setWarehouses] = useState<WarehouseListItem[]>([]);
    const [keyword, setKeyword] = useState("");
    const [status, setStatus] = useState<WarehouseFilerStatus>("all");
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const [totalPage, setTotalPage] = useState(1);
    const [editingWarehouse, setEditingWarehouse] = useState<WarehouseListItem | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

    const loadWarehouses = async () => {
        try {
            setIsLoading(true);
            setErrorMessage(null);

            const result = await getWarehouses({
                keyword: keyword.trim() || undefined,
                status: status === "all" ? undefined : status,
                pageNumber,
                pageSize,
            });
            setWarehouses(result.items); //Lấy danh sách kho từ response.data.data
            setTotalPage(result.totalPages); //Lấy tổng số trang từ response.data.data
        } catch (error) {
            setErrorMessage("Lỗi khi tải danh sách kho");
            setWarehouses([]);
            setTotalPage(0);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadWarehouses();
    }, [pageNumber, status]);

    //Hàm tìm kiếm
    function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setPageNumber(1);
        loadWarehouses();
    }

    function handleStatusChange(nextStatus: WarehouseFilerStatus) {
        setStatus(nextStatus);
        setPageNumber(1);
    }

    function handleViewDetail(warehouse: WarehouseListItem) {
        navigate(`/admin/warehouses/${warehouse.warehouseId}/stocks`);
    }

    //Hàm sửa kho
    async function handleEdit(warehouse: WarehouseListItem) {
        try {
            setErrorMessage(null);
            const detail = await getWarehouseById(warehouse.warehouseId); //Lấy thông tin chi tiết kho
            setEditingWarehouse(detail); //Set thông tin chi tiết kho
            setIsCreateFormOpen(false); //Đóng form tạo mới
        } catch {
            setErrorMessage("Không thể tải thông tin kho");
        }
    }
    //Hàm thay đổi trạng thái kho
    async function handleToggleStatus(warehouse: WarehouseListItem) {
        const currentStatus = warehouse.status.toLowerCase();
        const nextStatus = currentStatus === "active" ? "inactive" : "active";

        try {
            setErrorMessage(null);
            await updateWarehouseStatus(warehouse.warehouseId, {
                status: nextStatus
            });
            await loadWarehouses();
        } catch {
            setErrorMessage("Không thể cập nhật trạng thái kho");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Kho hàng</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Quản lý danh sách kho xuất nhập hàng của hệ thống
                    </p>
                </div>
                <Button 
                    type="button"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => {
                        setIsCreateFormOpen(true);
                        setEditingWarehouse(null);
                    }}
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Thêm mới
                </Button>
            </div>

            <div className="rounded-lg border bg-white p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    {/* Thanh tìm kiếm và lọc trạng thái */}
                    <form
                        onSubmit={handleSearchSubmit}
                        className="flex w-full gap-2 lg:max-w-md">
                        {/* Thanh tìm kiếm */}
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={keyword}
                                onChange={(event) => setKeyword(event.target.value)}
                                placeholder="Tìm kiếm theo tên kho..."
                                className="pl-9" />
                        </div>
                        <Button type="submit" variant="outline">
                            Tìm kiếm
                        </Button>
                    </form>

                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant={status === "all" ? "default" : "outline"}
                            className={status === "all" ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600" : ""}
                            onClick={() => handleStatusChange("all")}
                        >
                            Tất cả
                        </Button>
                        <Button
                            type="button"
                            variant={status === "active" ? "default" : "outline"}
                            className={status === "active" ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600" : ""}
                            onClick={() => handleStatusChange("active")}
                        >
                            Đang hoạt động
                        </Button>
                        <Button
                            type="button"
                            variant={status === "inactive" ? "default" : "outline"}
                            className={status === "inactive" ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600" : ""}
                            onClick={() => handleStatusChange("inactive")}>
                            Ngừng hoạt động
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            title="Tải lại"
                            onClick={loadWarehouses}>
                            <RefreshCcw className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Form them moi san pham */}
            {isCreateFormOpen && (
                <WarehouseForm
                    mode="create"
                    isSubmitting={isSubmitting}
                    onSubmit={handleCreateWarehouse}
                    onCancel={() => setIsCreateFormOpen(false)}
                />
            )}
            {editingWarehouse && (
                <WarehouseForm
                    mode="update"
                    initialValues={{
                        warehouseCode: editingWarehouse.warehouseCode,
                        warehouseName: editingWarehouse.warehouseName,
                        address: editingWarehouse.address,
                        status: editingWarehouse.status,
                        createdAt: editingWarehouse.createdAt,
                        updatedAt: editingWarehouse.updatedAt ?? "", 
                    }}
                    isSubmitting={isSubmitting}
                    onSubmit={handleUpdateWarehouse}
                    onCancel={() => setEditingWarehouse(null)}
                />
            )}
            {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                </div>
            )}
            {/* Bang bien the */}
            <WarehouseTable
                warehouses={warehouses}
                isLoading={isLoading}
                onViewDetail={handleViewDetail}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
            />
            {/* Phan trang */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Trang {pageNumber}/{totalPage}
                </p>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={pageNumber <= 1 || isLoading}
                        onClick={() => setPageNumber((current) => current - 1)}>
                        Trang trước
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        disabled={pageNumber >= totalPage || isLoading}
                        onClick={() => setPageNumber((current) => current + 1)}>
                        Trang sau
                    </Button>
                </div>
            </div>

        </div>
    )

    //Thêm mới kho
    async function handleCreateWarehouse(values: WarehouseFormValues) {
        try {
            setIsSubmitting(true);
            setErrorMessage(null);

            await createWarehouse({
                warehouseCode: values.warehouseCode?.trim() ?? "",
                warehouseName: values.warehouseName?.trim() ?? "",
                address: values.address?.trim() ?? "",
            });
            setIsCreateFormOpen(false); // Đóng form sau khi xong
            if (pageNumber === 1) {
                await loadWarehouses();
            }
            else {
                setPageNumber(1);
            }
        } catch (error) {
            setErrorMessage("Không thể tạo kho. Vui lòng kiểm tra lại thông tin.");
        } finally {
            setIsSubmitting(false);
        }
    }

    //Cập nhật kho
    async function handleUpdateWarehouse(values: WarehouseFormValues) {
        if (!editingWarehouse) {
            return;
        }
        try {
            setIsSubmitting(true);
            setErrorMessage(null);

            await updateWarehouse(editingWarehouse.warehouseId, {
                warehouseName: values.warehouseName?.trim() || "",
                address: values.address?.trim() || "",
            });
            setEditingWarehouse(null);// Về chế độ xem
            await loadWarehouses();
        } catch {
            setErrorMessage("Không thể cập nhật kho. Vui lòng kiểm tra lại thông tin.");
        } finally {
            setIsSubmitting(false);
        }
    }

}