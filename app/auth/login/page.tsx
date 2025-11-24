"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, IconButton, Button } from "@mui/material";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { apiClient, ApiError } from "@/lib/apiClient";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const schema = z.object({
    mobile: z
        .string()
        .min(11, "شماره موبایل باید ۱۱ رقم باشد")
        .max(11, "شماره موبایل باید ۱۱ رقم باشد")
        .regex(/^09\d{9}$/, "شماره موبایل معتبر نیست"),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    // ⬅️ این مهمه: گرفتن backUrl از query string
    const backUrl = searchParams.get("backUrl") || null;

    const { mobile: storeMobile, otpExpiresAt, setMobile, setOtpExpiresAt } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const onSubmit = async (formData: FormData) => {
        const now = Date.now();

        if (storeMobile === formData.mobile && otpExpiresAt && now < otpExpiresAt) {
            // ⬅️ پاس دادن backUrl به صفحه verify
            router.push(`/auth/verify${backUrl ? `?backUrl=${backUrl}` : ""}`);
            return;
        }

        setLoading(true);
        try {
            await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`);

            const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                method: "POST",
                body: { mobile: formData.mobile },
                withCredentials: true,
            });

            const expiresAt = now + 3 * 60 * 1000;
            setMobile(formData.mobile);
            setOtpExpiresAt(expiresAt);

            toast.success(res.message);

            // ⬅️ بعد از ارسال OTP → رفتن به verify همراه با backUrl
            router.push(`/auth/verify${backUrl ? `?backUrl=${backUrl}` : ""}`);
        } catch (err) {
            const error = err as ApiError;
            toast.error(error.message || "خطایی رخ داده است");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-screen flex justify-center items-center p-2">
            <div className="w-[400px] h-[350px] border border-gray-300 rounded flex flex-col justify-between p-5">
                <div className="w-full h-10 flex justify-between items-center">
                    <div className="w-1/3 flex justify-start">
                        <Link href="/">
                            <IconButton>
                                <ArrowRight className="size-6" />
                            </IconButton>
                        </Link>
                    </div>
                    <div className="w-1/3 flex justify-center">
                        <Link href="/" className="relative w-24 h-24">
                            <Image
                                src="/images/logo.png"
                                alt="logo"
                                fill
                                className="object-contain mt-2"
                                sizes="(max-width: 768px) 6rem, 8rem"
                                priority
                            />
                        </Link>
                    </div>
                    <div className="w-1/3" />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <h4 className="font-semibold">ورود یا ثبت‌نام</h4>
                    <h5 className="text-gray-600 text-sm">شماره موبایل خود را وارد کنید</h5>

                    <TextField
                        label="شماره موبایل"
                        size="small"
                        error={!!errors.mobile}
                        helperText={errors.mobile?.message}
                        {...register("mobile")}
                    />

                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? "در حال ارسال..." : "ورود به سایت"}
                    </Button>

                    <p className="text-[12px] text-gray-600 text-center">
                        ورود شما به معنای پذیرش شرایط سایت و قوانین حریم خصوصی است
                    </p>
                </form>
            </div>
        </div>
    );
}