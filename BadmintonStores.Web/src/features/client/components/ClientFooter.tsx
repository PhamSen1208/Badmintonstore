import { Link } from "react-router-dom";
import { Shield, Truck, RotateCcw, Award, User, Home, Mail } from "lucide-react";

export function ClientFooter() {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-12 pb-6 border-t border-slate-800">
            <div className="w-full max-w mx-auto px-4 md:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
                {/* Cột 1: Giới thiệu shop */}
                <div className="space-y-4 md:border-r border-slate-800 md:pr-6">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-base">BS</div>
                        <span className="text-lg font-black tracking-tight text-white">BADMINTON<span className="text-orange-500">STORES</span></span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed font-normal">
                        Công ty TNHH BadmintonStores Việt Nam.
                    </p>
                    <ul className="space-y-3 text-xs text-slate-400 font-normal">
                        <li className="flex items-start gap-2">
                            <Home className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" /> 
                            <span><b>Địa chỉ:</b> 128 Mai Dịch, Phú Diễn, Hà Nội</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <User className="h-4 w-4 text-orange-500 shrink-0" /> 
                            <span><b>Người đại diện:</b> Phạm Việt Đức</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-orange-500 shrink-0" />
                            <span><b>Email:</b> phamvietduc12082003@gmail.com</span>
                        </li>
                    </ul>
                </div>

                {/* Cột 2: Hướng dẫn khách hàng */}
                <div className="space-y-3 md:border-r border-slate-800 md:pr-6">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Hướng dẫn khách hàng</h4>
                    <ul className="space-y-3 text-xs text-slate-400 font-normal">
                        <li className="hover:text-orange-500 transition-colors"><Link to="/policy/warranty">Chính sách bảo hành</Link></li>
                        <li className="hover:text-orange-500 transition-colors"><Link to="/policy/return">Chính sách đổi trả</Link></li>
                        <li className="hover:text-orange-500 transition-colors"><Link to="/policy/shipping">Chính sách vận chuyển</Link></li>
                        <li className="hover:text-orange-500 transition-colors"><Link to="/policy/security">Chính sách bảo mật</Link></li>
                    </ul>
                </div>

                {/* Cột 3: Chính sách hỗ trợ */}
                <div className="space-y-3 md:border-r border-slate-800 md:pr-6">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Chính sách khách hàng</h4>
                    <ul className="space-y-3 text-xs text-slate-400 font-normal">
                        <li className="flex items-center gap-2"><Award className="h-4 w-4 text-orange-500" /> Cam kết chính hãng 100%</li>
                        <li className="flex items-center gap-2"><Truck className="h-4 w-4 text-orange-500" /> Miễn phí giao hàng đơn từ 1 triệu</li>
                        <li className="flex items-center gap-2"><RotateCcw className="h-4 w-4 text-orange-500" /> Đổi mới trong 7 ngày nếu lỗi nsx</li>
                        <li className="flex items-center gap-2"><Shield className="h-4 w-4 text-orange-500" /> Bảo hành theo tiêu chuẩn hãng</li>
                    </ul>
                </div>

                {/* Cột 4: Đăng ký nhận thông tin & Mạng xã hội */}
                <div className="space-y-3">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Tư vấn chọn vợt</h4>
                    <p className="text-xs text-slate-400 font-normal">Để lại SĐT để chuyên viên hỗ trợ tư vấn chọn vợt phù hợp với trình độ của bạn:</p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Nhập số điện thoại..."
                            className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 flex-1 focus:outline-none focus:border-orange-500"
                        />
                        <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs px-3 py-2 rounded-lg transition-colors">
                            Gửi
                        </button>
                    </div>

                    {/* Mạng xã hội & Kênh liên hệ */}
                    <div className="flex flex-col pt-2">
                        <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Mạng xã hội & Kênh liên hệ:</span>
                        <div className="flex items-center gap-2.5 mt-2.5">
                            {/* Facebook */}
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noreferrer"
                                className="h-9 w-9 rounded-xl bg-slate-800 hover:bg-orange-500 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
                                title="Facebook"
                            >
                                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </a>

                            {/* Zalo */}
                            <a
                                href="https://zalo.me"
                                target="_blank"
                                rel="noreferrer"
                                className="h-9 w-9 rounded-xl bg-slate-800 hover:bg-orange-500 text-slate-300 hover:text-white flex items-center justify-center font-black text-[11px] transition-all shadow-sm"
                                title="Zalo Chat"
                            >
                                ZALO
                            </a>

                            

                            {/* TikTok */}
                            <a
                                href="https://tiktok.com"
                                target="_blank"
                                rel="noreferrer"
                                className="h-9 w-9 rounded-xl bg-slate-800 hover:bg-orange-500 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
                                title="TikTok"
                            >
                                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.57-1.31 1.56-1.3 2.56.01.94.52 1.84 1.33 2.33.91.56 2.08.62 3.03.17.95-.44 1.64-1.37 1.74-2.42.06-1.78.02-3.57.03-5.35V.02z"/>
                                </svg>
                            </a>

                           
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full max-w mx-auto px-4 md:px-8 lg:px-12 pt-6 text-center text-xs text-slate-500">
                © 2026 BadmintonStores. All rights reserved. Designed with modern UX/UI.
            </div>
        </footer>
    );
}
