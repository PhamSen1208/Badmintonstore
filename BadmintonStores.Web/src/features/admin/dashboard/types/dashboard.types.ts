export interface RevenueChartQuery {
    viewType?: "year" | "month" | "week" | "day";
    year?: number;
    month?: number;
    week?: number;
}

export interface RevenueChartItem {
    label: string;
    revenue: number;
    orderCount: number;
    nextViewType?: "month" | "week" | "day" | null;
    yearValue?: number;
    monthValue?: number;
    weekValue?: number;
    dayValue?: number;
}

export interface DashboardKpi {
    totalRevenue: number;
    revenueGrowthPercent: number;
    totalOrders: number;
    ordersGrowthPercent: number;
    totalStockQuantity: number;
    totalCustomers: number;
}

export interface LowStockItem {
    productVariantId: number;
    productName: string;
    variantName: string;
    sku: string;
    stockQuantity: number;
    warehouseName: string;
}

export interface TopSellingProduct {
    productId: number;
    productName: string;
    totalQuantitySold: number;
    totalRevenue: number;
}

export interface DashboardOverviewResponse {
    kpis: DashboardKpi;
    revenueChart: RevenueChartItem[];
    lowStockAlerts: LowStockItem[];
    topSellingProducts: TopSellingProduct[];
}
