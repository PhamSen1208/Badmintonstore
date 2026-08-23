import { useNavigate } from "react-router-dom"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Loader2, Mail } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { loginSchema, type LoginFormValues } from "../schemas/auth.schema"
import { getDefaultRouteByRole } from "@/features/auth/utils/auth-redirect";

export function LoginPage() {
    const [serverError, setServerError] = useState<string | null>(null)
    const navigate = useNavigate()
    const { login } = useAuth()
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: true,
        },
    })

    const isSubmitting = form.formState.isSubmitting

    async function onSubmit(values: LoginFormValues) {
        setServerError(null)

        try {
            const response = await login({ 
                email: values.email,
                password: values.password,
            })
            navigate(getDefaultRouteByRole(response.user.role))
        }
        catch 
        {
            setServerError("Email hoặc mật khẩu không đúng")
        }
    }

    return (
        <AuthShell
            title="Đăng nhập"
            description="Tiếp tục khám phá các sản phẩm cầu lông chính hãng giá tốt"
        >
            <div className="rounded-2xl border border-neutral-200/60 bg-white p-8 shadow-lg sm:p-10"> 
                {serverError && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertDescription>{serverError}</AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
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
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center justify-between">
                                        <FormLabel className="text-[13px] font-medium text-neutral-700">
                                            Mật khẩu
                                        </FormLabel>
                                        <Link
                                            to="/forgot-password"
                                            className="text-[13px] font-medium text-emerald-600 transition-colors hover:text-emerald-700"
                                        >
                                            Quên mật khẩu?
                                        </Link>
                                    </div>
                                    <FormControl>
                                        <PasswordInput
                                            placeholder="Nhập mật khẩu"
                                            className="h-11 text-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="rememberMe"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center gap-2.5 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal text-neutral-600">
                                        Ghi nhớ đăng nhập
                                    </FormLabel>
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            size="lg"
                            className="h-11 w-full gap-2 bg-emerald-600 text-md font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 active:bg-emerald-800"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    Đăng nhập
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
                    Chưa có tài khoản?{" "}
                    <Link
                        to="/register"
                        className="font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
                    >
                        Tạo tài khoản
                    </Link>
                </p>
            </div>
        </AuthShell>
    )
}