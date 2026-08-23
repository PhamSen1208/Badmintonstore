import { useState } from "react"
import { Link } from "react-router-dom"
import { Loader2, Mail, Phone, User } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/features/auth/hooks/useAuth"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AuthShell } from "../components/AuthShell"
import { PasswordInput } from "../components/PasswordInput"
import {
    registerSchema,
    type RegisterFormValues,
} from "../schemas/auth.schema"
import { getDefaultRouteByRole } from "@/features/auth/utils/auth-redirect";

export function RegisterPage() {
    const [serverError, setServerError] = useState<string | null>(null)
    const navigate = useNavigate()
    const { register } = useAuth()

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            gender: "unknown",
            password: "",
            confirmPassword: "",
        },
    })

    const isSubmitting = form.formState.isSubmitting

    async function onSubmit(values: RegisterFormValues) {
        setServerError(null)

        try {
            const response = await register({
                email: values.email,
                phone: values.phone || undefined,
                password: values.password,
                fullName: values.fullName,
                gender: values.gender || "unknown",
            })
            navigate(getDefaultRouteByRole(response.user.role))
        } catch  {
            setServerError("Đăng ký thất bại. Vui lòng thử lại") 
        }
    }

    return (
        <AuthShell
            title="Tạo tài khoản"
            description="Bắt đầu tạo tài khoản để mua sắm các sản phẩm cầu lông chính hãng giá tốt"
        >
            <div className="rounded-2xl border border-neutral-200/60 bg-white p-8 shadow-lg sm:p-10">
                {serverError && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertDescription>{serverError}</AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        {/* Full name */}
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[13px] font-medium text-neutral-700">
                                        Tên người dùng
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                                            <Input
                                                placeholder="Nguyễn Văn A"
                                                className="h-11 pl-10 text-sm"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email & Phone row */}
                        <div className="grid gap-5">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[13px] font-medium text-neutral-700">
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                                                <Input
                                                    placeholder="you@example.com"
                                                    className="h-11 pl-10 text-sm"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[13px] font-medium text-neutral-700">
                                            Số điện thoại
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                                                <Input
                                                    placeholder="0909 000 000"
                                                    className="h-11 pl-10 text-sm"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Password */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[13px] font-medium text-neutral-700">
                                        Mật khẩu
                                    </FormLabel>
                                    <FormControl>
                                        <PasswordInput
                                            placeholder="Tối thiểu 8 ký tự"
                                            className="h-11 text-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Confirm password */}
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[13px] font-medium text-neutral-700">
                                        Xác nhận mật khẩu
                                    </FormLabel>
                                    <FormControl>
                                        <PasswordInput
                                            placeholder="Nhập lại mật khẩu"
                                            className="h-11 text-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            size="lg"
                            className="h-11 w-full gap-2 bg-emerald-600 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 active:bg-emerald-800"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    Tạo tài khoản
                                </>
                            )}
                        </Button>
                    </form>
                </Form>

                <div className="relative my-7">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-neutral-200" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white px-3 text-xs text-neutral-400">hoặc</span>
                    </div>
                </div>

                <p className="text-center text-sm text-neutral-500">
                    Đã có tài khoản?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
                    >
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </AuthShell>
    )
}