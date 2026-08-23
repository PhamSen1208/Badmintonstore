/**
 * Định dạng số tiền theo chuẩn Việt Nam (VND).
 * Sử dụng chung cho toàn bộ ứng dụng.
 */
export const currencyFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
});
