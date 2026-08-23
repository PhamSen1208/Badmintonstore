import { useState } from "react";
import { Link } from "react-router-dom";
import { 
    Briefcase, MapPin, DollarSign, Clock, ChevronRight, 
    Sparkles, HeartHandshake, Award, Users, X, Send
} from "lucide-react";
import { toast } from "sonner";
import lindan from "../../../assets/lindanwpp.jpg";
import thunhap from "../../../assets/thunhap.jpg";
import vanhoacaulong from "../../../assets/vanhoacaulong.jpg";
import thangtien from "../../../assets/thangtien.jpg";
import daingo from "../../../assets/bonus.jpg";


export type JobPosition = {
    id: string;
    title: string;
    location: string;
    type: string;
    salary: string;
    deadline: string;
    description: string[];
    requirements: string[];
    benefits: string[];
};

const jobListings: JobPosition[] = [
    {
        id: "job-1",
        title: "Nhân Viên Tư Vấn Bán Hàng Showroom",
        location: "Hà Nội / TP. Hồ Chí Minh",
        type: "Toàn thời gian (Xoay ca)",
        salary: "8.000.000 ₫ - 15.000.000 ₫ / tháng",
        deadline: "30/09/2026",
        description: [
            "Đón tiếp, tư vấn các dòng vợt, giày và phụ kiện cầu lông phù hợp với từng lối đánh của khách hàng.",
            "Quản lý, trưng bày hàng hóa đẹp mắt tại Showroom.",
            "Hỗ trợ kiểm kê hàng hóa và thực hiện các giao dịch bán hàng trên hệ thống POS."
        ],
        requirements: [
            "Đam mê hoặc biết chơi cầu lông là một lợi thế lớn.",
            "Nhanh nhẹn, trung thực, giao tiếp tốt và có tinh thần trách nhiệm.",
            "Độ tuổi từ 18 - 28 tuổi."
        ],
        benefits: [
            "Lương cứng + Thưởng hoa hồng doanh số theo tháng.",
            "Được mua sản phẩm cầu lông chính hãng với giá ưu đãi nội bộ.",
            "Miễn phí căng cước vợt định kỳ khi tham gia đánh cầu cùng công ty."
        ]
    },
    {
        id: "job-2",
        title: "Kỹ Thuật Viên Căng Cước Vợt Cầu Lông",
        location: "Hà Nội (Cầu Giấy / Đống Đa)",
        type: "Toàn thời gian/ Partime",
        salary: "10.000.000 ₫ - 18.000.000 ₫ / tháng",
        deadline: "30/09/2026",
        description: [
            "Vận hành máy căng cước điện tử chính xác theo đúng số lbs/kg khách yêu cầu.",
            "Tư vấn chủng loại cước (Yonex BG65, BG80, Aerobite...) phù hợp cho từng loại vợt.",
            "Bảo dưỡng, vệ sinh và dán gen bảo vệ khung vợt cho khách hàng."
        ],
        requirements: [
            "Có kinh nghiệm căng cước từ 6 tháng trở lên (chưa biết sẽ được đào tạo thêm).",
            "Cẩn thận, tỉ mỉ, có trách nhiệm cao với sản phẩm của khách.",
            "Chịu được áp lực công việc giờ cao điểm."
        ],
        benefits: [
            "Lương theo tay nghề + Thưởng trên từng cây vợt căng thành công.",
            "Môi trường làm việc năng động, tiếp xúc máy móc căng cước hiện đại bậc nhất."
        ]
    },
    {
        id: "job-3",
        title: "Digital Marketing / Content Creator (Tiktok & Youtube)",
        location: "Hà Nội (Trần Thái Tông)",
        type: "Toàn thời gian",
        salary: "12.000.000 ₫ - 20.000.000 ₫ / tháng",
        deadline: "25/09/2026",
        description: [
            "Sáng tạo nội dung video ngắn (Tiktok / Shorts) review vợt, giày cầu lông mới ra mắt.",
            "Xây dựng kịch bản truyền thông và lên sóng hình ảnh chuỗi Showroom.",
            "Theo dõi hiệu quả chiến dịch và tương tác với cộng đồng lông thủ."
        ],
        requirements: [
            "Có khả năng quay chụp, lên sóng tự tin trước ống kính.",
            "Am hiểu về xu hướng Tiktok, Reels và đam mê thể thao.",
            "Biết sử dụng phần mềm chỉnh sửa video cơ bản (CapCut, Premiere...)."
        ],
        benefits: [
            "Thưởng doanh số kênh + Phụ cấp thiết bị quay chụp.",
            "Thường xuyên tham gia các sự kiện trải nghiệm sản phẩm mới của Yonex, Li-Ning."
        ]
    }
];

export function RecruitmentPage() {
    const [selectedJob, setSelectedJob] = useState<JobPosition | null>(null);
    const [applyForm, setApplyForm] = useState({
        fullName: "",
        phone: "",
        email: "",
        note: "",
    });

    function handleSendApply(e: React.FormEvent) {
        e.preventDefault();
        if (!applyForm.fullName || !applyForm.phone) {
            toast.error("Vui lòng nhập đầy đủ Họ tên và Số điện thoại!");
            return;
        }

        toast.success(`Ứng tuyển vị trí "${selectedJob?.title}" thành công! Bộ phận Tuyển dụng sẽ liên hệ bạn sớm.`);
        setSelectedJob(null);
        setApplyForm({ fullName: "", phone: "", email: "", note: "" });
    }

    return (
        <div className="w-full space-y-12 pb-16">
            {/* 1. HERO BANNER */}
            <div className="w-full relative overflow-hidden shadow-xl bg-slate-950 text-white py-16 sm:py-24 border-b border-slate-800">
                {/* Ảnh nền Lin Dan Wallpaper */}
                <img
                    src={lindan}
                    alt="Lin Dan Wallpaper"
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-35 scale-105"
                />

                {/* Lớp phủ linear tối làm dịu nền và tôn chữ */}
                <div className="absolute inset-0 bg-linear-0-to-r from-slate-950 via-slate-950/85 to-slate-900/60" />   
                <div className="absolute inset-0 bg-linear-0-to-t from-slate-950 via-transparent to-transparent" />

                {/* Nội dung chữ Banner */}
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10 text-center sm:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                        <Sparkles className="h-4 w-4" /> Cơ hội nghề nghiệp hấp dẫn 2026
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight max-w-3xl">
                        Gia Nhập Đội Ngũ <span className="text-orange-500">Badminton Stores</span>
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium leading-relaxed">
                        Cùng chúng tôi lan tỏa niềm đam mê cầu lông, mang lại những sản phẩm & dịch vụ chất lượng nhất tới hàng triệu lông thủ Việt Nam!
                    </p>
                </div>
            </div>

            {/* BREADCRUMB */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Link to="/" className="hover:text-orange-500">Trang chủ</Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="font-semibold text-slate-800">Tuyển dụng</span>
                </div>
            </div>

            {/* 2. QUYỀN LỢI KHI LÀM VIỆC TẠI BADMINTON STORES */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="text-center space-y-2 max-w-2xl mx-auto">
                    <span className="text-xs font-bold text-orange-500 uppercase tracking-widest block">TẠI SAO CHỌN CHÚNG TÔI?</span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                        Quyền Lợi & Môi Trường Làm Việc
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* Thẻ 1: Thu Nhập Hấp Dẫn */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden space-y-4 group">
                        <div className="h-44 w-full overflow-hidden relative">
                            <img
                                src={thunhap}
                                alt="Thu Nhập Hấp Dẫn"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-4">
                                <span className="px-3 py-1 bg-orange-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md">
                                    <DollarSign className="h-3.5 w-3.5" /> Lương & Thưởng
                                </span>
                            </div>
                        </div>
                        <div className="p-6 pt-0 space-y-2">
                            <h3 className="font-bold text-slate-900 text-base">Thu Nhập Hấp Dẫn</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Lương cứng cạnh tranh + Thưởng hoa hồng doanh số theo năng lực hàng tháng.
                            </p>
                        </div>
                    </div>

                    {/* Thẻ 2: Đãi Ngộ Nội Bộ */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden space-y-4 group">
                        <div className="h-44 w-full overflow-hidden relative">
                            <img
                                src={daingo}
                                alt="Đãi Ngộ Nội Bộ"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-4">
                                <span className="px-3 py-1 bg-orange-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md">
                                    <Award className="h-3.5 w-3.5" /> Ưu Đãi Độc Quyền
                                </span>
                            </div>
                        </div>
                        <div className="p-6 pt-0 space-y-2">
                            <h3 className="font-bold text-slate-900 text-base">Đãi Ngộ Nội Bộ</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Mua thiết bị cầu lông giá gốc & miễn phí căng cước vợt định kỳ cho nhân viên.
                            </p>
                        </div>
                    </div>

                    {/* Thẻ 3: Văn Hóa Thể Thao */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden space-y-4 group">
                        <div className="h-44 w-full overflow-hidden relative">
                            <img
                                src={vanhoacaulong}
                                alt="Văn Hóa Thể Thao"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-4">
                                <span className="px-3 py-1 bg-orange-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md">
                                    <Users className="h-3.5 w-3.5" /> Đồng Nghiệp Đam Mê
                                </span>
                            </div>
                        </div>
                        <div className="p-6 pt-0 space-y-2">
                            <h3 className="font-bold text-slate-900 text-base">Văn Hóa Thể Thao</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Giao lưu cầu lông hàng tuần cùng toàn thể đồng nghiệp và ban quản lý công ty.
                            </p>
                        </div>
                    </div>

                    {/* Thẻ 4: Lộ Trình Thăng Tiến */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden space-y-4 group">
                        <div className="h-44 w-full overflow-hidden relative">
                            <img
                                src={thangtien}
                                alt="Lộ Trình Thăng Tiến"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-4">
                                <span className="px-3 py-1 bg-orange-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md">
                                    <HeartHandshake className="h-3.5 w-3.5" /> Phát Triển Bản Thân
                                </span>
                            </div>
                        </div>
                        <div className="p-6 pt-0 space-y-2">
                            <h3 className="font-bold text-slate-900 text-base">Lộ Trình Thăng Tiến</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Được đào tạo tay nghề bài bản và cơ hội thăng tiến lên Cửa hàng trưởng.
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* 3. DANH SÁCH VỊ TRÍ ĐANG TUYỂN DỤNG */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <Briefcase className="h-6 w-6 text-orange-500" /> Vị trí đang tuyển dụng ({jobListings.length})
                    </h2>
                </div>

                <div className="space-y-4">
                    {jobListings.map((job) => (
                        <div
                            key={job.id}
                            className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                                <div className="space-y-1">
                                    <span className="px-3 py-1 rounded-md bg-orange-100 text-orange-600 text-[10px] font-extrabold uppercase">
                                        {job.type}
                                    </span>
                                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                                        {job.title}
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedJob(job)}
                                    className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-orange-500/20 shrink-0 cursor-pointer"
                                >
                                    Ứng tuyển ngay
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-slate-700">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-orange-500 shrink-0" />
                                    <span>Địa điểm: <span className="font-bold">{job.location}</span></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-emerald-600 shrink-0" />
                                    <span>Mức lương: <strong className="text-emerald-600 font-bold">{job.salary}</strong></span> 
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                                    <span>Hạn nộp: <strong>{job.deadline}</strong></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. MODAL ỨNG TUYỂN NHANH (Form Apply Popup) */}
            {selectedJob && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl space-y-6 p-6 sm:p-8 relative border border-slate-200">
                        
                        <button
                            type="button"
                            onClick={() => setSelectedJob(null)}
                            className="absolute top-4 right-4 h-9 w-9 rounded-full bg-slate-100 text-slate-600 hover:bg-orange-500 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="space-y-1 border-b border-slate-100 pb-4">
                            <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">
                                Nộp hồ sơ ứng tuyển
                            </span>
                            <h2 className="text-xl font-bold text-slate-900 pr-6">
                                {selectedJob.title}
                            </h2>
                        </div>

                        <form onSubmit={handleSendApply} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700">Họ và tên <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Nhập họ và tên của bạn"
                                    value={applyForm.fullName}
                                    onChange={(e) => setApplyForm({ ...applyForm, fullName: e.target.value })}
                                    className="w-full h-11 px-4 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Số điện thoại <span className="text-red-500">*</span></label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="Nhập số điện thoại"
                                        value={applyForm.phone}
                                        onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                                        className="w-full h-11 px-4 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Email</label>
                                    <input
                                        type="email"
                                        placeholder="Nhập địa chỉ Email"
                                        value={applyForm.email}
                                        onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                                        className="w-full h-11 px-4 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700">Giới thiệu ngắn / Link CV</label>
                                <textarea
                                    rows={3}
                                    placeholder="Kinh nghiệm làm việc hoặc link CV Google Drive..."
                                    value={applyForm.note}
                                    onChange={(e) => setApplyForm({ ...applyForm, note: e.target.value })}
                                    className="w-full p-3 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                                />
                            </div>

                            <div className="pt-2 flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Send className="h-4 w-4" /> Gửi hồ sơ ngay
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}

        </div>
    );
}
