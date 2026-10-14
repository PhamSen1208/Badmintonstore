namespace BadmintonStores.Domain.Enums;

public enum OrderStatus
{
    Pending = 0,    // Đang chờ xử lý (Mới tạo đơn)
    Confirmed = 1,  // Đã xác nhận đơn hàng
    Shipping = 2,   // Đang giao hàng
    Completed = 3,  // Đã hoàn thành (Giao thành công)
    Cancelled = 4   // Đã hủy đơn hàng
}