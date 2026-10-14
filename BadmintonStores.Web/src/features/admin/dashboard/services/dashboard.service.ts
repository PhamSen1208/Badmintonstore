import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type { DashboardOverviewResponse, RevenueChartItem, RevenueChartQuery } from "../types/dashboard.types";

export async function getDashboardOverview(query: RevenueChartQuery = {}) {
    const response = await api.get<ApiResponse<DashboardOverviewResponse>>("/api/dashboard/overview", {
        params: query,
    });
    return response.data.data;
}

export async function getRevenueChart(query: RevenueChartQuery = {}) {
    const response = await api.get<ApiResponse<RevenueChartItem[]>>("/api/dashboard/revenue", {
        params: query,
    });
    return response.data.data;
}
