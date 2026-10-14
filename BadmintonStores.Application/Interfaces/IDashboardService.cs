using BadmintonStores.Application.DTOs.Dashboard;

namespace BadmintonStores.Application.Interfaces;

public interface IDashboardService
{
    Task<DashboardOverviewResult> GetDashboardOverviewAsync(RevenueChartQuery query, CancellationToken cancellationToken = default);
    Task<List<RevenueChartItemDto>> GetRevenueChartAsync(RevenueChartQuery query, CancellationToken cancellationToken = default);
}
