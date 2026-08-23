export function SkeletonProductCard() 
{
    return (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 space-y-2 shadow-sm animate-pulse">
             {/* Aspect Square hình ảnh giả */}
            <div className="aspect-square w-full rounded-lg bg-slate-200/70"></div>
             {/* Nhãn Thương hiệu giả */}
            <div className="h-3 w-1/4 rounded-lg bg-slate-200/70"></div>
            {/* Tên sản phẩm giả */}
            <div className="space-y-1.5 pt-1">
                <div className="h-4 w-full rounded-lg bg-slate-200/70"></div>
                <div className="h-3 w-2/3 rounded-lg bg-slate-200/70"></div>
            </div>
            {/*Giá cả */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="h-5 w-24 rounded bg-slate-200/70" />
                <div className="h-8 w-20 rounded-lg bg-slate-200/70" />
            </div>
        </div>
    );
}
// Render lưới danh sách N phần tử
export function SkeletonProductGrid({count = 8}: {count?: number}) 
{
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonProductCard key={index} />
            ))}
        </div>
    )
}