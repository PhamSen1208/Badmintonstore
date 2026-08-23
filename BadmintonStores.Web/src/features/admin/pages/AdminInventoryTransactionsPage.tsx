import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InventoryTransactionTable } from "../InventoryTransactions/components/InventoryTransactionTable";
import { getInventoryTransactions } from "../InventoryTransactions/services/admin-inventoryTransaction.service";
import type { GetInventoryTransactionItem } from "../InventoryTransactions/types/admin-inventoryTransactions.types";

export function AdminInventoryTransactionsPage() {
    const [transactions, setTransactions] = useState<GetInventoryTransactionItem[]>([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function loadTransactions() {
        try {
            setIsLoading(true);
            setErrorMessage(null);
            const response = await getInventoryTransactions({
                pageNumber,
                pageSize,
            });
            setTransactions(response.items);
            setTotalPages(response.totalPages);
        } catch {
            setErrorMessage("Không thể tải nhật ký tồn kho.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadTransactions();
    }, [pageNumber]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Nhật ký Tồn kho</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Theo dõi lịch sử nhập, xuất và điều chỉnh tồn kho chi tiết
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={loadTransactions} title="Tải lại">
                        <RefreshCcw className="h-4 w-4 mr-1" /> Tải lại
                    </Button>
                </div>
            </div>

            {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                </div>
            )}

            <InventoryTransactionTable transactions={transactions} isLoading={isLoading} />

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
