using BadmintonStores.Api.Requests.Customers;
using BadmintonStores.Api.Responses;
using BadmintonStores.Application.Common.Exceptions;
using BadmintonStores.Domain.Entities;
using BadmintonStores.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BadmintonStores.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CustomerAddressesController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public CustomerAddressesController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("customer/{customerId:int}")]
    public async Task<IActionResult> GetCustomerAddresses(int customerId, CancellationToken cancellationToken)
    {
        var addresses = await _dbContext.CustomerAddresses
            .Where(ca => ca.CustomerId == customerId)
            .OrderByDescending(ca => ca.IsDefault)
            .ThenByDescending(ca => ca.CreatedAt)
            .ToListAsync(cancellationToken);

        return Ok(ApiResponse<object>.Ok(addresses, "Lấy danh sách địa chỉ khách hàng thành công"));
    }

    [HttpPost]
    public async Task<IActionResult> CreateAddress([FromBody] CreateCustomerAddressRequest request, CancellationToken cancellationToken)
    {
        var customerExists = await _dbContext.Customers.AnyAsync(c => c.Id == request.CustomerId, cancellationToken);
        if (!customerExists)
        {
            throw new NotFoundException("CUSTOMER_NOT_FOUND", "Khách hàng không tồn tại");
        }

        if (request.IsDefault)
        {
            var existingDefaults = await _dbContext.CustomerAddresses
                .Where(ca => ca.CustomerId == request.CustomerId && ca.IsDefault)
                .ToListAsync(cancellationToken);
            foreach (var addr in existingDefaults)
            {
                addr.IsDefault = false;
            }
        }

        var address = new CustomerAddress
        {
            CustomerId = request.CustomerId,
            RecipientName = request.RecipientName.Trim(),
            PhoneNumber = request.PhoneNumber.Trim(),
            City = request.City.Trim(),
            District = request.District.Trim(),
            Ward = request.Ward.Trim(),
            AddressDetail = request.AddressDetail.Trim(),
            IsDefault = request.IsDefault,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.CustomerAddresses.Add(address);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(ApiResponse<object>.Ok(address, "Thêm địa chỉ giao hàng thành công"));
    }
}
