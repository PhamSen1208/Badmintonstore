// Biến thể sản phẩm (Thông số 3U/4U, Size giày, Màu sắc)
export type ProductVariantOption = {
    id: string;
    label: string; // VD: "3U (85g - 89g)" hoặc "Size 41"
    inStock: boolean;
    priceAdjustment?: number; // Chênh lệch giá nếu có
};

export type ProductVariantGroup = {
    title: string; // VD: "Chọn Trọng Lượng" hoặc "Chọn Size Giày"
    options: ProductVariantOption[];
};

// Thông số kỹ thuật sản phẩm (Điểm cân bằng, độ cứng thân vợt...)
export type ProductSpecification = {
    label: string; // VD: "Điểm cân bằng"
    value: string; // VD: "295 ± 2 mm (Hơi nặng đầu)"
};

// DTO Chi tiết Sản phẩm chuẩn dành riêng cho Client
export type ClientProductDetail = {
    productId: number;
    productCode: string;
    productName: string;
    basePrice: number;
    description: string | null;
    warranty: string | null;
    status: string;
    categoryId?: number | null;
    categoryName?: string | null;
    brandId?: number | null;
    brandName?: string | null;
    stockQuantity: number;
    images: string[];
    variantGroups?: ProductVariantGroup[];
    specifications?: ProductSpecification[];
};
