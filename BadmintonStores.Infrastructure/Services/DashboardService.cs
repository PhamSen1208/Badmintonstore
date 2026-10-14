namespace BadmintonStores.Infrastructure.Services;

using BadmintonStores.Application.DTOs.Dashboard;
using BadmintonStores.Application.Interfaces;
using BadmintonStores.Domain.Enums;
using BadmintonStores.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _dbContext;

    public DashboardService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    private async Task<DashboardKpiResult> GetKpiSummaryAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var currentMonthStart = new DateTime(now.Year, now.Month,1);
        var prevMonthStart = currentMonthStart.AddMonths(-1);

        //Lấy các đơn hàng hợp lệ (kp đơn hàng đã hủy)
        var validOrders = _dbContext.Orders
            .AsNoTracking() 
            .Where(o => o.Status != OrderStatus.Cancelled);

        //Thống kê tháng hiện tại
        var currentMonthOrders = await validOrders
            .Where(o => o.OrderDate >= currentMonthStart)
            .ToListAsync(cancellationToken);
        
        decimal currentRevenue = currentMonthOrders.Sum(o => o.TotalAmount);
        int currentOrderCount = currentMonthOrders.Count;

        //Thống kê tháng trước
        var prevMonthOrders = await validOrders
            .Where(o => o.OrderDate >= prevMonthStart && o.OrderDate < currentMonthStart)
            .ToListAsync(cancellationToken);

        decimal prevRevenue = prevMonthOrders.Sum(o =>o.TotalAmount);
        int prevOrderCount = prevMonthOrders.Count;

        //Tính % tăng trưởng 
        double revenueGrowth;
        double ordersGrowth;
        if (prevRevenue > 0)
        {
            revenueGrowth = ((double)((currentRevenue - prevRevenue)/ prevRevenue) * 100);
        }
        else
        {
            if(currentRevenue > 0)
            {
                revenueGrowth = 100.0;
            }
            else
            {
                revenueGrowth = 0.0;
            }
        }

        if(prevOrderCount > 0)
        {
            ordersGrowth = ((double)(currentOrderCount - prevOrderCount) / prevOrderCount) * 100.0;
        }
        else
        {
            if(currentOrderCount > 0)
            {
                ordersGrowth = 100.0;
            }
            else
            {
                ordersGrowth = 0.0;
            }
        }

        //Tổng tất cả thời gian 
        decimal totalRevenue = await validOrders.SumAsync(o => o.TotalAmount, cancellationToken);
        int totalOrderCount = await validOrders.CountAsync(cancellationToken);
        int totalStock = await _dbContext.Stocks.SumAsync(s => s.Quantity, cancellationToken);
        int totalCustomers = await _dbContext.Customers.CountAsync(cancellationToken);

        return new DashboardKpiResult{
            TotalRevenue = totalRevenue,
            RevenueGrowthPercent = Math.Round(revenueGrowth, 1),
            OrdersGrowthPercent = Math.Round(ordersGrowth,1),
            TotalOrders = totalOrderCount,
            TotalStockQuantity = totalStock,
            TotalCustomers = totalCustomers 
        };
    }

    public async Task<List<RevenueChartItemDto>> GetRevenueChartAsync(RevenueChartQuery query, CancellationToken cancellationToken)
    {
        var now = DateTime.Now;
        
        //Nếu không truyền viewType thì mặc định xem theo "year"
        var viewType = string.IsNullOrWhiteSpace(query.ViewType) ? "year" : query.ViewType.ToLowerInvariant();
        //Lấy các đơn hàng hợp lệ
        var baseOrdersQuery = _dbContext.Orders.AsNoTracking().Where(o => o.Status != OrderStatus.Cancelled);

        var result = new List<RevenueChartItemDto>();

        switch(viewType)
        {
            case "year":
            //1. xem các năm
            var yearGroups = await baseOrdersQuery.GroupBy(o => o.OrderDate.Year)
                .Select(g => new {
                    Year = g.Key,
                    Revenue = g.Sum(o => o.TotalAmount),
                    OrderCount = g.Count(),
                })
                .OrderBy(g => g.Year)
                .ToListAsync(cancellationToken);   

                //Nếu trong db chưa có đơn hàng nào, tạo 1 cột mẫu năm hiện tại
                if(yearGroups.Any() == false)
                {
                    yearGroups.Add(new {Year = now.Year, Revenue = 0m, OrderCount = 0});
                }         

                result = yearGroups.Select(g => new RevenueChartItemDto
                {
                    Label = $"Năm {g.Year}",
                    Revenue = g.Revenue,
                    OrderCount = g.OrderCount,
                    NextViewType = "month", // click vào năm -> Tháng
                    YearValue = g.Year,
                }).ToList();
                break;
            
            case "month":
            //2. Xem tháng trong năm
            var targetYear = query.Year ?? now.Year;
            var monthData = await baseOrdersQuery
                .Where(o => o.OrderDate.Year == targetYear)
                .GroupBy(o => o.OrderDate.Month)
                .Select(g => new {
                    Month = g.Key,
                    Revenue = g.Sum(o => o.TotalAmount),
                    OrderCount = g.Count(),
                })
                .OrderBy(g => g.Month)
                .ToListAsync(cancellationToken);

                for(int m = 1 ; m <= 12; m++)
                {
                    var found = monthData.FirstOrDefault(x => x.Month == m);
                    result.Add(new RevenueChartItemDto{
                        Label = $"Tháng {m}",
                        Revenue = found !=null ? found.Revenue : 0m,
                        OrderCount = found?.OrderCount ?? 0,
                        NextViewType = "week", // click vào tháng -> Tuần
                        YearValue = targetYear,
                        MonthValue = m,
                    });
                }
                break;
            
            case "week":
            var targetYearWeek = query.Year ?? now.Year;
            var targetMonthWeek = query.Month ?? now.Month;

            var monthOrders = await baseOrdersQuery
                .Where(o => o.OrderDate.Year == targetYearWeek && o.OrderDate.Month == targetMonthWeek)
                .ToListAsync(cancellationToken);
            
            //Tính số ngày tối đa của tháng
            int daysInMonth = DateTime.DaysInMonth(targetYearWeek, targetMonthWeek);

            //Định nghĩa 5 tuần trong tháng
            var weeks = new[]
            {
                (Week: 1, Start: 1, End: 7),
                (Week: 2, Start: 8, End: 14),
                (Week: 3, Start: 15, End: 21),
                (Week: 4, Start: 22, End: 28),
                (Week: 5, Start: 29, End: daysInMonth)
            };

            foreach(var w in weeks)
            {
                if(w.Start > daysInMonth) continue;
                int endDayInWeek = Math.Min(w.End, daysInMonth);
                var ordersInWeek = monthOrders.Where(o => o.OrderDate.Day >= w.Start && o.OrderDate.Day <= endDayInWeek).ToList();

                result.Add(new RevenueChartItemDto
                {
                    Label = $"Tuần {w.Week} ({w.Start}-{endDayInWeek}/{targetMonthWeek})",
                    Revenue = ordersInWeek.Sum(o => o.TotalAmount),
                    OrderCount = ordersInWeek.Count,
                    NextViewType = "day", 
                    YearValue = targetYearWeek,
                    MonthValue = targetMonthWeek,
                    WeekValue = w.Week
                });
            }
            break;

            case "day":
            //2. Xem tháng trong năm
            var targetYearDay = query.Year ?? now.Year;
            var targetMonthDay = query.Month ?? now.Month; 
            var targetWeek = query.Week ?? 1;

            int daysInMonthDay = DateTime.DaysInMonth(targetYearDay, targetMonthDay);
            int startDay = (targetWeek - 1) * 7 + 1;
            int endDay = Math.Min(targetWeek * 7, daysInMonthDay);
            if (targetWeek == 5) endDay = daysInMonthDay;

            // Lấy các đơn hàng có ngày tạo nằm trong khoảng của tuần này
            var dayOrders = await baseOrdersQuery
                .Where(o => o.OrderDate.Year == targetYearDay 
                        && o.OrderDate.Month == targetMonthDay 
                        && o.OrderDate.Day >= startDay 
                        && o.OrderDate.Day <= endDay)
                .ToListAsync(cancellationToken);
            
            for(int d = startDay; d <= endDay; d++)
            {
                var date = new DateTime(targetYearDay, targetMonthDay, d);
                var ordersInDay = dayOrders.Where(o => o.OrderDate.Date == date.Date).ToList();
                string dayOfWeekVi = date.ToString("ddd", new CultureInfo("vi-VN"));
                result.Add(new RevenueChartItemDto
                {
                    Label = $"{dayOfWeekVi} ({d}/{targetMonthDay})",
                    Revenue = ordersInDay.Sum(o => o.TotalAmount),
                    OrderCount = ordersInDay.Count,
                    NextViewType = null, // Cấp lá nhỏ nhất, không click sâu hơn
                    YearValue = targetYearDay,
                    MonthValue = targetMonthDay,
                    WeekValue = targetWeek,
                    DayValue = d
                });
            }
            break;
        }
        return result;
    }

    private async Task<List<LowStockItemDto>> GetLowStockAlertsAsync(int threshold, CancellationToken cancellationToken)
    {
        return await _dbContext.Stocks
            .AsNoTracking()
            .Include(s => s.ProductVariant)
                .ThenInclude(v => v.Product)
            .Include(s => s.Warehouse)
            .Where(s => s.Quantity <= threshold)
            .OrderBy(s => s.Quantity)
            .Take(10)
            .Select(s => new LowStockItemDto
            {
                ProductVariantId = s.ProductVariantId,
                ProductName = s.ProductVariant.Product.ProductName,
                VariantName = s.ProductVariant.SKU,
                SKU = s.ProductVariant.SKU,
                StockQuantity = s.Quantity,
                WarehouseName = s.Warehouse.WarehouseName
            })
            .ToListAsync(cancellationToken);
    }

    private async Task<List<TopSellingProductDto>> GetTopSellingProductsAsync(int count, CancellationToken cancellationToken)
    {
        return await _dbContext.OrderDetails
            .AsNoTracking()
            .Where(od => od.Order.Status != OrderStatus.Cancelled)
            .GroupBy(od => new { od.ProductId, od.ProductName })
            .Select(g => new TopSellingProductDto
            {
                ProductId = g.Key.ProductId,
                ProductName = g.Key.ProductName,
                TotalQuantitySold = g.Sum(od => od.Quantity),
                TotalRevenue = g.Sum(od => od.LineTotal)
            })
            .OrderByDescending(g => g.TotalQuantitySold)
            .Take(count)
            .ToListAsync(cancellationToken);
    }

    public async Task<DashboardOverviewResult> GetDashboardOverviewAsync(RevenueChartQuery query, CancellationToken cancellationToken = default)
    {
        var kpis = await GetKpiSummaryAsync(cancellationToken);
        var revenueChart = await GetRevenueChartAsync(query, cancellationToken);
        var lowStockAlerts = await GetLowStockAlertsAsync(5, cancellationToken);
        var topSellingProducts = await GetTopSellingProductsAsync(5, cancellationToken);

        return new DashboardOverviewResult
        {
            Kpis = kpis,
            RevenueChart = revenueChart,
            LowStockAlerts = lowStockAlerts,
            TopSellingProducts = topSellingProducts
        };
    }



}
