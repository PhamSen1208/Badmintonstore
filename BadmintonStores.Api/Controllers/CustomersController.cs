using BadmintonStores.Api.Requests.Customers;
using BadmintonStores.Api.Responses.Customers;
using BadmintonStores.Application.DTOs.Customers;
using BadmintonStores.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using BadmintonStores.Api.Responses;

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
            Gender = result.Gender,
            DateOfBirth = result.DateOfBirth,
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
                Gender = c.Gender,
                DateOfBirth = c.DateOfBirth,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            }).ToList(),
        };
        return Ok(ApiResponse<GetCustomersResponse>.Ok(response, "Lấy danh sách khách hàng thành công"));
    }

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
