using BadmintonStores.Domain.Entities;
using BadmintonStores.Domain.Enums;
using BadmintonStores.Application.Common.Exceptions;
using BadmintonStores.Application.DTOs.Customers;
using Microsoft.EntityFrameworkCore;
using BadmintonStores.Infrastructure.Data;
using BadmintonStores.Application.Interfaces;

namespace BadmintonStores.Infrastructure.Services;

public class CustomerService : ICustomerService
{
    private readonly AppDbContext _dbContext;

    public CustomerService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CreateCustomerResult> CreateCustomerAsync(CreateCustomerDto request, CancellationToken cancellationToken = default)
    {
        ValidateRequest(request);

        var userExists = await _dbContext.Users.AnyAsync(u => u.Id == request.UserId, cancellationToken);
        if(!userExists)
        {
            throw new NotFoundException("USER_NOT_FOUND", "Không tìm thấy người dùng");
        }

        var userHasCustomer = await _dbContext.Customers.AnyAsync(c => c.UserId == request.UserId, cancellationToken);
        if(userHasCustomer)
        {
            throw new ValidationException("USER_ALREADY_HAS_CUSTOMER", "Người dùng đã có khách hàng");
        }

        var customerCode = request.CustomerCode.Trim();
        var customerCodeExist = await _dbContext.Customers.AnyAsync(c => c.CustomerCode  == customerCode, cancellationToken);
        if(customerCodeExist)
        {
            throw new ValidationException("CUSTOMER_CODE_EXISTS", "Mã khách hàng đã tồn tại");        
        }

        var customer = new Customer
        {
            UserId = request.UserId,
            CustomerCode = customerCode,
            FullName = request.FullName.Trim(),
            Gender = ParseRecordGender(request.Gender),
            DateOfBirth = request.DateOfBirth,
            CreatedAt = DateTime.UtcNow,        
        };

        _dbContext.Customers.Add(customer);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new CreateCustomerResult
        {
            CustomerId = customer.Id,
            UserId = customer.UserId,
            CustomerCode = customer.CustomerCode,
            FullName = customer.FullName,
            Gender = customer.Gender.ToString().ToLowerInvariant(),
            DateOfBirth = customer.DateOfBirth,
            CreatedAt = customer.CreatedAt
        };
    }

    public async Task<GetCustomerDetailResult> GetCustomerByIdAsync(int customerId, CancellationToken cancellationToken = default)
    {
        if(customerId <= 0)
        {
            throw new ValidationException("CUSTOMER_ID_INVALID", "Mã khách hàng không hợp lệ");
        }

        var customer = await _dbContext.Customers.FirstOrDefaultAsync(c => c.Id == customerId, cancellationToken);
        if(customer == null)
        {
            throw new NotFoundException("CUSTOMER_NOT_FOUND", "Không tìm thấy khách hàng");
        }

        return new GetCustomerDetailResult
        {
            CustomerId = customer.Id,
            UserId = customer.UserId,
            CustomerCode = customer.CustomerCode,
            FullName = customer.FullName,
            DateOfBirth = customer.DateOfBirth,
            Gender = customer.Gender.ToString().ToLowerInvariant(),
            CreatedAt = customer.CreatedAt,
            UpdatedAt = customer.UpdatedAt
        };
    }

    public async Task<GetCustomersResult> GetCustomersAsync(GetCustomersQuery request, CancellationToken cancellationToken = default)
    {

        var pageNumber = request.PageNumber <= 0 ? 1 : request.PageNumber;
        var pageSize = request.PageSize <= 0 ? 20 : request.PageSize;
        pageSize = pageSize > 100 ? 100 : pageSize; // Giới hạn tối đa page size là 100

        var customersQuery = _dbContext.Customers.AsQueryable();

        if(!string.IsNullOrWhiteSpace(request.Keyword))
        {
            var keyword = request.Keyword.Trim().ToLower();
            customersQuery = customersQuery.Where(c => c.CustomerCode.ToLower().Contains(keyword) || c.FullName.ToLower().Contains(keyword));
        }

        var totalItems = await customersQuery.CountAsync(cancellationToken);
        var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

        var items = await customersQuery
            .OrderByDescending(c => c.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new GetCustomerItemsResult
            {
                CustomerId = c.Id,  
                UserId = c.UserId,
                CustomerCode = c.CustomerCode,
                FullName = c.FullName,
                DateOfBirth = c.DateOfBirth,
                Gender = c.Gender.ToString().ToLowerInvariant(),
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            }).ToListAsync(cancellationToken);

        return new GetCustomersResult
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = totalPages
        };
    }

    public async Task<UpdateCustomerResult> UpdateCustomerAsync(UpdateCustomerDto request, CancellationToken cancellationToken = default)
    {
        if(request.CustomerId <= 0)
        {
            throw new ValidationException("CUSTOMER_ID_INVALID", "Mã khách hàng không hợp lệ");
        }
        if (string.IsNullOrWhiteSpace(request.FullName))
        {
            throw new ValidationException("FULL_NAME_REQUIRED", "Họ tên khách hàng là bắt buộc");
        }
        if(request.DateOfBirth != null && request.DateOfBirth > DateOnly.FromDateTime(DateTime.UtcNow))
        {
            throw new ValidationException("DATE_OF_BIRTH_INVALID", "Ngày sinh không hợp lệ");
        }
        if(request.Gender == null || string.IsNullOrWhiteSpace(request.Gender))
        {
            throw new ValidationException("GENDER_REQUIRED", "Giới tính là bắt buộc");
        }

        var customer = await _dbContext.Customers.FirstOrDefaultAsync(c => c.Id == request.CustomerId, cancellationToken);
        if(customer == null)
        {
            throw new NotFoundException("CUSTOMER_NOT_FOUND", "Không tìm thấy khách hàng");
        }

        customer.FullName = request.FullName.Trim();
        customer.DateOfBirth = request.DateOfBirth;
        customer.Gender = ParseRecordGender(request.Gender);
        customer.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return new UpdateCustomerResult
        {
            CustomerId = customer.Id,
            UserId = customer.UserId,
            CustomerCode = customer.CustomerCode,
            FullName = customer.FullName,
            DateOfBirth = customer.DateOfBirth,
            Gender = customer.Gender.ToString().ToLowerInvariant(),
            CreatedAt = customer.CreatedAt,
            UpdatedAt = customer.UpdatedAt
        };
    }

    private static void ValidateRequest(CreateCustomerDto request)
    {
        if(request.UserId <= 0)
        {
            throw new ValidationException("USER_ID_INVALID", "Mã người dùng không hợp lệ");
        }
        if(string.IsNullOrWhiteSpace(request.CustomerCode))
        {
            throw new ValidationException("CUSTOMER_CODE_REQUIRED", "Mã khách hàng là bắt buộc");
        }
        if(string.IsNullOrWhiteSpace(request.FullName))
        {
            throw new ValidationException("FULL_NAME_REQUIRED", "Họ tên khách hàng là bắt buộc");
        }
        if(request.DateOfBirth != null && request.DateOfBirth > DateOnly.FromDateTime(DateTime.UtcNow))
        {
            throw new ValidationException("DATE_OF_BIRTH_INVALID", "Ngày sinh không hợp lệ");
        }
        if(request.CustomerCode.Length > 30)
        {
            throw new ValidationException("CUSTOMER_CODE_TOO_LONG", "Mã khách hàng không được vượt quá 30 ký tự");
        }
        if(request.FullName.Length > 255)
        {
            throw new ValidationException("FULL_NAME_TOO_LONG", "Họ tên khách hàng không được vượt quá 255 ký tự");
        }
    }

    private static Gender ParseRecordGender(string gender)
    {
        return gender.Trim().ToLowerInvariant() switch
        {
            "male" => Gender.Male,
            "female" => Gender.Female,
            "other" => Gender.Other,
            "unknown" => Gender.Unknown,
            _ => throw new ValidationException("INVALID_GENDER", "Giới tính không hợp lệ")
        };
    }
}
            