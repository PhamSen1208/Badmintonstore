using BadmintonStores.Application.DTOs.Orders;
using BadmintonStores.Application.Interfaces;
using BadmintonStores.Infrastructure.Data;
using BadmintonStores.Application.Common.Exceptions;
using Microsoft.EntityFrameworkCore;
using BadmintonStores.Domain.Enums;
using BadmintonStores.Domain.Entities;


namespace BadmintonStores.Infrastructure.Services;

public class OrderService : IOrderService
{
    private readonly AppDbContext _dbContext;

    public OrderService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CreateOrderResult> CreateOrderAsync(CreateOrderDto request, CancellationToken cancellationToken = default)
    {
        ValidateRequest(request);
        var customerExists = await _dbContext.Customers.AnyAsync(c => c.Id == request.CustomerId, cancellationToken);
        if(!customerExists)
        {
            throw new NotFoundException("CUSTOMER_NOT_FOUND", "Khách hàng không tồn tại");
        }

        var warehouseExists = await _dbContext.Warehouses.AnyAsync(w => w.Id == request.WarehouseId, cancellationToken);
        if(!warehouseExists)
        {
            throw new NotFoundException("WAREHOUSE_NOT_FOUND", "Kho hàng không tồn tại");
        }

        PaymentMethod? paymentMethod = null;
        if (request.Payment != null)
        {
            paymentMethod = ParsePaymentMethod(request.Payment.PaymentMethod);
        }

        // Nhóm các item theo product variant id và tính tổng số lượng cho mỗi product variant để kiểm tra tồn kho (từ client) 
        var orderItems = request.Items
            .GroupBy(i => i.ProductVariantId)
            .Select(g => new 
            {
                ProductVariantId = g.Key,
                Quantity = g.Sum(i => i.Quantity)
            })
            .ToList();
        //Lấy danh sách product variant id (từ client)
        var productVariantIds = orderItems
            .Select(i => i.ProductVariantId)
            .Distinct()
            .ToList();
        
        // Truy vấn database để lấy thông tin chi tiết của các product variant (từ database)
        var variants = await _dbContext.ProductVariants
            .Include(v => v.Product)
            .Where(v => productVariantIds.Contains(v.Id))
            .ToListAsync(cancellationToken);
        
        // Kiểm tra xem tất cả product variant trong request có tồn tại trong database hay không
        if(variants.Count != productVariantIds.Count)
        {
            throw new NotFoundException("PRODUCT_VARIANTS_NOT_FOUND", "Một hoặc nhiều sản phẩm biến thể không tồn tại");
        }

        //Lấy thông tin tồn kho của các product variant trong warehouse chỉ định (từ database)
        var stocks = await _dbContext.Stocks
            .Where(s => s.WarehouseId == request.WarehouseId && productVariantIds.Contains(s.ProductVariantId))
            .ToListAsync(cancellationToken);

        var insufficientStockDetails = new List<object>(); // Danh sách chi tiết sản phẩm thiếu hàng
        foreach(var item in orderItems)
        {
            // Tìm thông tin tồn kho của product variant hiện tại
            var stock = stocks.FirstOrDefault(s => s.ProductVariantId == item.ProductVariantId); 
            var availableQuantity = stock?.Quantity ?? 0;

            if(availableQuantity < item.Quantity)
            {
                insufficientStockDetails.Add(new
                {
                    productVariantId = item.ProductVariantId,
                    requestedQuantity = item.Quantity,
                    availableQuantity,
                    warehouseId = request.WarehouseId
                });
            }
        }

        if(insufficientStockDetails.Count > 0)
        {
            throw new InsufficientStockException(insufficientStockDetails);
        }

        // Tính toán subtotal, discount và total cho đơn hàng
        var subTotal = orderItems.Sum(item =>
        {
            var variant = variants.First(v => v.Id == item.ProductVariantId);
            var unitPrice = variant.SalePrice ?? variant.Price; // Nếu có giá sale thì dùng giá sale, không thì dùng giá gốc
            return unitPrice * item.Quantity;
        });

        decimal discountAmount = 0; //Tạm để
        var totalAmount = subTotal - discountAmount;

        // Bắt đầu transaction để đảm bảo tính toàn vẹn dữ liệu
        await using var transaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);

        // Tạo đơn hàng
        var order = new Order
        {
            OrderCode = await GenerateOrderCodeAsync(cancellationToken),
            CustomerId = request.CustomerId,
            OrderDate = DateTime.UtcNow,
            Status = OrderStatus.Confirmed,
            PaymentStatus = paymentMethod.HasValue ? PaymentStatus.Paid : PaymentStatus.Unpaid,
            Subtotal = subTotal,
            DiscountAmount = discountAmount,
            TotalAmount = totalAmount,
            CreatedAt = DateTime.UtcNow,
            Note = request.Note
        };

        _dbContext.Orders.Add(order);
        await _dbContext.SaveChangesAsync(cancellationToken);

        // Tạo chi tiết đơn hàng
        var resultItems = new List<CreateOrderItemResult>();
        foreach(var item in orderItems)
        {
            var variant = variants.First(v => v.Id == item.ProductVariantId); // Lấy thông tin product variant từ database để đảm bảo dữ liệu chính xác, tránh việc client gửi sai thông tin như giá cả, tên sản phẩm, SKU,... (từ database)
            var product = variant.Product;
            var stock = stocks.First(s => s.ProductVariantId == item.ProductVariantId);
            var unitPrice = variant.SalePrice ?? variant.Price;
            var lineTotal = unitPrice * item.Quantity;
            var quantityBefore = stock.Quantity;
            var quantityAfter = quantityBefore - item.Quantity;

            var orderDetail = new OrderDetail
            {
                OrderId = order.Id,
                ProductId = product.Id,
                ProductVariantId = variant.Id,
                ProductName = product.ProductName,
                VariantName = BuildVariantName(variant),
                SKU = variant.SKU,
                Quantity = item.Quantity,
                UnitPrice = unitPrice,
                DiscountAmount = 0,
                LineTotal = lineTotal,
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.OrderDetails.Add(orderDetail);
            stock.Quantity = quantityAfter;
            stock.UpdatedAt = DateTime.UtcNow;
            await _dbContext.SaveChangesAsync(cancellationToken);

            // Tạo bản ghi inventory transaction để ghi nhận việc xuất kho do bán hàng
            var inventoryTransaction = new InventoryTransaction
            {
                TransactionCode = await GenerateInventoryTransactionCodeAsync(cancellationToken),
                WarehouseId = request.WarehouseId,
                ProductVariantId = variant.Id,
                TransactionType = InventoryTransactionType.Sale,
                Quantity = -item.Quantity,
                QuantityBefore = quantityBefore,
                QuantityAfter = quantityAfter,
                ReferenceType = InventoryReferenceType.Order,
                ReferenceId = order.Id,
                OrderId = order.Id,
                OrderDetailId = orderDetail.Id,
                Note = $"Sale order {order.OrderCode}",
                CreatedAt = DateTime.UtcNow
            };

            await _dbContext.InventoryTransactions.AddAsync(inventoryTransaction, cancellationToken);
            
            resultItems.Add(new CreateOrderItemResult // Trả response cho client
            {
                ProductVariantId = variant.Id,
                SKU = variant.SKU,
                ProductName = product.ProductName,
                UnitPrice = unitPrice,
                Quantity = item.Quantity,
                LineTotal = lineTotal
            });
        }

        CreateOrderPaymentResult? paymentResult = null;
        if(paymentMethod.HasValue)
        {
            var payment = new Payment
            {
                PaymentCode = await GeneratePaymentTransactionCodeAsync(cancellationToken),
                OrderId = order.Id,
                Amount = totalAmount,
                PaymentMethod = paymentMethod.Value,
                PaymentStatus = PaymentStatus.Paid,
                PaidAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.Payments.Add(payment);

            paymentResult = new CreateOrderPaymentResult // Trả response cho client
            {
                PaymentMethod = paymentMethod.Value.ToString().ToLowerInvariant(),
                PaymentStatus = PaymentStatus.Paid.ToString().ToLowerInvariant(),
                Amount = totalAmount
            };
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return new CreateOrderResult // Trả response cho client
        {
            OrderId = order.Id,
            OrderCode = order.OrderCode,
            Status = order.Status.ToString().ToLowerInvariant(),
            PaymentStatus = order.PaymentStatus.ToString().ToLowerInvariant(),
            Subtotal = order.Subtotal,
            DiscountAmount = order.DiscountAmount,
            TotalAmount = order.TotalAmount,
            Items = resultItems,
            Payment = paymentResult
        };
    }

    public async Task<GetOrderDetailResult> GetOrderByIdAsync(int orderId, CancellationToken cancellationToken = default)
    {
        if(orderId <= 0)
        {
            throw new ValidationException("INVALID_ORDER_ID", "OrderId không hợp lệ");
        }
        
        //lấy thông tin đơn hàng từ database, bao gồm cả chi tiết đơn hàng và thông tin thanh toán
        var order = await _dbContext.Orders
            .Include(od => od.OrderDetails)
            .Include(o => o.Payments)
            .FirstOrDefaultAsync(o => o.Id == orderId, cancellationToken);
        
        if(order == null)
        {
            throw new NotFoundException("ORDER_NOT_FOUND", "Đơn hàng không tồn tại");
        }

        var payment = order.Payments.FirstOrDefault(); // Giả sử mỗi đơn hàng chỉ có 1 bản ghi payment, nếu có nhiều hơn thì cần điều chỉnh lại cho phù hợp
        return new GetOrderDetailResult
        {
            OrderId = order.Id,
            OrderCode = order.OrderCode,
            Status = order.Status.ToString().ToLowerInvariant(),
            PaymentStatus = order.PaymentStatus.ToString().ToLowerInvariant(),
            Subtotal = order.Subtotal,
            Note = order.Note,
            DiscountAmount = order.DiscountAmount,
            TotalAmount = order.TotalAmount,
            Items = order.OrderDetails.Select(od => new GetOrderDetailItemResult
            {
                ProductVariantId = od.ProductVariantId,
                SKU = od.SKU,
                ProductName = od.ProductName,
                UnitPrice = od.UnitPrice,
                Quantity = od.Quantity,
                LineTotal = od.LineTotal
            }).ToList(),
            Payment = payment == null ? null : new GetOrderDetailPaymentResult
            {
                PaymentMethod = payment.PaymentMethod.ToString().ToLowerInvariant(),
                PaymentStatus = payment.PaymentStatus.ToString().ToLowerInvariant(),
                Amount = payment.Amount
            }
        };
    }

    public async Task<GetOrdersResult> GetOrdersAsync(GetOrdersQuery query, CancellationToken cancellationToken = default)
    {
        var page = query.PageNumber <= 0 ? 1 : query.PageNumber;
        var pageSize = query.PageSize <= 0 ? 20 : query.PageSize;

        pageSize = pageSize > 100 ? 100 : pageSize; // Giới hạn page size tối đa là 100 để tránh việc client gửi giá trị quá lớn

        //Lấy danh sách đơn hàng và thông tin khách hàng  
        var ordersQuery = _dbContext.Orders.Include(c => c.Customer).AsQueryable();
        if(query.CustomerId.HasValue)
        {
            ordersQuery = ordersQuery.Where(o => o.CustomerId == query.CustomerId.Value); // Lọc theo customer id nếu client gửi
        }

        if(!string.IsNullOrWhiteSpace(query.Status))
        {
            var paymentSatus = ParseOrderStatus(query.Status);
            ordersQuery = ordersQuery.Where(o => o.Status == paymentSatus); // Lọc theo order status nếu client gửi
        }

        if(!string.IsNullOrWhiteSpace(query.PaymentStatus))
        {
            var paymentSatus = ParsePaymentStatus(query.PaymentStatus);
            ordersQuery = ordersQuery.Where(o => o.PaymentStatus == paymentSatus); // Lọc theo payment status nếu client gửi
        }

        var totalItems = await ordersQuery.CountAsync(cancellationToken);
        var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

        var items = await ordersQuery
            .OrderByDescending(o => o.OrderDate) // Sắp xếp theo ngày tạo đơn mới nhất
            .Skip((page - 1) * pageSize) // Bỏ qua các bản ghi của các trang trước đó
            .Take(pageSize) // Lấy số bản ghi của trang hiện tại
            .Select(o => new GetOrdersItemResult 
            {
                OrderId = o.Id,
                OrderCode = o.OrderCode,
                CustomerId = o.CustomerId,
                CustomerName = o.Customer.FullName,
                OrderDate = o.OrderDate,
                Status = o.Status.ToString().ToLowerInvariant(),
                PaymentStatus = o.PaymentStatus.ToString().ToLowerInvariant(),
                TotalAmount = o.TotalAmount
            })
            .ToListAsync(cancellationToken);

        // Trả về kết quả phân trang cho client
        return new GetOrdersResult
        {
            Items = items,
            PageNumber = page,
            PageSize = pageSize,
            TotalItems = totalItems,
            TotalPages = totalPages
        };
    }

    public async Task<CancelOrderResult> CancelOrderResultAsync(int orderId, CancellationToken cancellationToken = default)
    {
       if(orderId <= 0)
        {
            throw new ValidationException("INVALID_ORDER_ID", "OrderId không hợp lệ");
        }
        var order = await _dbContext.Orders
        .Include(o => o.OrderDetails)
        .FirstOrDefaultAsync(o => o.Id == orderId, cancellationToken); // Lấy thông tin đơn hàng từ database  

        if(order == null)
        {
            throw new NotFoundException("ORDER_NOT_FOUND", "Đơn hàng không tồn tại");
        }

        if(order.Status == OrderStatus.Cancelled)
        {
            throw new ValidationException("ORDER_ALREADY_CANCELLED", "Đơn hàng đã được hủy trước đó");
        }

        await using var transaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);

        // Lấy danh sách product variant id từ chi tiết đơn hàng để cập nhật lại tồn kho khi hủy đơn hàng
        var productVariantIds = order.OrderDetails
            .Select(od => od.ProductVariantId)
            .Distinct()
            .ToList();

        // Lấy thông tin tồn kho của các product variant trong warehouse để cập nhật lại tồn kho khi hủy đơn hàng
        var stocks = await _dbContext.Stocks
            .Where(s => productVariantIds.Contains(s.ProductVariantId))
            .ToListAsync(cancellationToken);

        foreach(var detail in order.OrderDetails)
        {   
            var stock = stocks.FirstOrDefault(s => s.ProductVariantId == detail.ProductVariantId); //Lấy thông tin tồn kho của product variant hiện tại   

            if(stock == null)
            {
                throw new NotFoundException("STOCK_NOT_FOUND", $"Không tìm thấy thông tin tồn kho cho sản phẩm biến thể id {detail.ProductVariantId}");
            }

            var quantityBefore = stock.Quantity;
            var quantityAfter = quantityBefore + detail.Quantity; // Cập nhật lại tồn kho
            stock.Quantity = quantityAfter;
            stock.UpdatedAt = DateTime.UtcNow;

            //Tạo bản ghi inventory transaction để ghi nhận việc nhập kho do hủy đơn hàng
            var inventoryTransaction = new InventoryTransaction
            {
                TransactionCode = await GenerateInventoryTransactionCodeAsync(cancellationToken),
                WarehouseId = stock.WarehouseId,
                ProductVariantId = detail.ProductVariantId,
                TransactionType = InventoryTransactionType.Sale,
                Quantity = detail.Quantity,
                QuantityBefore = quantityBefore,
                QuantityAfter = quantityAfter,
                ReferenceType = InventoryReferenceType.Order,
                ReferenceId = order.Id,
                OrderId = order.Id,
                OrderDetailId = detail.Id,
                Note = $"Hủy đơn hàng {order.OrderCode}",
                CreatedAt = DateTime.UtcNow
            };
            _dbContext.InventoryTransactions.Add(inventoryTransaction);
        }

        order.Status = OrderStatus.Cancelled;
        order.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return new CancelOrderResult
        {
            OrderId = order.Id,
            OrderCode = order.OrderCode,
            Status = order.Status.ToString().ToLowerInvariant()
        };
    }

    public async Task<UpdateOrderNoteResult> UpdateOrderNoteAsync(UpdateOrderNoteDto request, CancellationToken cancellationToken = default)
    {
        if(request.OrderId <= 0)
        {
            throw new ValidationException("INVALID_ORDER_ID", "OrderId không hợp lệ");
        }

        if(request.Note != null && request.Note.Length > 1000)
        {
            throw new ValidationException("NOTE_TOO_LONG", "Ghi chú không được vượt quá 1000 ký tự");
        }

        var order = await _dbContext.Orders.FirstOrDefaultAsync(o => o.Id == request.OrderId, cancellationToken);
        if(order == null)
        {
            throw new NotFoundException("ORDER_NOT_FOUND", "Đơn hàng không tồn tại");
        }
        
        order.Note = request.Note;
        order.UpdatedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new UpdateOrderNoteResult
        {
            OrderId = order.Id,
            OrderCode = order.OrderCode,
            Note = order.Note
        };
    }

    private static void ValidateRequest(CreateOrderDto request)
    {
        if(request.CustomerId <= 0) 
        {
            throw new ValidationException("INVALID_CUSTOMER_ID", "CustomerId không hợp lệ");
        }

        if(request.WarehouseId <= 0)
        {
            throw new ValidationException("INVALID_WAREHOUSE_ID", "WarehouseId không hợp lệ");
        }

        if(request.Items.Count <= 0)
        {
            throw new ValidationException("ORDER_ITEMS_REQUIRED", "Đơn hàng phải có ít nhất một sản phẩm");
        }

        foreach(var item in request.Items)
        {
            if(item.ProductVariantId <= 0)
            {
                throw new ValidationException("INVALID_PRODUCT_VARIANT_ID", "ProductVariantId không hợp lệ");
            }

            if(item.Quantity <= 0)
            {
                throw new ValidationException("INVALID_QUANTITY", "Số lượng phải lớn hơn 0");
            }
        }

        if(request.Payment != null && string.IsNullOrEmpty(request.Payment.PaymentMethod))
        {
            throw new ValidationException("INVALID_PAYMENT_METHOD", "Phương thức thanh toán là bắt buộc");
        }
    }

    // Nhận payment method từ request và chuyển đổi thành enum PaymentMethod
    private static PaymentMethod ParsePaymentMethod(string paymentMethod)
    {
        return paymentMethod.Trim().ToLower() switch 
        {
            "cash" => PaymentMethod.Cash,
            "bank_transfer" => PaymentMethod.BankTransfer,
            _ => throw new ValidationException("INVALID_PAYMENT_METHOD", $"Phương thức thanh toán '{paymentMethod}' không được hỗ trợ")
        };
    }

    private static PaymentStatus ParsePaymentStatus(string status)
    {
        return status.Trim().ToLower() switch
        {
            "paid" => PaymentStatus.Paid,
            "unpaid" => PaymentStatus.Unpaid,
            _ => throw new ValidationException("INVALID_PAYMENT_STATUS", $"Trạng thái thanh toán '{status}' không hợp lệ")
        };
    }

    private static OrderStatus ParseOrderStatus(string status)
    {
        return status.Trim().ToLower() switch
        {
            "confirmed" => OrderStatus.Confirmed,
            "cancelled" => OrderStatus.Cancelled,
            _ => throw new ValidationException("INVALID_ORDER_STATUS", $"Trạng thái đơn hàng '{status}' không hợp lệ")
        };
    }

    private static string BuildVariantName(ProductVariant variant)
    {
        var parts = new [] {variant.Color, variant.Size}
            .Where(s => !string.IsNullOrWhiteSpace(s));
        return string.Join(" - ", parts);
    }

    private async Task<string> GenerateOrderCodeAsync(CancellationToken cancellationToken)
    {
        var count = await _dbContext.Orders.CountAsync(cancellationToken);
        return $"ORD{count + 1:000000}"; // Ví dụ: ORD0000001, ORD0000002, ...
    }

    private async Task<string> GenerateInventoryTransactionCodeAsync(CancellationToken cancellationToken)
    {
        var count = await _dbContext.InventoryTransactions.CountAsync(cancellationToken);
        return $"INV{count + 1:000000}"; // Ví dụ: INV0000001, INV0000002, ...
    }

    private async Task<string> GeneratePaymentTransactionCodeAsync(CancellationToken cancellationToken)
    {
        var count = await _dbContext.Payments.CountAsync(cancellationToken);
        return $"PAY{count + 1:000000}"; // Ví dụ: PAY0000001, PAY0000002, ...
    }
}