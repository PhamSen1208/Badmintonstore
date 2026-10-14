using BadmintonStores.Api.Responses;
using BadmintonStores.Application.Common.Security;
using BadmintonStores.Application.DTOs.Dashboard;
using BadmintonStores.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BadmintonStores.Api.Controllers;

[Authorize(Roles = RoleNames.AdminOrStaff)]
[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("overview")]
    public async Task<ActionResult<ApiResponse<DashboardOverviewResult>>> GetOverview([FromQuery] RevenueChartQuery query, CancellationToken cancellationToken)
    {
        var result = await _dashboardService.GetDashboardOverviewAsync(query, cancellationToken);
        return Ok(ApiResponse<DashboardOverviewResult>.Ok(result, "Lấy thông tin tổng quan thành công."));
    }

    [HttpGet("revenue")]
    public async Task<ActionResult<ApiResponse<List<RevenueChartItemDto>>>> GetRevenueChart([FromQuery] RevenueChartQuery query, CancellationToken cancellationToken)
    {
        var result = await _dashboardService.GetRevenueChartAsync(query, cancellationToken);
        return Ok(ApiResponse<List<RevenueChartItemDto>>.Ok(result, "Lấy biểu đồ doanh thu thành công."));
    }
}
