namespace BadmintonStores.Application.DTOs.Dashboard;

public class RevenueChartQuery
{
    /// <summary>
    /// Loại chế độ xem: "year" (các năm), "month" (các tháng trong năm), "week" (các tuần trong tháng), "day" (các ngày trong tuần)
    /// </summary>
    public string ViewType { get; set; } = "year";
    public int? Year { get; set; }
    public int? Month { get; set; }
    public int? Week { get; set; }
}

public class RevenueChartItemDto
{
    /// <summary>
    /// Nhãn hiển thị trên cột (Ví dụ: "Năm 2026", "Tháng 8", "Tuần 3", "18/09")
    /// </summary>
    public string Label { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public int OrderCount { get; set; }

    /// <summary>
    /// Chế độ xem kế tiếp khi click vào cột (VD: từ year -> month -> week -> day -> null)
    /// </summary>
    public string? NextViewType { get; set; }
    public int? YearValue { get; set; }
    public int? MonthValue { get; set; }
    public int? WeekValue { get; set; }
    public int? DayValue { get; set; }
}

public class DashboardKpiResult
{
    public decimal TotalRevenue { get; set; }
    public double RevenueGrowthPercent { get; set; }
    public int TotalOrders { get; set; }
    public double OrdersGrowthPercent { get; set; }
    public int TotalStockQuantity { get; set; }
    public int TotalCustomers { get; set; }
}

public class LowStockItemDto
{
    public int ProductVariantId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string VariantName { get; set; } = string.Empty;
    public string SKU { get; set; } = string.Empty;
    public int StockQuantity { get; set; }
    public string WarehouseName { get; set; } = string.Empty;
}

public class TopSellingProductDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int TotalQuantitySold { get; set; }
    public decimal TotalRevenue { get; set; }
}

public class DashboardOverviewResult
{
    public DashboardKpiResult Kpis { get; set; } = new();
    public List<RevenueChartItemDto> RevenueChart { get; set; } = new();
    public List<LowStockItemDto> LowStockAlerts { get; set; } = new();
    public List<TopSellingProductDto> TopSellingProducts { get; set; } = new();
}
