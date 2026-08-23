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

## Stock / Warehouse Notes

Warehouse and Stock are different concepts:

- Warehouse = physical place that stores goods.
- ProductVariant = exact sellable SKU, for example racket blue 4U.
- Stock = current quantity of one ProductVariant in one Warehouse.
- InventoryTransaction = history explaining why stock quantity changed.

Easy rule:

```text
Warehouse answers: where is the item stored?
ProductVariant answers: which exact SKU is it?
Stock answers: how many units are currently available in that warehouse?
InventoryTransaction answers: why did the quantity change?
```

Example:

```text
Warehouses
- Id 1: WH-HCM, Kho HCM
- Id 2: WH-HN, Kho Ha Noi

ProductVariants
- Id 10: YONEX-BLUE-4U
- Id 11: YONEX-RED-3U

Stocks
- StockId 1: WarehouseId 1, ProductVariantId 10, Quantity 20
- StockId 2: WarehouseId 1, ProductVariantId 11, Quantity 5
- StockId 3: WarehouseId 2, ProductVariantId 10, Quantity 8
```

Meaning:

- Kho HCM has 20 units of YONEX-BLUE-4U.
- Kho HCM has 5 units of YONEX-RED-3U.
- Kho Ha Noi has 8 units of YONEX-BLUE-4U.

Do not store Quantity directly on ProductVariant because the same SKU can exist in many warehouses.

## Stock Module Planned Endpoints

Recommended Phase 1 endpoints:

```http
GET   /api/warehouses/{warehouseId}/stocks
POST  /api/stocks
PATCH /api/stocks/{stockId}
```

### GET /api/warehouses/{warehouseId}/stocks

Purpose:

- View all stock rows inside one warehouse.
- Used by admin to see which SKUs exist in a warehouse and their current quantities.

Service flow:

1. Validate warehouseId > 0.
2. Check Warehouse exists.
3. Query Stocks by WarehouseId.
4. Load ProductVariant to get SKU.
5. Load Product through ProductVariant to get ProductName.
6. Return warehouse info plus stock item list.

Important navigation path:

```text
Stock -> ProductVariant -> Product
```

So this is valid:

```csharp
.Include(s => s.ProductVariant)
.ThenInclude(v => v.Product)
```

### POST /api/stocks

Purpose:

- Create initial stock balance for one ProductVariant in one Warehouse.

Request example:

```json
{
  "warehouseId": 1,
  "productVariantId": 10,
  "quantity": 20
}
```

Service flow:

1. Validate warehouseId > 0.
2. Validate productVariantId > 0.
3. Validate quantity >= 0.
4. Check Warehouse exists.
5. Check ProductVariant exists.
6. Check Stock does not already exist for the same WarehouseId + ProductVariantId.
7. Begin transaction.
8. Insert Stock.
9. Insert InventoryTransaction with type Adjustment.
10. Commit.
11. Return StockResponse.

Rule:

```text
One WarehouseId + ProductVariantId pair can have only one Stock row.
```

### PATCH /api/stocks/{stockId}

Purpose:

- Manually set the current stock quantity.
- This is an adjustment, not a sale.

Request example:

```json
{
  "quantity": 30,
  "note": "Manual stock adjustment"
}
```

Important:

```text
quantity = new current quantity
```

It is not "add this quantity".

Example:

```text
Current Quantity = 20
Request Quantity = 30
changedQuantity = 30 - 20 = +10
```

Service flow:

1. Validate stockId > 0.
2. Validate quantity >= 0.
3. Find Stock by stockId.
4. Calculate quantityBefore, quantityAfter, changedQuantity.
5. Begin transaction.
6. Update Stock.Quantity.
7. Update Stock.UpdatedAt.
8. Insert InventoryTransaction with type Adjustment.
9. Commit.
10. Return StockResponse.

## Stock And InventoryTransaction

Stock is the current balance:

```text
Stock.Quantity = 18
```

InventoryTransaction is the history:

```text
+20 Initial stock
-2  Sale order ORD000001
+7  Manual adjustment
-7  Sale order ORD000002
```

Create order flow uses stock like this:

1. Request contains warehouseId and productVariantId.
2. OrderService finds Stock by WarehouseId + ProductVariantId.
3. If Quantity is not enough, return INSUFFICIENT_STOCK.
4. If enough, subtract stock quantity.
5. Insert InventoryTransaction with type Sale and negative quantity.

ReservedQuantity exists for future expansion:

- Phase 1 does not use reserved stock deeply.
- Phase 1 subtracts Stock.Quantity directly when creating order.
- Later ecommerce flow can use Available = Quantity - ReservedQuantity.

## Stock Helper Method

`GetStockResultAsync(stockId)` is a private helper in StockService.

Purpose:

- Query one stock row by stockId.
- Include Warehouse.
- Include ProductVariant and Product.
- Map full information to StockResult.

Why it exists:

- After create/update stock, the tracked Stock entity only has IDs and quantity.
- API response needs WarehouseCode, WarehouseName, SKU, and ProductName.
- The helper avoids duplicating the same mapping logic in create/update methods.

## Phase 1 Progress Update

Current implemented modules:

- Orders
  - Create order.
  - Get order detail.
  - Get order list/filter.
  - Cancel order.
  - Update order note.
- Products
  - Create product.
  - Get product detail.
  - Get product list/filter.
  - Update product.
  - Update product status.
- ProductVariants
  - Create product variant.
  - Get product variant detail.
  - Get product variants by product.
  - Update product variant.
  - Update product variant status.
- Stocks
  - Get stocks by warehouse.
  - Create initial stock.
  - Update stock quantity.
  - Write InventoryTransaction for stock adjustment.
- Warehouses
  - Create warehouse.
  - Get warehouse detail.
  - Get warehouse list/filter.
  - Update warehouse.
  - Update warehouse status.
- Customers
  - Create customer.
  - Get customer detail.
  - Get customer list/filter.
  - Update customer.

Manual tests passed:

- Create Product -> Create ProductVariant -> Create Stock -> Create Order.
- Order creation subtracts Stock.Quantity.
- Order creation writes InventoryTransaction.
- Insufficient stock case returns expected business error.
- Cancel order restores stock and writes inventory transaction.
- Warehouse CRUD/status cases passed.
- Customer create/detail/list/update cases passed.
- Customer validation cases passed:
  - CustomerCode duplicate.
  - User not found.
  - User already has Customer.
  - Invalid gender.
  - Empty FullName.
  - Future DateOfBirth.

## Phase 1 Completion

```text
Status: Completed
```

Phase 1 core sales flow is now implemented and manually tested:

```text
Product
-> ProductVariant
-> Warehouse
-> Stock
-> Customer
-> Order
-> OrderDetail
-> Payment
-> InventoryTransaction
```

Customer endpoints implemented:

```http
POST  /api/customers
GET   /api/customers/{customerId}
GET   /api/customers?keyword=nguyen&pageNumber=1&pageSize=10
PATCH /api/customers/{customerId}
```

Phase 1 Customer scope:

- Keep Customer simple.
- Do not implement authentication yet.
- Do not implement full User management yet unless needed.
- Customer create uses an existing UserId.
- Customer update should update customer profile fields only.

Important Customer/User note:

```text
User = login/account identity.
Customer = buyer profile used by orders.
```

For Phase 1, Customer is mainly needed so Order can reference a real `customerId`.

## Phase 1 Final Notes

What is intentionally not included in Phase 1:

- Authentication/register/login.
- Full User management.
- Brands/categories/images.
- Shipment/return/refund.
- Promotions/coupons.
- Supplier/purchase order.
- Full ecommerce checkout flow.
- Reserved stock workflow.
- Automated tests.

Recommended next steps after Phase 1:

1. Clean up naming/typos and unused helpers.
2. Standardize response messages and exception codes.
3. Add automated tests for OrderService and stock edge cases.
4. Start Phase 2 with authentication/register or frontend React integration.

## Phase 2 - Auth Basic Progress

Status:

```text
Auth basic: Completed
Authorization basic: In progress / first pass completed
```

Goal:

Add authentication and authorization on top of Phase 1 backend.

Current auth approach:

- Custom auth using existing `Users` table.
- Password is hashed before saving to database.
- JWT access token is returned after register/login.
- API uses `[Authorize]` to protect authenticated endpoints.
- API uses role-based authorization for admin/staff endpoints.

Important concepts:

```text
Authentication = who are you?
Authorization = what are you allowed to do?
```

Current user model:

```text
User = login/account identity.
Customer = buyer profile used by orders.
```

Register flow:

```text
POST /api/auth/register
-> RegisterRequest
-> AuthController maps to RegisterDto
-> AuthService validates email/password/profile data
-> AuthService checks email duplicate
-> AuthService creates User with Role = Customer and Status = Active
-> PasswordHasherService hashes password
-> AuthService creates Customer linked to User
-> SaveChanges
-> JwtTokenService generates access token
-> AuthResult
-> AuthController maps to AuthResponse
```

Login flow:

```text
POST /api/auth/login
-> LoginRequest
-> AuthController maps to LoginDto
-> AuthService validates email and password presence
-> AuthService finds user by normalized email
-> AuthService checks user status is Active
-> PasswordHasherService verifies password against PasswordHash
-> JwtTokenService generates access token
-> AuthResult
-> AuthController maps to AuthResponse
```

Current user flow:

```text
GET /api/auth/me
-> client sends Authorization: Bearer <accessToken>
-> ASP.NET Core validates JWT
-> AuthController reads UserId from token claim
-> AuthService loads User + Customer
-> CurrentUserResult
-> CurrentUserResponse
```

Implemented auth endpoints:

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

Auth endpoint access:

```text
POST /api/auth/register -> AllowAnonymous
POST /api/auth/login    -> AllowAnonymous
GET  /api/auth/me       -> Authorize
```

JWT configuration:

- `JwtSettings` stores Issuer, Audience, SecretKey, AccessTokenMinutes.
- `Program.cs` configures JWT Bearer authentication.
- `UseAuthentication()` must run before `UseAuthorization()`.
- JWT contains user id, email, and role claims.

Password rules:

- Required.
- At least 8 characters.
- Must contain lowercase letter.
- Must contain uppercase letter.
- Must contain digit.
- Must contain special character.

Login password validation note:

```text
Register validates password strength.
Login only checks password is present, then verifies it against PasswordHash.
```

Reason:

Login checks an existing password. Password strength policy should be applied when creating or changing a password, not when logging in.

Role constants:

File:

```text
BadmintonStores.Application/Common/Security/RoleNames.cs
```

Roles:

```text
Admin
Staff
Customer
```

Common role groups:

```text
AdminOrStaff
AdminOrStaffOrCustomer
```

Role claim note:

JWT currently uses:

```csharp
user.Role.ToString()
```

So role names in `[Authorize(Roles = "...")]` must use:

```text
Admin
Staff
Customer
```

not lowercase values.

## Phase 2 - Authorization First Pass

Current authorization rule:

```text
Admin/Staff = internal system management.
Customer = authenticated buyer, currently only /api/auth/me is enabled.
```

Controller authorization plan applied:

```text
AuthController
- register: AllowAnonymous
- login: AllowAnonymous
- me: Authorize

WarehousesController
- all endpoints: Admin/Staff

StocksController
- all endpoints: Admin/Staff

CustomersController
- all endpoints: Admin/Staff

ProductsController
- GET list/detail: public
- POST/PATCH/status: Admin/Staff

ProductVariantsController
- GET list/detail/list by product: public
- POST/PATCH/status: Admin/Staff

OrdersController
- all endpoints: Admin/Staff for now
```

Important order authorization note:

Do not open `POST /api/orders` to Customer yet.

Reason:

Current create order request still accepts `customerId` from client. If a Customer can call it, they could send another customer's id.

Safer future design:

```text
Customer creates order:
-> backend reads UserId from JWT
-> backend finds Customer by UserId
-> backend uses that CustomerId
```

Admin/Staff can still create order for a selected customer.

## Phase 2 Manual Test Status

Auth tests passed:

- Register success.
- Register duplicate email.
- Register weak password.
- Register invalid email.
- Register invalid gender.
- Login success.
- Login wrong password.
- Login missing/invalid email.
- Login non-existing email returns generic INVALID_EMAIL_OR_PASSWORD.
- GET /api/auth/me without token returns 401.
- GET /api/auth/me with invalid token returns 401.
- GET /api/auth/me with valid token returns current user.

Authorization tests passed:

- Public product GET endpoints work without token.
- Protected endpoints without token return 401.
- Protected Admin/Staff endpoints with Customer token return 403.
- Protected Admin/Staff endpoints with Admin/Staff token return 200.

Testing reminder:

```text
After changing User.Role in database, login again.
```

Reason:

Role is stored inside JWT at login time. Old tokens do not automatically update when database role changes.

## Phase 2 - Refresh Token And Logout

Status:

```text
Completed
```

Purpose:

- Access token should be short-lived.
- Refresh token lets the client get a new access token without logging in again.
- Logout should revoke refresh token.

Recommended design:

```text
Access token:
- JWT
- short-lived
- returned in response body

Refresh token:
- random secure string
- store only hash in database
- send to browser as HttpOnly cookie
- can be revoked on logout
```

Implemented table:

```text
RefreshTokens
```

Fields:

- Id
- UserId
- TokenHash
- ExpiresAt
- RevokedAt
- CreatedAt
- CreatedByIp
- RevokedByIp
- ReplacedByTokenHash

Implemented endpoints:

```http
POST /api/auth/refresh
POST /api/auth/logout
```

Current full auth endpoints:

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
```

Refresh token implementation files:

```text
BadmintonStores.Domain/Entities/RefreshToken.cs
BadmintonStores.Infrastructure/Configurations/RefreshTokenConfiguration.cs
BadmintonStores.Application/Interfaces/IRefreshTokenService.cs
BadmintonStores.Infrastructure/Services/RefreshTokenService.cs
```

Refresh token DTOs:

```text
RefreshTokenResult
RefreshTokenRotationResult
```

Refresh token service responsibilities:

```text
CreateRefreshTokenAsync
-> generate secure random token
-> hash token using SHA256
-> store TokenHash in database
-> return raw token to controller so it can be set as cookie

RotateRefreshTokenAsync
-> read refresh token from cookie
-> hash it
-> find token record by TokenHash
-> check token exists, not revoked, not expired
-> check user is active
-> revoke old token
-> create replacement token
-> return user + new raw refresh token

RevokeRefreshTokenAsync
-> hash refresh token
-> find token record
-> set RevokedAt and RevokedByIp
```

Register/login refresh-token flow:

```text
POST /api/auth/register or POST /api/auth/login
-> AuthService creates access token
-> AuthService creates refresh token record
-> AuthController sets refreshToken HttpOnly cookie
-> response body returns accessToken only
```

Refresh flow:

```text
POST /api/auth/refresh
-> AuthController reads refreshToken cookie
-> AuthService calls RefreshTokenService.RotateRefreshTokenAsync
-> old refresh token is revoked
-> new refresh token is stored
-> new refresh token is set to cookie
-> new accessToken is returned in response body
```

Logout flow:

```text
POST /api/auth/logout
-> AuthController reads refreshToken cookie
-> AuthService calls RefreshTokenService.RevokeRefreshTokenAsync
-> refresh token is revoked in database
-> AuthController deletes refreshToken cookie
```

Important behavior:

```text
Logout does not immediately kill an already-issued access token.
```

Reason:

JWT access tokens are stateless. The current access token can still work until it expires. Logout revokes the refresh token so the client cannot get a new access token.

Cookie configuration for local development:

```csharp
HttpOnly = true
Secure = false
SameSite = SameSiteMode.Lax
```

Production note:

```text
Use HTTPS and set Secure = true.
```

Migration note:

Initial refresh token migration accidentally created `InvokedAt`. A follow-up migration renamed it to `RevokedAt`.

Correct meaning:

```text
RevokedAt = when the refresh token was revoked due to logout or token rotation.
```

Manual refresh/logout tests:

- Login creates refreshToken cookie.
- Login/Register response body does not expose refreshToken.
- Database stores TokenHash, not the raw refresh token.
- POST /api/auth/refresh returns a new accessToken.
- Refresh rotates token:
  - old token has RevokedAt != NULL
  - old token has ReplacedByTokenHash != NULL
  - new token has RevokedAt = NULL
- POST /api/auth/logout revokes current refresh token.
- Logout deletes refreshToken cookie.
- Refresh after logout fails because cookie is gone or token is revoked.

## Frontend Planning Notes

Recommended frontend direction:

```text
Build the UI yourself in React first.
Use Figma/Stitch only for layout inspiration, not as the source of truth.
```

Reason:

The main learning goal is understanding the end-to-end flow:

```text
React UI
-> API client
-> ASP.NET Core endpoint
-> Service
-> EF Core
-> SQL Server
```

Frontend scope should start small:

```text
1. Login page
2. Register page
3. Admin layout
4. Product list
5. Product create/update form
6. Warehouse/stock screens
7. Order create screen
8. Order list/detail screen
```

Recommended first frontend milestone:

```text
Login/Register + Auth state + /api/auth/me
```

Frontend auth behavior:

```text
Login/Register response returns accessToken.
Refresh token is stored automatically by browser cookie.
React should not read refreshToken.
React stores accessToken in memory first.
When accessToken expires, call POST /api/auth/refresh.
Logout calls POST /api/auth/logout and clears accessToken in React.
```

Recommended frontend API client:

```text
Use axios or fetch wrapper.
Always centralize API calls in one client module.
Enable credentials/cookies when calling refresh/logout.
```

If using axios:

```text
withCredentials: true
```

Initial UI style recommendation:

```text
Admin dashboard style.
Quiet, practical, data-focused.
Avoid landing-page style.
Use tables, filters, forms, drawers/modals where needed.
```

## Frontend Auth UI Direction

Important product direction:

```text
BadmintonStores is both a customer-facing store and an internal management system.
```

So the authentication UI should not sound like it is only for store managers.

Avoid overly admin-only copy:

```text
He thong quan ly
Quan ly ban hang, don hang va ton kho
Tiep tuc quan ly cua hang
```

Reason:

- Customer users want to shop, track orders, and manage their own account.
- Staff/Admin users want to manage products, stock, customers, and orders.
- Login/Register is a shared entry point, so the tone should fit both groups.

Recommended auth page positioning:

```text
BadmintonStores
Trang bi tot hon cho tung tran dau.
```

Suggested hero title:

```text
San sang cho tran dau tiep theo
```

Suggested hero subtitle:

```text
Kham pha san pham cau long, dat hang nhanh va theo doi moi don mua trong mot noi.
```

Suggested login description:

```text
Tiep tuc mua sam, theo doi don hang hoac quan ly cua hang cua ban.
```

Suggested register description:

```text
Tao tai khoan de mua hang, luu thong tin va theo doi don hang de dang hon.
```

Future role-based redirect idea:

```text
Customer login -> storefront / account area
Staff/Admin login -> admin dashboard
```

Frontend information architecture should eventually split into two surfaces:

```text
Public storefront:
- View products
- Register/Login
- Create order
- My orders
- My profile

Admin dashboard:
- Manage products
- Manage product variants
- Manage warehouses
- Manage stocks
- Manage customers
- Manage orders
```

Future optional endpoints:

```http
POST /api/auth/change-password
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

## Frontend Auth Implementation Progress

Status:

```text
React auth UI: In progress
Login/Register pages: implemented visually
Auth API integration: implemented first pass
AuthContext/ProtectedRoute/Dashboard test page: implemented
Current frontend build: failing because ApiResponse.data is optional
```

Frontend stack:

```text
React
TypeScript
Tailwind CSS
shadcn/ui
react-hook-form
Zod
axios
react-router-dom
```

Current frontend project:

```text
BadmintonStores.Web
```

Current auth UI files:

```text
src/features/auth/components/AuthShell.tsx
src/features/auth/components/PasswordInput.tsx
src/features/auth/context/AuthContext.tsx
src/features/auth/hooks/useAuth.ts
src/features/auth/pages/LoginPage.tsx
src/features/auth/pages/RegisterPage.tsx
src/features/auth/pages/DashboardPage.tsx
src/features/auth/schemas/auth.schema.ts
src/features/auth/services/auth.service.ts
src/features/auth/types/auth.types.ts
src/app/ProtectRoute.tsx
src/app/router.tsx
src/lib/api.ts
src/components/ui/form.tsx
```

Current auth UI behavior:

- Login page has email/password form.
- Register page has full name/email/phone/password/confirm password form.
- Password input supports show/hide password.
- Forms use `react-hook-form`.
- Validation uses `zodResolver`.
- Login/Register now call the real backend through AuthContext and auth.service.
- UI uses shadcn components such as Button, Input, Form, Alert, Checkbox.
- Auth pages use a shared `AuthShell`.
- AuthShell uses a badminton/sports background image instead of a plain gradient.
- Login success redirects to `/dashboard`.
- Dashboard is currently a temporary auth test page.
- Logout calls the backend, clears frontend auth state, and redirects to `/login`.

Frontend auth validation rules:

```text
Login:
- email required and valid
- password required

Register:
- fullName required
- email required and valid
- password must be strong
- confirmPassword must match password
```

Frontend auth architecture implemented:

```text
AuthContext
-> keeps user/accessToken/auth state
-> exposes login/register/logout
-> bootstraps session by calling /api/auth/refresh

api.ts
-> central axios client
-> baseURL from VITE_API_BASE_URL
-> withCredentials: true for refresh token cookie
-> setAccessToken sets Authorization Bearer header

ProtectedRoute
-> blocks routes that require authentication

DashboardPage temporary
-> used to test login/logout/me before building real storefront/admin layout
```

Current frontend auth flow:

```text
LoginPage/RegisterPage
-> react-hook-form controls form state
-> Zod validates input
-> useAuth() gets functions from AuthContext
-> AuthContext calls auth.service
-> auth.service calls Axios api client
-> backend returns accessToken + user and sets refreshToken cookie
-> AuthContext stores user/accessToken in memory
-> api.ts sets the Bearer Authorization header
-> router redirects to the protected dashboard
```

Reload/bootstrap flow:

```text
Browser reload clears React memory
-> HttpOnly refreshToken cookie remains
-> AuthProvider useEffect calls POST /api/auth/refresh
-> backend rotates refresh token and returns a new access token
-> AuthContext restores user/accessToken
-> ProtectedRoute allows or rejects access
```

Logout flow:

```text
Dashboard calls useAuth().logout()
-> AuthContext calls auth.service.logout()
-> backend revokes refresh token and deletes cookie
-> AuthContext clears user/accessToken and Axios Authorization header
-> router redirects to /login
```

## Frontend Auth Current Fix List

1. `ApiResponse<T>` currently declares optional data:

```ts
data?: T
```

This makes service results `AuthResponse | undefined` and causes TypeScript build errors in AuthContext.

For current success responses, use:

```ts
data: T
```

2. `getMe()` currently points to the wrong endpoint:

```text
Wrong: /api/customers/me
Correct: /api/auth/me
```

3. `AuthUser.customerId` should be nullable:

```ts
customerId: number | null
```

Admin/Staff users may not have a Customer profile.

4. Register currently calls `applyAuth(result)` but redirects to `/login`.

The backend already returns tokens and logs the new account in, so the consistent redirect is:

```text
/dashboard
```

Alternatively, change the backend register contract so it does not issue tokens. For the current implementation, redirecting to dashboard is simpler.

5. File naming is currently `ProtectRoute.tsx` while the component is `ProtectedRoute`. Rename to `ProtectedRoute.tsx` later for consistency.

6. AuthContext currently refreshes the session when the app boots/reloads. Automatic refresh and retry after an arbitrary API returns 401 still requires an Axios interceptor and has not been implemented yet.

Important FE auth idea:

```text
AuthContext is enough for current auth state.
Redux is not required yet.
```

Reason:

Auth state is small:

```text
user
accessToken
isAuthenticated
isBootstrapping
login/register/logout functions
```

Future data fetching for products/orders/stocks can later use simple services first, then TanStack Query if caching/refetching becomes important.

## Frontend Env Bug Learned

Bug:

Request was sent to:

```text
http://localhost:5173/import.meta.env.VITE_API_BASE_URL/api/auth/register
```

Cause:

`api.ts` used a string literal:

```ts
baseURL: "import.meta.env.VITE_API_BASE_URL"
```

This makes JavaScript treat it as normal text.

Correct code:

```ts
baseURL: import.meta.env.VITE_API_BASE_URL
```

Current `.env`:

```env
VITE_API_BASE_URL=http://localhost:5006
```

After changing `.env`, restart Vite:

```powershell
npm.cmd run dev
```

Endpoint formatting note:

Prefer leading slash in API service:

```ts
"/api/auth/login"
"/api/auth/register"
"/api/auth/refresh"
"/api/auth/logout"
```

Expected request after fix:

```text
http://localhost:5006/api/auth/register
```

## Frontend Auth End-to-End Review

The full authentication flow has now been reviewed end-to-end:

```text
1. User opens /login
2. LoginPage renders form
3. react-hook-form controls input state
4. Zod validates form data
5. Submit calls useAuth().login()
6. AuthContext calls auth.service.login()
7. auth.service uses axios api client
8. Backend AuthController receives request
9. Backend AuthService validates user/password
10. Backend returns accessToken + user and sets refreshToken cookie
11. AuthContext stores user/accessToken
12. api.ts sets Authorization Bearer header
13. Router redirects to /dashboard
14. ProtectedRoute allows authenticated user
15. Reload page triggers AuthProvider bootstrap
16. Bootstrap calls /api/auth/refresh
17. Logout calls /api/auth/logout
18. AuthContext clears auth state and redirects to /login
```

Main learning goal:

```text
Make backend auth and frontend auth feel like one continuous flow instead of many disconnected files.
```

## Frontend Admin Products Module

Completed the Admin Products management interface (`/admin/products`):

- **Service & Types (`admin-product.service.ts`, `product.types.ts`)**:
  - `getProductList`: GET `/api/products` with pagination, keyword search, and status filtering.
  - `getProductById`: GET `/api/products/{id}`.
  - `createProduct`: POST `/api/products`.
  - `updateProduct`: PUT/PATCH `/api/products/{id}`.
  - `updateProductStatus`: PATCH `/api/products/{id}/status`.
- **Components & UI**:
  - `ProductTable.tsx`: Tabular view of products showing code, name, brand, category, price range, status badge, and action buttons.
  - `ProductForm.tsx`: Modal form using React Hook Form + Zod for creating and editing products.
  - `ProductStatusBadge.tsx`: Visual badge indicating active/inactive product status.
  - `AdminProductsPage.tsx`: Main page coordinating state, filtering (`all` / `active` / `inactive`), keyword search, pagination, and navigating to product variants (`/admin/products/{id}/variants`).

## Frontend Admin Product Variants Module

Completed the Admin Product Variants management interface (`/admin/products/:productId/variants`):

- **Service & Types (`product-variant.service.ts`, `product-variant.types.ts`)**:
  - Defined `ProductVariantListItem`, request/response DTOs for create, update, and status toggle.
  - Implemented API calls to `/api/products/{productId}/variants` and `/api/product-variants/{productVariantId}`.
- **Components & UI**:
  - `VariantTable.tsx`: Displays SKU, Color, Size, Weight, Price, Status, and action buttons (Edit, Toggle Status).
  - `VariantForm.tsx`: React Hook Form + Zod form supporting create mode (with SKU) and update mode.
  - `VariantStatusBadge.tsx`: Displays badge statuses as **"Đang hoạt động"** (`active`) and **"Ngừng hoạt động"** (`inactive`).
  - `AdminProductVariantPage.tsx`: Manages list state by `productId`, keyword search (SKU, color, size), status filter, pagination, and back navigation to the Products list.

## Product Variant Pricing & Validation Alignment

Resolved HTTP 400 Bad Request errors when creating or updating product variants by aligning frontend semantics and backend validation rules:

1. **Pricing Domain Rules**:
   - `Price`: Regular retail selling price (**Giá bán** / giá niêm yết).
   - `SalePrice`: Promotional / discounted selling price (**Giá khuyến mãi**).
   - Rule: `SalePrice` is optional and must satisfy `SalePrice <= Price`.
2. **UI Form Alignment (`VariantForm.tsx`)**:
   - Updated form field labels to clearly communicate business meaning to users:
     - `price` field label -> **"Giá bán"**
     - `salePrice` field label -> **"Giá khuyến mãi"**
3. **Backend Validation Alignment (`ProductVariantService.cs`)**:
   - Updated validation messages in both `ValidateRequest` and `ValidateUpdateRequest` methods:
     - When `request.SalePrice.Value > request.Price`, throws `ValidationException("INVALID_SALE_PRICE", "Giá khuyến mãi không được lớn hơn giá bán.")`.
4. **UI/UX Polish**:
   - Styled back navigation button in `AdminProductVariantPage.tsx` with high-contrast black/white hover transitions.
   - Standardized status badges to Vietnamese terminology ("Đang hoạt động" / "Ngừng hoạt động").

