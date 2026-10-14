using BadmintonStores.Api.Requests.Customers;
using BadmintonStores.Api.Responses.Customers;
using BadmintonStores.Application.DTOs.Customers;
using BadmintonStores.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using BadmintonStores.Api.Responses;
using BadmintonStores.Application.Common.Security;
using Microsoft.AspNetCore.Authorization;

namespace BadmintonStores.Api.Controllers;

[ApiController]
[Route("api/[controller]")]

public class CustomersController : ControllerBase
{
    private readonly ICustomerService _customerService;
    public CustomersController(ICustomerService customerService)
    {
        _customerService = customerService;
    }

    [Authorize(Roles = RoleNames.AdminOrStaff)]
    [HttpPost]
    public async Task<IActionResult> CreateCustomer([FromBody] CreateCustomerRequest request, CancellationToken cancellationToken)
    {
        var dto = new CreateCustomerDto
        {
            UserId = request.UserId,
            CustomerCode = request.CustomerCode,
            FullName = request.FullName,
            DateOfBirth = request.DateOfBirth,
            Gender = request.Gender
        };

        var result = await _customerService.CreateCustomerAsync(dto, cancellationToken);

        var response = new CreateCustomerResponse
        {
            CustomerId = result.CustomerId,
            UserId = result.UserId,
            CustomerCode = result.CustomerCode,
            FullName = result.FullName,
            Gender = result.Gender,
            DateOfBirth = result.DateOfBirth,
            CreatedAt = result.CreatedAt
        };
        return Ok(ApiResponse<CreateCustomerResponse>.Ok(response, "Tạo khách hàng thành công"));
    }

    [Authorize(Roles = RoleNames.AdminOrStaff)]
    [HttpGet("{customerId:int}")]
    public async Task<IActionResult> GetCustomer(int customerId, CancellationToken cancellationToken)
    {
        var result = await _customerService.GetCustomerByIdAsync(customerId, cancellationToken);

        var response = new GetCustomerDetailResponse
        {
            CustomerId = result.CustomerId,
            UserId = result.UserId,
            CustomerCode = result.CustomerCode,
            FullName = result.FullName,
            Email = result.Email,
            Phone = result.Phone,
            UserStatus = result.UserStatus,
            Gender = result.Gender,
            DateOfBirth = result.DateOfBirth,
            TotalOrders = result.TotalOrders,
            TotalSpent = result.TotalSpent,
            LastOrderDate = result.LastOrderDate,
            CreatedAt = result.CreatedAt,
            UpdatedAt = result.UpdatedAt
        };

        return Ok(ApiResponse<GetCustomerDetailResponse>.Ok(response, "Lấy thông tin khách hàng thành công"));
    }

    [HttpGet]
    public async Task<IActionResult> GetCustomers([FromQuery] GetCustomersRequest request, CancellationToken cancellationToken)
    {
        var query = new GetCustomersQuery
        {
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            Keyword = request.Keyword
        };

        var result = await _customerService.GetCustomersAsync(query, cancellationToken);

        var response = new GetCustomersResponse
        {
            PageNumber = result.PageNumber,
            PageSize = result.PageSize,
            TotalItems = result.TotalItems,
            TotalPages = result.TotalPages,
            Items = result.Items.Select(c => new GetCustomerItemsResponse
            {
                CustomerId = c.CustomerId,
                UserId = c.UserId,
                CustomerCode = c.CustomerCode,
                FullName = c.FullName,
                Email = c.Email,
                Phone = c.Phone,
                UserStatus = c.UserStatus,
                Gender = c.Gender,
                DateOfBirth = c.DateOfBirth,
                TotalOrders = c.TotalOrders,
                TotalSpent = c.TotalSpent,
                LastOrderDate = c.LastOrderDate,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            }).ToList(),
        };
        return Ok(ApiResponse<GetCustomersResponse>.Ok(response, "Lấy danh sách khách hàng thành công"));
    }

    [Authorize(Roles = RoleNames.AdminOrStaff)]
    [HttpPatch("{customerId:int}/toggle-status")]
    public async Task<IActionResult> ToggleCustomerStatus([FromRoute] int customerId, CancellationToken cancellationToken)
    {
        var isActive = await _customerService.ToggleCustomerStatusAsync(customerId, cancellationToken);
        var message = isActive ? "Khóa tài khoản đã mở thành công" : "Đã khóa tài khoản khách hàng";
        return Ok(ApiResponse<bool>.Ok(isActive, message));
    }

    [Authorize]
    [HttpPatch("{customerId:int}")]
    public async Task<IActionResult> UpdateCustomer([FromRoute]int customerId, [FromBody] UpdateCustomerRequest request, CancellationToken cancellationToken)
    {
        var dto = new UpdateCustomerDto
        {
            CustomerId = customerId,
            FullName = request.FullName,
            DateOfBirth = request.DateOfBirth,
            Gender = request.Gender
        };

        var result = await _customerService.UpdateCustomerAsync(dto, cancellationToken);

        var response = new UpdateCustomerResponse
        {
            CustomerId = result.CustomerId,
            UserId = result.UserId,
            CustomerCode = result.CustomerCode,
            FullName = result.FullName,
            DateOfBirth = result.DateOfBirth,
            Gender = result.Gender,
            CreatedAt = result.CreatedAt,
            UpdatedAt = result.UpdatedAt
        };
        return Ok(ApiResponse<UpdateCustomerResponse>.Ok(response, "Cập nhật thông tin khách hàng thành công"));
    }
}
