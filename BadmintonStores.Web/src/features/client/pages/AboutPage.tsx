import { Link } from "react-router-dom";
import { 
    ShieldCheck, Award, Zap, Truck, ChevronRight, 
    ArrowRight, MapPin, HeartHandshake, Sparkles, Target
} from "lucide-react";
import lcw from "../../../assets/leechongweiwpp.jpg";
import cauchuyenthuonghieu from "../../../assets/cauchuyenthuonghieu.jpg";
import doingutuvan from "../../../assets/doingutuvan.jpg";
import votmoi from "../../../assets/quaybanvot.jpg";
import cangvot from "../../../assets/cangvot.jpg";

export function AboutPage() {
    return (
        <div className="w-full space-y-16 pb-20">
            {/* 1. HERO BANNER THƯƠNG HIỆU */}
            <div className="w-full relative overflow-hidden shadow-xl bg-slate-950 text-white py-16 sm:py-24 border-b border-slate-800">
                {/* Ảnh nền Lee Chong Wei Wallpaper */}
                <img
                    src={lcw}
                    alt="Lee Chong Wei Wallpaper"
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-35 scale-105"
                />

                {/* Lớp phủ Gradient Tối làm dịu nền và tôn chữ */}
                <div className="absolute inset-0 bg-linear-0-to-r from-slate-950 via-slate-950/85 to-slate-900/60" />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent" />
                
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                        <Sparkles className="h-4 w-4" /> Thương hiệu cầu lông chính hãng uy tín
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight max-w-4xl mx-auto">
                        Nâng Tầm Đam Mê Cầu Lông Cùng <span className="text-orange-500">Badminton Stores</span>
                    </h1>

                    <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
                        Hệ thống phân phối dụng cụ cầu lông chính hãng hàng đầu Việt Nam. Nơi đồng hành tin cậy của hàng nghìn lông thủ phong trào và vận động viên chuyên nghiệp trên khắp cả nước.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                        <Link
                            to="/products"
                            className="px-8 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-500/30 flex items-center gap-2"
                        >
                            Khám phá sản phẩm <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            to="/stores"
                            className="px-8 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                        >
                            <MapPin className="h-4 w-4 text-orange-400" /> Hệ thống cửa hàng
                        </Link>
                    </div>
                </div>
            </div>
        
            {/* BREADCRUMB */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Link to="/" className="hover:text-orange-500">Trang chủ</Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="font-semibold text-slate-800">Giới thiệu về chúng tôi</span>
                </div>
            </div>

            {/* 2. THỐNG KÊ CON SỐ NỔI BẬT (Stats Bar) */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
                    <div className="text-center space-y-1">
                        <span className="text-3xl sm:text-4xl font-black text-orange-500 block">10+</span>
                        <span className="text-xs font-bold text-slate-700 uppercase">Showroom Toàn Quốc</span>
                    </div>
                    <div className="text-center space-y-1">
                        <span className="text-3xl sm:text-4xl font-black text-orange-500 block">50.000+</span>
                        <span className="text-xs font-bold text-slate-700 uppercase">Khách Hàng Tin Dùng</span>
                    </div>
                    <div className="text-center space-y-1">
                        <span className="text-3xl sm:text-4xl font-black text-orange-500 block">100%</span>
                        <span className="text-xs font-bold text-slate-700 uppercase">Hàng Chính Hãng Cam Kết</span>
                    </div>
                    <div className="text-center space-y-1">
                        <span className="text-3xl sm:text-4xl font-black text-orange-500 block">24/7</span>
                        <span className="text-xs font-bold text-slate-700 uppercase">Tư Vấn & Hỗ Trợ Đam Mê</span>
                    </div>
                </div>
            </div>

            {/* 3. CÂU CHUYỆN THƯƠNG HIỆU (Our Story) */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Ảnh minh họa bên trái */}
                    <div className="lg:col-span-6 relative">
                        <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl group">
                            <img
                                src={cauchuyenthuonghieu}
                                alt="Cửa hàng Badminton Stores"
                                className="w-full h-96 sm:h-112 object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent flex items-end pb-12 pl-5">
                                <div className="space-y-2 text-white">
                                    <span className="text-xs font-bold text-orange-400 uppercase tracking-widest block">Thành lập từ 2018</span>
                                    <p className="text-sm font-bold ">Luôn tin tưởng và đồng hành cùng bạn!</p> 
                                </div>
                            </div>
                        </div>

                        {/* Badge góc */}
                        <div className="absolute -bottom-6 -right-4 bg-orange-500 text-white p-3 rounded-2xl shadow-xl items-center gap-2 hidden sm:flex">
                            <Award className="h-7 w-7 text-amber-200" />
                            <div>
                                <span className="text-xs font-bold uppercase block">Top 5 Cửa Hàng</span>
                                <span className="text-[11px] opacity-90 font-medium">Được cộng đồng lông thủ yêu thích</span>
                            </div>
                        </div>
                    </div>

                    {/* Nội dung giới thiệu bên phải */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="space-y-2">
                            <span className="text-xs font-bold text-orange-500 uppercase tracking-wider block">
                                CÂU CHUYỆN THƯƠNG HIỆU
                            </span>
                            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                                Khởi Nguồn Từ Niềm Đam Mê Với Trái Cầu Lông
                            </h2>
                        </div>

                        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                            <p>
                                Được thành lập vào năm 2018 bởi những người trẻ đam mê cầu lông nhiệt thành, <strong>Badminton Stores</strong> ra đời với sứ mệnh mang tới cho cộng đồng lông thủ Việt Nam các sản phẩm dụng cụ cầu lông chuẩn chính hãng 100% từ các thương hiệu hàng đầu thế giới như Yonex, Victor, Li-Ning, Mizuno, Kumpoo...
                            </p>
                            <p>
                                Chúng tôi hiểu rằng, mỗi cây vợt, đôi giày hay sợi cước không đơn thuần là thiết bị thi đấu mà còn là người bạn đồng hành truyền cảm hứng trong từng cú đánh. Vì vậy, Badminton Stores không ngừng nâng cao chất lượng dịch vụ: từ công nghệ căng cước máy điện tử chuẩn lbs đến dịch vụ tư vấn kỹ thuật chuyên sâu theo lối đánh riêng của từng khách hàng.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/80 space-y-1">
                                <Target className="h-5 w-5 text-orange-500" />
                                <h4 className="font-bold text-slate-900 text-xs uppercase">Sứ mệnh</h4>
                                <p className="text-[11px] text-slate-600">Phát triển phong trào cầu lông Việt Nam bằng sản phẩm & dịch vụ chuẩn mực.</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                                <HeartHandshake className="h-5 w-5 text-slate-800" />
                                <h4 className="font-bold text-slate-900 text-xs uppercase">Tầm nhìn</h4>
                                <p className="text-[11px] text-slate-600">Trở thành chuỗi cửa hàng cầu lông chính hãng được tin yêu nhất cả nước.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* 4. GIÁ TRỊ CỐT LÕI (4 Trụ cột cam kết) */}
            <div className="w-full bg-slate-50 py-16 border-y border-slate-200">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    
                    <div className="text-center space-y-2 max-w-2xl mx-auto">
                        <span className="text-xs font-bold text-orange-500 uppercase tracking-widest block">CAM KẾT CHẤT LƯỢNG</span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                            4 Giá Trị Cốt Lõi Tại Badminton Stores
                        </h2>
                        <p className="text-xs text-slate-500">
                            Chúng tôi luôn đặt quyền lợi và trải nghiệm của khách hàng làm trung tâm cho mọi hoạt động
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        
                        {/* Trụ cột 1 */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-orange-500/30 transition-all space-y-4 group">
                            <div className="h-12 w-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors shadow-xs">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">100% Chính Hãng</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Cam kết đền bù 200% giá trị nếu phát hiện hàng giả, hàng nhái kém chất lượng.
                            </p>
                        </div>

                        {/* Trụ cột 2 */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-orange-500/30 transition-all space-y-4 group">
                            <div className="h-12 w-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors shadow-xs">
                                <Zap className="h-6 w-6" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">Căng Cước Chuẩn lbs</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Sử dụng máy căng điện tử đĩa quay chính xác tuyệt đối, căng lấy ngay tại cửa hàng.
                            </p>
                        </div>

                        {/* Trụ cột 3 */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-orange-500/30 transition-all space-y-4 group">
                            <div className="h-12 w-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors shadow-xs">
                                <Truck className="h-6 w-6" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">Giao Hàng Siêu Tốc</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Đóng gói cẩn thận, hỗ trợ giao hàng toàn quốc và kiểm tra hàng trước khi thanh toán.
                            </p>
                        </div>

                        {/* Trụ cột 4 */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-orange-500/30 transition-all space-y-4 group">
                            <div className="h-12 w-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors shadow-xs">
                                <Award className="h-6 w-6" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">Bảo Hành Chính Hãng</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Bảo hành chính hãng từ 60 đến 90 ngày với quy trình xử lý minh bạch và chu đáo.
                            </p>
                        </div>

                    </div>

                </div>
            </div>

            {/* 5. KHU VỰC HÌNH ẢNH SHOWROOM & ĐỘI NGŨ CHUYÊN VIÊN */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Hình Ảnh Hệ Thống Cửa Hàng
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">Không gian trải nghiệm hiện đại và trang thiết bị thi đấu cao cấp</p>
                    </div>
                    <Link
                        to="/stores"
                        className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1"
                    >
                        Xem tất cả cơ sở <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="rounded-2xl overflow-hidden shadow-md group">
                        <img
                            src={votmoi}
                            alt="Gian hàng dụng cụ cầu lông"
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="p-3 bg-white text-center text-xs font-bold text-slate-800">
                            Khu vực trưng bày sản phẩm mới
                        </div>
                    </div>

                    <div className="rounded-2xl overflow-hidden shadow-md group">
                        <img
                            src={cangvot}
                            alt="Khu vực máy căng cước điện tử"
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="p-3 bg-white text-center text-xs font-bold text-slate-800">
                            Khu vực căng cước máy điện tử chuẩn thi đấu
                        </div>
                    </div>

                    <div className="rounded-2xl overflow-hidden shadow-md group">
                        <img
                            src={doingutuvan}
                            alt="Đội ngũ chuyên viên tư vấn"
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="p-3 bg-white text-center text-xs font-bold text-slate-800">
                            Đội ngũ kỹ thuật viên tư vấn tận tâm
                        </div>
                    </div>
                </div>
            </div>

            {/* 6. CALL TO ACTION BANNER (CTA) */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-linear-to-r from-orange-500 to-amber-600 text-white p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2 text-center md:text-left">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Sẵn Sàng Chọn Vợt Ứng Ý Ngay Hôm Nay?</h2>
                        <p className="text-xs sm:text-sm text-orange-100 font-medium">
                            Khám phá ngay bộ sưu tập vợt, giày và phụ kiện cầu lông chính hãng mới nhất 2026!
                        </p>
                    </div>

                    <div className="flex gap-3 shrink-0">
                        <Link
                            to="/products"
                            className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
                        >
                            Xem sản phẩm ngay
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    );
}
