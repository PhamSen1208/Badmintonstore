import { useEffect, useState } from "react";
import { RefreshCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomerTable } from "../customers/components/CustomerTable";
import { CustomerForm } from "../customers/components/CustomerForm";
import { getCustomers, updateCustomer } from "../customers/services/admin-customers.service";
import type { CustomerListItem, UpdateCustomerRequest } from "../customers/types/admin-customers.types";

export function AdminCustomersPage() {
    const [customers, setCustomers] = useState<CustomerListItem[]>([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [keyword, setKeyword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // State cho Modal Sửa Khách hàng
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerListItem | null>(null);

    async function loadCustomers() {
        try {
            setIsLoading(true);
            setErrorMessage(null);
            const response = await getCustomers({
                pageNumber,
                pageSize,
                keyword: keyword.trim() || undefined,
            });
            setCustomers(response.items);
            setTotalPages(response.totalPages);
        } catch {
            setErrorMessage("Không thể tải danh sách khách hàng.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadCustomers();
    }, [pageNumber]);

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        setPageNumber(1);
        loadCustomers();
    }

    async function handleUpdateCustomer(values: UpdateCustomerRequest) {
        if (!selectedCustomer) return;
        try {
            setIsSubmitting(true);
            setErrorMessage(null);
            await updateCustomer(selectedCustomer.customerId, values);
            setSelectedCustomer(null);
            await loadCustomers();
        } catch {
            setErrorMessage("Không thể cập nhật thông tin khách hàng.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Quản lý Khách hàng</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Danh sách và thông tin chi tiết khách hàng của cửa hàng
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={loadCustomers} title="Tải lại">
                        <RefreshCcw className="h-4 w-4 mr-1" /> Tải lại
                    </Button>
                </div>
            </div>

            {/* Thanh Tìm kiếm */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-md bg-white p-2 rounded-lg border">
                <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Tìm kiếm theo Tên hoặc Mã KH..."
                        className="pl-9 border-none shadow-none"
                    />
                </div>
                <Button type="submit" size="sm">Tìm kiếm</Button>
            </form>

            {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                </div>
            )}

            <CustomerTable
                customers={customers}
                isLoading={isLoading}
                onEdit={(c) => setSelectedCustomer(c)}
            />

            {/* Modal Chỉnh sửa Khách hàng */}
            {selectedCustomer && (
                <CustomerForm
                    customer={selectedCustomer}
                    isSubmitting={isSubmitting}
                    onSubmit={handleUpdateCustomer}
                    onCancel={() => setSelectedCustomer(null)}
                />
            )}

            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Trang {pageNumber}/{totalPages}
                </p>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={pageNumber <= 1 || isLoading}
                        onClick={() => setPageNumber((curr) => curr - 1)}
                    >
                        Trang trước
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={pageNumber >= totalPages || isLoading}
                        onClick={() => setPageNumber((curr) => curr + 1)}
                    >
                        Trang sau
                    </Button>
                </div>
            </div>
        </div>
    );
}
