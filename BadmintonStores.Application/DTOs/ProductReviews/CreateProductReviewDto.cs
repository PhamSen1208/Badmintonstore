using System.ComponentModel.DataAnnotations;

namespace BadmintonStores.Application.DTOs.ProductReviews;

public class CreateProductReviewDto
{
    [Required]
    public int ProductId { get; set; }

    public int? OrderId { get; set; }

    [Range(1, 5, ErrorMessage = "Số sao đánh giá từ 1 đến 5")]
    public int Rating { get; set; }

    [MaxLength(1000, ErrorMessage = "Nội dung nhận xét tối đa 1000 ký tự")]
    public string Comment { get; set; } = string.Empty;
}
