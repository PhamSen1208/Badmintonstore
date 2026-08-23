import loginBackground from "@/assets/login_register.png";
import logo from "@/assets/logo.png";

type AuthShellProps = {
    title: string
    description: string
    children: React.ReactNode
}

export function AuthShell({ title, description, children }: AuthShellProps) {
    return (
        <main className="min-h-screen bg-neutral-50 text-foreground">
            <div className="grid min-h-screen lg:grid-cols-[45fr_55fr]">
                {/* ── Hero / Branding (Left) ── */}
                <section className="relative hidden overflow-hidden bg-neutral-950 text-white lg:flex">
                    {/* Background Athlete Image */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src={loginBackground}
                            alt="Badminton athletes background"
                            className="h-full w-full object-cover mix-blend-luminosity filter brightness-150 contrast-110"
                        />
                        {/* Dark fading gradient overlays */}
                        <div className="absolute inset-0 bg-linear-to-tr from-neutral-950 via-neutral-950/70 to-transparent" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left_bottom,rgba(16,100,200,0.15),transparent_50%)]" />
                    </div>

                    <div className="relative z-10 flex flex-1 flex-col justify-between p-12 xl:p-16">
                        {/* Top: Logo */}
                        <div>
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-12 items-center justify-center">
                                    <img src={logo} alt="Logo" className="h-full w-full object-cover rounded-sm" />
                                </div>
                                <span className="text-2xl font-semibold tracking-wider text-neutral-400"> 
                                    BadmintonStores
                                </span>
                            </div>
                        </div>

                        {/* Bottom: Heading, Description & Copyright */}
                        <div className="mt-auto">
                            <h1 className="text-3xl font-bold tracking-tight text-neutral-100">
                                <span className="text-white">Cửa hàng cầu lông - phụ kiện thể thao</span> 
                            </h1>

                            <p className="mt-3 max-w-sm text-sm text-neutral-400 leading-relaxed">
                                Chuyên cung cấp phụ kiện - giày - vợt - quần áo cầu lông chính hãng, chất lượng cao.
                            </p>

                            <div className="mt-16 text-xs text-neutral-500">
                                © 2026 BadmintonStores. All rights reserved.
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Form (Right) ── */}
                <section className="flex items-center justify-center bg-neutral-50/50 px-6 py-12 sm:px-10 lg:bg-neutral-50">
                    <div className="w-full max-w">
                        {/* Mobile logo */}
                        <div className="mb-10 lg:hidden">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-600 shadow-sm">
                                    <span className="text-sm font-bold text-white">B</span>
                                </div>
                                <span className="text-sm font-semibold tracking-wide text-neutral-800">
                                    BadmintonStores
                                </span>
                            </div>
                        </div>

                        {/* Heading */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                                {title}
                            </h2>
                            <p className="mt-2 text-sm text-neutral-500">{description}</p>
                        </div>

                        {children}
                    </div>
                </section>
            </div>
        </main>
    )
}