namespace BadmintonStores.Api.Responses;

public class ErrorResponse
{
    public bool Success {get; set;} = false;
    public ApiError Error {get; set;} = new();
}

public class ApiError
{
    public string Code {get; set;} = string.Empty;
    public string Message {get; set;} = string.Empty;
    public object? Details {get; set;} // Dùng object để linh hoạt chứa thông tin chi tiết lỗi, có thể là một chuỗi hoặc một đối tượng phức tạp tùy vào từng trường hợp lỗi cụ thể.
}