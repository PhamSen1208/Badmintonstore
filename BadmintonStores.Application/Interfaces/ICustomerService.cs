using BadmintonStores.Application.DTOs.Customers;

public interface ICustomerService
{
    Task<CreateCustomerResult> CreateCustomerAsync(CreateCustomerDto request, CancellationToken cancellationToken = default);
    Task<GetCustomerDetailResult> GetCustomerByIdAsync(int customerId, CancellationToken cancellationToken = default);
    Task<GetCustomersResult> GetCustomersAsync(GetCustomersQuery query, CancellationToken cancellationToken = default); 
    Task<UpdateCustomerResult> UpdateCustomerAsync(UpdateCustomerDto request, CancellationToken cancellationToken = default);
}