import { useState } from "react";
import { Link } from "react-router-dom";
import {
    MapPin, Phone, Globe, Search, ChevronRight, Award, Video,
} from "lucide-react";
import showroomImage from "../../../assets/storesPicture.jpg"

export type StoreLocation = {
    id: string;
    code: string;
    name: string;
    city: string;
    district: string;
    address: string;
    phone: string;
    fanpage: string;
    mapUrl: string;
};

const storeLocationsData: StoreLocation[] = [
    {
        id: "cs13",
        code: "CS13",
        name: "BadmintonStore Trần Thái Tông",
        city: "Hà Nội",
        district: "Cầu Giấy",
        address: "22 Phố Trần Thái Tông, Dịch Vọng Hậu, Cầu Giấy, Hà Nội",
        phone: "085 743 8333",
        fanpage: "https://facebook.com/badmintonstore.tranthaitong",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.863981044336!2d105.78183067503173!3d21.036127780614742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab354920c233%3A0x5d0313a38d613936!2zMjIgUC4gVHLhuqduIFRow6FpIFTDtG5nLCBE4buLY2ggVuG7jW5nIEjhuqF1LCBD4bqndSBHaeG6pXksIEjDoCBO4buZaQ!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s",
    },
    {
        id: "cs1",
        code: "CS1",
        name: "BadmintonStore Trường Chinh",
        city: "Hà Nội",
        district: "Đống Đa",
        address: "Số 68 - 70 Ngõ 102 Trường Chinh, Đống Đa, Hà Nội (có chỗ đậu ô tô)",
        phone: "056 532 3323",
        fanpage: "https://facebook.com/badmintonstore.truongchinh",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.6369242944365!2d105.83856107503089!3d21.006184780637657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac75d1d6cb6b%3A0x6a0bb6f1e8e5ef0!2zMTAyIFRyxrDhu51uZyBDaGluaCwgUGjDujAgTWFpLCDEkOG7kW5nIMSQYSwgSMOgIE7hu5lp!5e0!3m2!1svi!2s!4v1700000000001!5m2!1svi!2s",
    },
    {
        id: "cs12",
        code: "CS12",
        name: "BadmintonStore Gia Lai",
        city: "Gia Lai",
        district: "TP. Pleiku",
        address: "35 Đinh Tiên Hoàng, Diên Hồng, TP. Pleiku, Gia Lai",
        phone: "082 772 8333",
        fanpage: "https://facebook.com/badmintonstore.gialai",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3876.54123456789!2d108.000000!3d13.980000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzUgxJDDrW5oIFRpw6puIEhvw6BuZywgUGxlaWt1LCBHaWEgTGFp!5e0!3m2!1svi!2s!4v1700000000002!5m2!1svi!2s",
    },
    {
        id: "cs3",
        code: "CS3",
        name: "BadmintonStore Quận 10",
        city: "TP. Hồ Chí Minh",
        district: "Quận 10",
        address: "409 Lý Thường Kiệt, Phường 8, Tân Bình / Quận 10, TP. HCM",
        phone: "096 929 9839",
        fanpage: "https://facebook.com/badmintonstore.hcm",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4567891234!2d106.650000!3d10.770000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDA5IEzDvSBUaMaw4budbmcgS2nhu4d0LCBRdeG6rW4gMTAsIFRQLkhDTQ!5e0!3m2!1svi!2s!4v1700000000003!5m2!1svi!2s",
    },
    {
        id: "cs5",
        code: "CS5",
        name: "BadmintonStore Đà Nẵng",
        city: "Đà Nẵng",
        district: "Hải Châu",
        address: "180 Điện Biên Phủ, Thanh Khê, Hải Châu, TP. Đà Nẵng",
        phone: "098 812 3456",
        fanpage: "https://facebook.com/badmintonstore.danang",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.123456789!2d108.210000!3d16.060000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTgwIMSQaeG7h24gQmnDqm4gUGjhu6csIMSQw6AgTuG6tW5n!5e0!3m2!1svi!2s!4v1700000000004!5m2!1svi!2s",
    },
];

export function StoresPage() {
    const [selectedCity, setSelectedCity] = useState<string>("all");
    const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
    const [activeStore, setActiveStore] = useState<StoreLocation>(storeLocationsData[0]);

    // Lọc danh sách cửa hàng theo Tỉnh/Thành phố & Quận/Huyện
    const filteredStores = storeLocationsData.filter(store => {
        const matchCity = selectedCity === "all" || store.city === selectedCity;
        const matchDistrict = selectedDistrict === "all" || store.district === selectedDistrict;
        return matchCity && matchDistrict;
    });

    return (
        <div className="w-full space-y-10 pb-16">
            
            {/* 1. HERO BANNER VỚI ẢNH NỀN SHOWROOM VÀ OVERLAY TỐI SANG TRỌNG */}
            <div className="w-full relative overflow-hidden shadow-2xl bg-slate-950 text-white border-b border-slate-800">
                {/* Ảnh nền Showroom import từ assets */}
                <img
                    src={showroomImage}
                    alt="Badminton Stores Showroom"
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-25 scale-110"
                />
                
                {/* Lớp phủ Gradient Tối làm dịu màu, tăng độ tương phản và sang trọng */}
                <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/90 to-slate-900/75" />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent" />

                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                    
                    {/* Cột chữ Banner bên trái */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="space-y-1">
                            <span className="text-xs font-bold text-orange-400 tracking-widest uppercase flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" /> CẦU LÔNG ĐAM MÊ & CHÍNH HÃNG
                            </span>
                            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight uppercase leading-tight text-white">
                                HỆ THỐNG <span className="text-orange-500">BADMINTON STORES</span>
                            </h1>
                        </div>

                        {/* Dịch vụ nổi bật badge box (Tối màu đẳng cấp) */}
                        <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-800 space-y-3 shadow-2xl">
                            <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase tracking-wider">
                                <Award className="h-4 w-4" /> DỊCH VỤ NỔI BẬT TẠI CỬA HÀNG:
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-200">
                                <div className="flex items-center gap-2">
                                    <span className="text-orange-500">●</span> Vợt cầu lông chính hãng
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-orange-500">●</span> Giày cầu lông chính hãng
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-orange-500">●</span> Phụ kiện cầu lông đa dạng
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-orange-500">●</span> Hàn vợt cầu lông carbon
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-orange-500">●</span> Căng vợt lấy ngay chuẩn thi đấu
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-orange-500">●</span> Giao hàng toàn quốc
                                </div>
                            </div>
                        </div>

                        {/* Mạng xã hội Badges */}
                        <div className="flex items-center gap-3 pt-2 flex-wrap text-xs">
                            <span className="px-4 py-2 bg-slate-800/90 border border-slate-700/80 rounded-xl text-slate-200 font-bold flex items-center gap-2 backdrop-blur-md">
                                📍 Hệ thống cửa hàng toàn quốc
                            </span>
                            <span className="px-4 py-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-xl font-bold flex items-center gap-2 backdrop-blur-md">
                                🎁 Xem live TikTok nhận quà hấp dẫn
                            </span>
                            <div className="flex items-center gap-2">
                                <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="h-9 w-9 rounded-xl bg-slate-800 border border-slate-700 hover:border-orange-500 flex items-center justify-center transition-colors">
                                    <Video className="h-4 w-4 text-slate-200" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Cột ảnh đại diện Showroom bên phải */}
                    <div className="lg:col-span-5 hidden lg:block">
                        <div className="relative rounded-3xl overflow-hidden border-2 border-slate-700/80 shadow-2xl group">
                            <img
                                src={showroomImage}
                                alt="Showroom Cửa hàng Cầu Lông"
                                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent flex items-end p-6">
                                <span className="text-base font-bold text-white uppercase tracking-wider">
                                    Đồng hành cùng đam mê cầu lông!
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* BREADCRUMB */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Link to="/" className="hover:text-orange-500">Trang chủ</Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="font-semibold text-slate-800">Hệ thống cửa hàng</span>
                </div>
            </div>

            {/* 2. KHU VỰC TÌM KIẾM CỬA HÀNG VÀ BẢN ĐỒ INTERACTIVE */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                
                {/* Header Tìm kiếm & Bộ Lọc Dropdown (Chuẩn FBShop) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <MapPin className="h-6 w-6 text-orange-500" /> Tìm kiếm cửa hàng
                    </h2>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Dropdown Tỉnh/Thành phố */}
                        <select
                            value={selectedCity}
                            onChange={(e) => {
                                setSelectedCity(e.target.value);
                                setSelectedDistrict("all");
                            }}
                            className="h-11 px-4 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-orange-500 shadow-xs cursor-pointer min-w-44"
                        >
                            <option value="all">Chọn tỉnh/thành phố</option>
                            <option value="Hà Nội">Hà Nội</option>
                            <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                            <option value="Gia Lai">Gia Lai</option>
                            <option value="Đà Nẵng">Đà Nẵng</option>
                        </select>

                        {/* Dropdown Quận/Huyện */}
                        <select
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            className="h-11 px-4 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-orange-500 shadow-xs cursor-pointer min-w-44"
                        >
                            <option value="all">Chọn quận/huyện</option>
                            <option value="Cầu Giấy">Cầu Giấy</option>
                            <option value="Đống Đa">Đống Đa</option>
                            <option value="Quận 10">Quận 10</option>
                            <option value="Hải Châu">Hải Châu</option>
                        </select>

                        <button
                            type="button"
                            className="h-11 w-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow-md transition-colors cursor-pointer shrink-0"
                            title="Tìm kiếm"
                        >
                            <Search className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* BỐ CỤC 2 CỘT: BẢN ĐỒ TRÁI (Col-span-7) & DANH SÁCH THẺ PHẢI (Col-span-5) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* ── CỘT TRÁI: GOOGLE MAPS INTERACTIVE (Col-span-7) ── */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-3 space-y-3">
                            <div className="flex items-center justify-between px-3 pt-1">
                                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                    📍 Đang xem bản đồ: <strong className="text-orange-600">{activeStore.name}</strong>
                                </span>
                                <a
                                    href={activeStore.fanpage}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-orange-500 hover:underline font-semibold"
                                >
                                    Mở trong Google Maps ↗
                                </a>
                            </div>

                            {/* Khung iframe Google Maps */}
                            <div className="w-full h-112 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                                <iframe
                                    title={activeStore.name}
                                    src={activeStore.mapUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── CỘT PHẢI: DANH SÁCH THẺ CỬA HÀNG (Col-span-5) ── */}
                    <div className="lg:col-span-5 space-y-4 max-h-128 overflow-y-auto pr-1">
                        {filteredStores.length === 0 ? (
                            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
                                <p className="text-sm font-bold text-slate-700">Không tìm thấy cửa hàng phù hợp</p>
                                <p className="text-xs text-slate-500">Vui lòng thử chọn lại Tỉnh/Thành phố hoặc Quận/Huyện khác nhé!</p>
                            </div>
                        ) : (
                            filteredStores.map((store) => {
                                const isSelected = activeStore.id === store.id;
                                return (
                                    <div
                                        key={store.id}
                                        onClick={() => setActiveStore(store)}
                                        className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-3 shadow-xs ${
                                            isSelected
                                                ? "border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20"
                                                : "border-slate-200/90 bg-white hover:border-orange-300 hover:shadow-md"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="font-extrabold text-orange-600 text-base leading-snug">
                                                {store.code}: {store.name}
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveStore(store);
                                                }}
                                                className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shrink-0 transition-colors flex items-center gap-1 shadow-sm"
                                            >
                                                <MapPin className="h-3.5 w-3.5 fill-white" /> Xem bản đồ
                                            </button>
                                        </div>

                                        <div className="space-y-2 text-xs text-slate-700 font-medium">
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-orange-500 shrink-0" />
                                                <span className="font-bold text-slate-900">{store.phone}</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <MapPin className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                                                <span>{store.address}</span>
                                            </div>
                                            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                                                <Globe className="h-4 w-4 text-slate-400 shrink-0" />
                                                <a
                                                    href={store.fanpage}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-slate-600 hover:text-orange-600 truncate underline"
                                                >
                                                    {store.fanpage}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                </div>

            </div>

        </div>
    );
}
