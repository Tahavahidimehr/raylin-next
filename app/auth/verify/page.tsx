"use client";

import { useEffect, useRef, useState } from "react";
import { IconButton, TextField, Box, Typography, Button } from "@mui/material";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useRouter, useSearchParams } from "next/navigation"; // ⭐ اضافه شد
import toast from "react-hot-toast";
import { apiClient, ApiError } from "@/lib/apiClient";
import Image from "next/image";

export default function Verify() {
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState<string[]>(Array(5).fill(""));
    const [timeLeft, setTimeLeft] = useState(0);
    const [isExpired, setIsExpired] = useState(false);
    const [errorState, setErrorState] = useState(false);

    const searchParams = useSearchParams();               // ⭐ گرفتن کوئری
    const backUrl = searchParams.get("backUrl") || null;  // ⭐ backUrl

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const router = useRouter();
    const { mobile, otpExpiresAt, setRole, setAuthenticated, setUserData, clearOtp } = useAuthStore();

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    useEffect(() => {
        if (!mobile) return router.push("/auth/login");

        if (otpExpiresAt) {
            const diff = Math.floor((otpExpiresAt - Date.now()) / 1000);
            if (diff <= 0) {
                setIsExpired(true);
                setTimeLeft(0);
            } else {
                setTimeLeft(diff);
            }
        } else {
            setIsExpired(true);
        }
    }, [mobile, otpExpiresAt, router]);

    useEffect(() => {
        if (isExpired) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsExpired(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isExpired]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const handleChange = (value: string, index: number) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setErrorState(false);

        if (value && index < 4) inputRefs.current[index + 1]?.focus();

        if (newOtp.every((digit) => digit !== "")) {
            setTimeout(() => handleSubmit(newOtp.join("")), 100);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const paste = e.clipboardData.getData("text").trim();
        if (!/^\d+$/.test(paste)) return;

        const pasteDigits = paste.slice(0, 5).split("");
        const newOtp = [...otp];
        pasteDigits.forEach((d, i) => (newOtp[i] = d));
        setOtp(newOtp);

        if (pasteDigits.length === 5) handleSubmit(pasteDigits.join(""));
    };

    const handleSubmit = async (code?: string) => {
        const fullCode = code || otp.join("");
        if (fullCode.length < 5) {
            toast.error("لطفاً کد تأیید را کامل وارد کنید");
            return;
        }

        setLoading(true);
        try {
            const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`, {
                method: "POST",
                body: { mobile, code: fullCode },
                withCredentials: true,
            });

            setUserData(res.data.user);
            setRole(res.data.user.role);
            setAuthenticated(true);
            clearOtp();

            // ⭐ ریدایرکت به backUrl یا صفحه اصلی
            router.push(backUrl || "/");

            toast.success(res.message);
        } catch (err) {
            const error = err as ApiError;
            toast.error(error.message || "کد تأیید نادرست است");
            setErrorState(true);
            setOtp(Array(5).fill(""));
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const resendCode = async () => {
        if (!mobile) return;
        setLoading(true);
        try {
            const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                method: "POST",
                body: { mobile },
                withCredentials: true,
            });

            const expiresAt = Date.now() + 3 * 60 * 1000;
            setTimeLeft(180);
            setIsExpired(false);
            inputRefs.current[0]?.focus();
            toast.success(res.message);
        } catch {
            toast.error("ارسال مجدد کد با خطا مواجه شد");
        } finally {
            setLoading(false);
        }
    };

    if (!mobile) return null;

    return (
        <div className="w-full h-screen flex justify-center items-center p-2">
            <div className="w-[400px] h-[400px] border border-gray-300 rounded flex flex-col justify-between p-5">
                <div className="w-full h-10 flex justify-between items-center">
                    <div className="w-1/3 flex justify-start">
                        <Link href="/auth/login">
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

                <div className="flex flex-col gap-5">
                    <h4 className="font-semibold text-right">تأیید شماره موبایل</h4>
                    <h5 className="text-gray-600 text-sm text-right">کد تأیید به شماره {mobile} پیامک شد</h5>

                    <Box display="flex" flexDirection="row-reverse" justifyContent="center" gap={2}>
                        {otp.map((digit, i) => (
                            <TextField
                                key={i}
                                inputRef={(el) => (inputRefs.current[i] = el)}
                                value={digit}
                                error={errorState}
                                onChange={(e) => handleChange(e.target.value, i)}
                                onPaste={handlePaste}
                                inputProps={{
                                    maxLength: 1,
                                    style: { textAlign: "center", fontSize: "22px", width: "15px", height: "10px" },
                                    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, i),
                                }}
                                variant="outlined"
                            />
                        ))}
                    </Box>

                    <div className="flex justify-center mt-2">
                        {!isExpired ? (
                            <Typography variant="body2" color="textSecondary">
                                <strong>{formatTime(timeLeft)}</strong> تا ارسال مجدد
                            </Typography>
                        ) : (
                            <Button onClick={resendCode} disabled={loading}>
                                ارسال مجدد کد
                            </Button>
                        )}
                    </div>

                    <Button variant="contained" disabled={loading} onClick={() => handleSubmit()}>
                        {loading ? "در حال بررسی..." : "تأیید کد ورود"}
                    </Button>

                    <p className="text-[12px] text-gray-600 text-center">
                        ورود شما به معنای پذیرش شرایط سایت و قوانین حریم خصوصی است
                    </p>
                </div>
            </div>
        </div>
    );
}