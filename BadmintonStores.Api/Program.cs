using BadmintonStores.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using BadmintonStores.Infrastructure.Seed;
using BadmintonStores.Api.Middlewares;
using BadmintonStores.Application.Interfaces;
using BadmintonStores.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IOrderService, OrderService>(); // Đăng ký OrderService với DI container
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IProductVariantService, ProductVariantService>();
builder.Services.AddScoped<IStockService, StockService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await dbContext.Database.MigrateAsync(); // Tự động áp dụng các migration khi ứng dụng khởi động
    await DbSeeder.SeedAsync(dbContext); // Gọi phương thức seed dữ liệu
}

// Configure the HTTP reques    t pipeline.
app.UseMiddleware<ExceptionHandlingMiddleware>();

// if (app.Environment.IsDevelopment())
// {
//     app.MapOpenApi();
// }

app.UseHttpsRedirection();
app.MapControllers();

app.Run();

