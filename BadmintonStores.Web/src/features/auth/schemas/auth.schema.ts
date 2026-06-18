import { z } from "zod"

const strongPassword = z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất 1 chữ cái thường")
    .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ cái in hoa")
    .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 số")
    .regex(/[^a-zA-Z0-9]/, "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt");

export const loginSchema = z.object({
    email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
    password: z.string().min(1, "Mật khẩu là bắt buộc"),
    rememberMe: z.boolean().optional(),
})

export const registerSchema = z.object({
    fullName: z.string().min(1, "Họ và tên là bắt buộc"),
    email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
    phone: z.string().optional(),
    gender: z.string().optional(),
    password: strongPassword,
    confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu không khớp",
        path: ["confirmPassword"],
    });

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
