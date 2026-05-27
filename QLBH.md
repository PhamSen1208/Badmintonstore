# BadmintonStores - Project Notes

Last updated: 2026-05-26

## Context

Project ca nhan hoc Backend ASP.NET Core Web API.

Domain: quan ly ban hang shop cau long.

Backend:
- ASP.NET Core Web API
- Target framework: .NET 10
- Database: SQL Server
- ORM: Entity Framework Core

Frontend React se lam sau. Phase hien tai chi tap trung Backend API.

## Phase 1 Scope

Chi lam core ban hang.

Bang giu lai:
- users
- customers
- warehouses
- products
- product_variants
- stocks
- orders
- order_details
- inventory_transactions
- payments

Bang tam bo:
- brands
- categories
- product_images
- tax_rates
- shipments
- returns
- refunds
- promotions
- coupons
- suppliers
- purchase_orders
- reviews
- audit_logs
- attributes

## Architecture

Clean Architecture don gian:

- BadmintonStores.Api
- BadmintonStores.Application
- BadmintonStores.Domain
- BadmintonStores.Infrastructure

Dependency direction:

- Api -> Application
- Api -> Infrastructure
- Application -> Domain
- Infrastructure -> Application
- Infrastructure -> Domain
- Domain -> no dependencies

Important rule:

- Application must not reference Api.
- Api Request/Response are HTTP contracts.
- Application DTO/Result are backend layer contracts.
- Domain Entities are business/database objects.

## Current Folder Structure

BadmintonStores.Api:
- Controllers
- Requests
- Responses
- Middlewares
- Extensions

BadmintonStores.Application:
- DTOs
- Interfaces
- Services
- Validators
- Common/Exceptions

BadmintonStores.Domain:
- Entities
- Enums

BadmintonStores.Infrastructure:
- Data
- Configurations
- Migrations
- Seed
- Services

## Completed So Far

- Solution/project structure created.
- API, Application, Domain, Infrastructure projects created.
- Project references configured.
- EF Core SQL Server packages installed.
- AppDbContext created.
- DbSet configured for Phase 1 entities.
- Connection string configured for SQL Server.
- Domain enums created.
- Phase 1 entities created.
- EF Core configurations created.
- Initial migration created.
- Database updated successfully.
- Seed data added and app run successfully.
- ApiResponse and ErrorResponse created.
- Business exceptions created:
  - ValidationException
  - NotFoundException
  - InsufficientStockException
- ExceptionHandlingMiddleware created and registered.
- CreateOrder request/response contracts created in Api.
- CreateOrder DTO/result contracts created in Application.
- IOrderService created.
- OrderService implemented in Infrastructure.
- OrdersController created.
- POST /api/orders tested successfully with Postman.
- GET /api/orders/{orderId} tested successfully with Postman.
- GET /api/orders tested successfully with Postman.
- PATCH /api/orders/{orderId}/cancel tested successfully with Postman.
- PATCH /api/orders/{orderId}/note tested successfully with Postman.
- Basic order CRUD/read flow is working end-to-end.

## Create Order Flow

Target flow:

1. Client sends create order request.
2. API receives CreateOrderRequest.
3. Controller maps request to CreateOrderDto.
4. OrderService validates request.
5. OrderService checks customer exists.
6. OrderService checks warehouse exists.
7. OrderService loads product variants and products.
8. OrderService checks all variants exist.
9. OrderService loads stocks by warehouse and product variants.
10. OrderService checks stock is enough.
11. OrderService calculates subtotal, discountAmount, totalAmount.
12. Begin DB transaction.
13. Insert order.
14. Insert order_details.
15. Update stocks.
16. Insert inventory_transactions.
17. Insert payment if payment exists.
18. Commit transaction.
19. Return CreateOrderResult.
20. Controller maps result to CreateOrderResponse.

## OrderService Current Understanding

OrderService is the core use case for creating an order.

It touches many tables:
- customers
- warehouses
- product_variants
- products
- stocks
- orders
- order_details
- inventory_transactions
- payments

Main idea:

- Client only says what it wants to buy: productVariantId and quantity.
- Backend must decide price, total amount, order status, payment status, stock update, and transaction history.
- Backend must not trust price or total amount from client.

Why ProductVariant is central:

- Product is the general item, for example "Yonex racket".
- ProductVariant is the exact sellable item, for example "Yonex racket - Blue - 4U - SKU YONEX-001".
- Price, SKU, color, size, and stock are tied to ProductVariant.
- Stock is stored by WarehouseId + ProductVariantId.

Important table roles:

- stocks: current balance.
- inventory_transactions: history of stock changes.
- orders: order header.
- order_details: order line snapshot.
- payments: payment information.

## OrderService Review Notes

Current OrderService follows the right high-level flow:

- validate request
- check customer
- check warehouse
- load variants with product
- load stocks
- check stock
- calculate money
- begin transaction
- create order
- create order details
- reduce stock
- create inventory transactions
- create payment
- commit
- return result

Fixes already applied:

1. Group duplicate productVariantId items before processing.

Current risk:

If request has:

```json
[
  { "productVariantId": 10, "quantity": 6 },
  { "productVariantId": 10, "quantity": 6 }
]
```

and stock is 10, checking each row separately passes, but total requested is 12.

Fix idea:

```csharp
var orderItems = request.Items
    .GroupBy(x => x.ProductVariantId)
    .Select(g => new
    {
        ProductVariantId = g.Key,
        Quantity = g.Sum(x => x.Quantity)
    })
    .ToList();
```

Then use orderItems instead of request.Items for:
- productVariantIds
- stock check
- subtotal calculation
- order detail creation

2. Use NotFoundException for missing database records.

NotFoundException should be used for:
- CUSTOMER_NOT_FOUND
- WAREHOUSE_NOT_FOUND
- PRODUCT_VARIANTS_NOT_FOUND

- NotFoundException -> HTTP 404
- ValidationException -> HTTP 400
- InsufficientStockException -> HTTP 409

3. Parse payment method early.

```csharp
PaymentMethod? paymentMethod = null;

if (request.Payment != null)
{
    paymentMethod = ParsePaymentMethod(request.Payment.PaymentMethod);
}
```

Then use paymentMethod for:
- Order.PaymentStatus
- Payment.PaymentMethod
- Payment response

Remaining cleanup idea:

4. Use one DateTime value per request if desired.

Better:

```csharp
var now = DateTime.UtcNow;
```

Then use now for:
- OrderDate
- CreatedAt
- UpdatedAt
- PaidAt

5. Normalize payment response.

Prefer:

```csharp
PaymentStatus = PaymentStatus.Paid.ToString().ToLowerInvariant()
```

instead of hard-coded:

```csharp
PaymentStatus = "Paid"
```

6. Clean encoding issues in comments/messages.

Some Vietnamese comments/messages are mojibake in terminal.
Use English or Vietnamese without accents for now.

7. Middleware should return HTTP 409 for InsufficientStockException.

Expected mapping:

- ValidationException -> 400 Bad Request
- NotFoundException -> 404 Not Found
- InsufficientStockException -> 409 Conflict
- Other Exception -> 500 Internal Server Error

## OrdersController Flow

OrdersController is the HTTP boundary for order APIs.

Controller responsibilities:

- Receive request from client.
- Map Api Request to Application DTO/Query.
- Call IOrderService.
- Map Application Result to Api Response.
- Return ApiResponse<T>.

Controller should not:

- Query database directly.
- Calculate order totals.
- Check stock.
- Update stock.
- Create payments directly.

Current endpoints:

```http
POST /api/orders
GET /api/orders/{orderId}
GET /api/orders
PATCH /api/orders/{orderId}/cancel
PATCH /api/orders/{orderId}/note
```

POST /api/orders flow:

```text
Client JSON
-> CreateOrderRequest
-> OrdersController maps to CreateOrderDto
-> OrderService.CreateOrderAsync
-> CreateOrderResult
-> OrdersController maps to CreateOrderResponse
-> ApiResponse<CreateOrderResponse>
```

GET /api/orders/{orderId} flow:

```text
Route id
-> OrdersController calls GetOrderByIdAsync(id)
-> GetOrderDetailResult
-> OrdersController maps to GetOrderDetailResponse
-> ApiResponse<GetOrderDetailResponse>
```

GET /api/orders flow:

```text
Query string
-> GetOrdersRequest
-> OrdersController maps to GetOrdersQuery
-> OrderService.GetOrdersAsync
-> GetOrdersResult
-> OrdersController maps to GetOrdersResponse
-> ApiResponse<GetOrdersResponse>
```

PATCH /api/orders/{orderId}/cancel flow:

```text
Route orderId
-> OrdersController calls CancelOrderResultAsync(orderId)
-> OrderService loads order with OrderDetails
-> OrderService restores stock per OrderDetail
-> OrderService inserts inventory transaction per restored item
-> OrderService updates Order.Status to Cancelled
-> SaveChanges + Commit transaction
-> CancelOrderResult
-> OrdersController maps to CancelOrderResponse
-> ApiResponse<CancelOrderResponse>
```

PATCH /api/orders/{orderId}/note flow:

```text
Route orderId + body note
-> UpdateOrderNoteRequest
-> OrdersController maps to UpdateOrderNoteDto
-> OrderService.UpdateOrderNoteAsync
-> UpdateOrderNoteResult
-> OrdersController maps to UpdateOrderNoteResponse
-> ApiResponse<UpdateOrderNoteResponse>
```

## Get Orders List Notes

Endpoint:

```http
GET /api/orders
GET /api/orders?pageNumber=1&pageSize=20
GET /api/orders?customerId=1
GET /api/orders?status=confirmed
GET /api/orders?paymentStatus=paid
```

Important EF Core lesson:

Use Include only for navigation properties.

Wrong:

```csharp
_dbContext.Orders.Include(o => o.CustomerId)
```

CustomerId is an int scalar property, not a navigation property.

Correct:

```csharp
_dbContext.Orders.Include(o => o.Customer)
```

This is needed because list response uses:

```csharp
CustomerName = o.Customer.FullName
```

## Debugging 500 Errors

500 means an unexpected exception reached the generic exception handler.

Debug process:

1. Identify which endpoint returns 500.
2. Check terminal logs while sending the request from Postman.
3. Temporarily expose exception details in development middleware if needed.
4. Find the exact service/controller method used by that endpoint.
5. Check EF queries, Include usage, null navigation properties, enum parsing, and database data.

Temporary development-only middleware change:

```csharp
catch (Exception ex)
{
    await WriteErrorResponseAsync(
        context,
        HttpStatusCode.InternalServerError,
        "INTERNAL_SERVER_ERROR",
        ex.Message,
        ex.ToString());
}
```

Do not expose ex.ToString() in production.

Actual 500 fixed:

- Endpoint: GET /api/orders
- Cause: Include was used with CustomerId.
- Fix: use Include(o => o.Customer).

## Mapping Bugs Learned

Bug: Order note was updated successfully in DB, but GET order detail returned note = null.

Cause:

- Orders.Note existed in entity/database.
- UpdateOrderNoteAsync updated note correctly.
- GetOrderDetailResponse had Note.
- But GetOrderDetailResult did not include Note, and GetOrderByIdAsync did not map Note = order.Note.

Fix:

- Add Note to GetOrderDetailResult.
- Map Note = order.Note in OrderService.GetOrderByIdAsync.
- Map Note = result.Note in OrdersController.GetOrderDetail.

Lesson:

For every field returned to client, trace the full output path:

```text
Database column
-> Entity property
-> Application Result
-> API Response
-> JSON
```

If any layer misses the field, response can be wrong even when database is correct.

Bug: Cancel order returned success but DB did not change.

Causes:

1. Missing Include(o => o.OrderDetails), so order.OrderDetails was empty.
2. Missing SaveChangesAsync and transaction.CommitAsync, so tracked changes were not persisted.

Lessons:

- Include navigation properties before using them.
- SaveChangesAsync writes tracked changes to DB.
- CommitAsync confirms the manual transaction.

## Manual Debug Example

Example database:

- Customer Id = 1
- Warehouse Id = 1
- Product Id = 1, ProductName = "Vot cau long Yonex"
- ProductVariant Id = 10, SKU = "YONEX-001", Price = 100000, SalePrice = null, Color = "Blue", Size = "4U"
- Stock WarehouseId = 1, ProductVariantId = 10, Quantity = 10

Example request:

```json
{
  "customerId": 1,
  "warehouseId": 1,
  "note": "Khach mua tai shop",
  "items": [
    {
      "productVariantId": 10,
      "quantity": 2
    }
  ],
  "payment": {
    "paymentMethod": "cash"
  }
}
```

Expected service behavior:

- Validate input: pass.
- Customer 1 exists: pass.
- Warehouse 1 exists: pass.
- productVariantIds = [10].
- Load variant 10 and product.
- Load stock for warehouse 1 and variant 10.
- Stock check: 10 >= 2, pass.
- unitPrice = 100000.
- lineTotal = 100000 * 2 = 200000.
- subtotal = 200000.
- discountAmount = 0.
- totalAmount = 200000.
- Begin transaction.
- Create order ORD000001.
- Create order detail for variant 10.
- Stock quantity changes from 10 to 8.
- Create inventory transaction with Quantity = -2.
- Create payment PAY000001, cash, paid, amount 200000.
- Commit transaction.
- Return result with order information and item summary.

## Current API Test Status

Tested with Postman:

- POST /api/orders: success.
- GET /api/orders/{orderId}: success.
- GET /api/orders: success.
- PATCH /api/orders/{orderId}/cancel: success.
- PATCH /api/orders/{orderId}/note: success.

Recommended manual test cases still worth keeping:

- Create order success.
- Customer not found.
- Warehouse not found.
- ProductVariant not found.
- Insufficient stock.
- Quantity <= 0.
- Empty items.
- Invalid payment method.
- Duplicate productVariantId in request items.
- Get order by existing id.
- Get order by missing id.
- Get orders with status filter.
- Get orders with paymentStatus filter.
- Get orders with pagination.

## Order Module Current Status

Implemented:

- Create order.
- Get order detail.
- Get order list.
- Cancel order.
- Update order note.

Phase 1 recommendation:

- Do not implement full update order yet.
- Orders affect stock/payment/inventory, so arbitrary update is risky.
- Supported order operations are create, read detail, list, cancel, and update note.

## Next Step

Move to CRUD for master data.

Recommended order:

1. Products
2. ProductVariants
3. Warehouses
4. Customers

Reason:

- Product/ProductVariant/Stock are needed by order flow.
- Warehouse is simple and useful for stock.
- Customer is also needed, but later customer/user design can become auth-related.

Recommended first master data module:

```text
Products
```

Suggested Product CRUD endpoints:

```http
POST /api/products
GET /api/products/{id}
GET /api/products
PATCH /api/products/{id}
PATCH /api/products/{id}/status
```

Keep Phase 1 simple:

- No image.
- No brand/category.
- No complex search.
- ProductVariant CRUD can be added after Product CRUD is stable.
