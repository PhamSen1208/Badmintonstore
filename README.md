# 🏸 BadmintonStores - Hệ thống E-Commerce & Quản lý Cửa hàng Cầu lông

Hệ thống ứng dụng Web bán hàng và quản lý cửa hàng dụng cụ cầu lông toàn diện, xây dựng trên nền tảng **.NET 10 API** kết hợp **React TypeScript (Vite + Tailwind CSS)**.

---

## 🛠️ Công nghệ Sử dụng

- **Backend**: .NET 10 Web API, Entity Framework Core, SQL Server / SQLite, Clean Architecture.
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Sonner Toast, Recharts / Custom CSS Charts.
- **Security & Auth**: JWT Authentication, Role-based Authorization (`Admin`, `Staff`, `Customer`).

---

## ✨ Tính năng Nổi bật

### 📊 1. Báo cáo & Thống kê (Admin Dashboard)
- Biểu đồ doanh thu tương tác 12 tháng năm hiện tại với khả năng **Drill-down**:
  - Tháng $\rightarrow$ Tuần $\rightarrow$ Ngày.
- Chọn xem báo cáo theo Năm.
- Thống kê KPI: Doanh thu, Đơn hàng, Top sản phẩm bán chạy, Cảnh báo tồn kho thấp.

### 🎟️ 2. Quản lý Mã giảm giá (Coupons)
- Quản lý danh sách coupon, tìm kiếm & lọc trạng thái.
- Tạo mã khuyến mãi dạng `%` hoặc tiền cố định (`VNĐ`), thiết lập đơn tối thiểu, hạn mức giảm tối đa, tổng lượt phát hành.
- Thao tác Bật/Tắt nhanh trạng thái ngay trên bảng.
- Áp dụng mã giảm giá trực tiếp tại trang Checkout phía Khách hàng.

### 📦 3. Quản lý Đơn hàng (Orders & Workflow)
- Vòng đời đơn hàng 5 trạng thái: `Pending` (Chờ xử lý) $\rightarrow$ `Confirmed` (Đã xác nhận) $\rightarrow$ `Shipping` (Đang giao) $\rightarrow$ `Completed` (Hoàn thành) / `Cancelled` (Đã hủy).
- Trạng thái thanh toán: `Unpaid` (Chưa thanh toán), `Paid` (Đã thanh toán), `Refunded` (Đã hoàn tiền).
- Tự động cộng hoàn tồn kho & ghi log `InventoryTransaction` khi hủy đơn hàng.
- Tự động xác nhận `Paid` khi đơn hoàn thành `Completed`.

### 🛍️ 4. Khách hàng & Cửa hàng (Client Storefront)
- Danh mục sản phẩm, bộ lọc tìm kiếm theo Thương hiệu, Giá, Danh mục.
- Chi tiết sản phẩm & biến thể (Size, Màu sắc).
- Giỏ hàng (Cart), Đặt hàng (Checkout) & Lịch sử đơn hàng (My Orders).

---

## 🚀 Hướng dẫn Chạy Ứng dụng

### 1. Khởi chạy Backend (.NET 10 API)
```bash
dotnet run --project .\BadmintonStores.Api
# API lắng nghe tại: http://localhost:5006
```

### 2. Khởi chạy Frontend (React TS)
```bash
cd BadmintonStores.Web
npm install
npm run dev
# Web app lắng nghe tại: http://localhost:5173
```
