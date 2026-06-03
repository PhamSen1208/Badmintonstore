using BadmintonStores.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using BadmintonStores.Infrastructure.Seed;
using BadmintonStores.Api.Middlewares;
using BadmintonStores.Application.Interfaces;
using BadmintonStores.Infrastructure.Services;
using System.Text;
using BadmintonStores.Application.Common.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddControllers();

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
var jwtSettings = builder.Configuration.GetSection("Jwt").Get<JwtSettings>();

// Kiểm tra cấu hình JWT
if(jwtSettings == null || string.IsNullOrWhiteSpace(jwtSettings.SecretKey))
{
    throw new InvalidOperationException("Chưa thiết lập JWT settings. Vui lòng kiểm tra lại file appsettings.json");
}

// Thiết lập Authentication với JWT Bearer
var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey));
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true, // Xác thực nhà phát hành token
            ValidIssuer = jwtSettings.Issuer,

            ValidateAudience = true, // Xác thực đối tượng nhận token
            ValidAudience = jwtSettings.Audience,

            ValidateIssuerSigningKey = true, // Xác thực khóa ký token
            IssuerSigningKey = signingKey,

            ValidateLifetime = true, // Xác thực thời gian tồn tại của token
            ClockSkew = TimeSpan.Zero
        };
    });
builder.Services.AddAuthorization();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IOrderService, OrderService>(); // Đăng ký OrderService với DI container
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IProductVariantService, ProductVariantService>();
builder.Services.AddScoped<IStockService, StockService>();
builder.Services.AddScoped<IWarehouseService, WarehouseService>();
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPasswordHasherService, PasswordHasherService>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await dbContext.Database.MigrateAsync(); // Tự động áp dụng các migration khi ứng dụng khởi động
    await DbSeeder.SeedAsync(dbContext); // Gọi phương thức seed dữ liệu
}

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionHandlingMiddleware>();

// if (app.Environment.IsDevelopment())
// {
//     app.MapOpenApi();
// }

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

