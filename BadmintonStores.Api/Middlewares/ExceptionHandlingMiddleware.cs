using System.Net;
using System.Text.Json;
using BadmintonStores.Api.Responses;
using BadmintonStores.Application.Common.Exceptions;

namespace BadmintonStores.Api.Middlewares;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next; // Middleware tiếp theo trong pipeline

    public ExceptionHandlingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    //HttpContext context: Chứa toàn bộ thông tin về yêu cầu HTTP hiện tại, bao gồm đường dẫn, phương thức, tiêu đề, v.v.
    public async Task InvokeAsync(HttpContext context) // Phương thức xử lý yêu cầu HTTP
    {
        try
        {
            await _next(context); //Gọi middleware tiếp theo 
        }
        catch (ValidationException ex)
        {
            await WriteErrorResponseAsync(
                context,
                HttpStatusCode.BadRequest,
                ex.Code,
                ex.Message,
                null);
        }
        catch(NotFoundException ex)
        {
            await WriteErrorResponseAsync(
                context,
                HttpStatusCode.NotFound,
                ex.Code,
                ex.Message,
                null);
        }    
        catch(InsufficientStockException ex)
        {
            await WriteErrorResponseAsync(
                context,
                HttpStatusCode.Conflict,
                ex.Code,
                ex.Message,
                ex.Details);
        }
        catch (Exception) // Bắt tất cả các lỗi không được xử lý ở trên
        {
            await WriteErrorResponseAsync(
                context,
                HttpStatusCode.InternalServerError,
                "INTERNAL_SERVER_ERROR",
                "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.",
                null);
        }
    }

    private static async Task WriteErrorResponseAsync(HttpContext context, HttpStatusCode statusCode, string code, string message, object? details)
    {
        context.Response.StatusCode = (int)statusCode; //Đổi sang mã HTTP 
        context.Response.ContentType = "application/json"; // Đặt loại nội dung trả về là JSON

        var response = new ErrorResponse
        {
            Success = false,
            Error = new ApiError
            {
                Code = code,
                Message = message,
                Details = details
            }
        };

        // Chuyển đối tượng ErrorResponse thành chuỗi JSON để gửi về phía client    
        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase, // Sử dụng camelCase cho tên thuộc tính trong JSON
            WriteIndented = true // Định dạng JSON đẹp hơn
        });
        await context.Response.WriteAsync(json); // Gửi chuỗi JSON về phía client
    }
}