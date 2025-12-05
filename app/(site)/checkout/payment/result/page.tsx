"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PaymentResultPage() {
    const params = useSearchParams();

    const status = params.get("status");  // success | failed
    const orderCode = params.get("order");
    const ref = params.get("ref");        // شماره پیگیری بانک (اگر موفق باشد)

    const isSuccess = status === "success";

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center p-5 text-text bg-gray-50">

            <div className="bg-white shadow-md rounded-xl p-10 max-w-md w-full flex flex-col items-center gap-6">

                {isSuccess ? (
                    <CheckCircle className="text-green-600" size={70} />
                ) : (
                    <XCircle className="text-red-600" size={70} />
                )}

                <h1 className="text-2xl font-bold">
                    {isSuccess ? "پرداخت با موفقیت انجام شد 🎉" : "پرداخت ناموفق بود ❌"}
                </h1>

                <div className="w-full flex flex-col gap-3 text-sm text-gray-700 mt-4">

                    <div className="flex justify-between">
                        <span>کد سفارش:</span>
                        <span className="font-bold">{orderCode}</span>
                    </div>

                    {isSuccess && (
                        <div className="flex justify-between">
                            <span>شماره پیگیری بانک:</span>
                            <span className="font-bold">{ref}</span>
                        </div>
                    )}

                    {!isSuccess && (
                        <p className="text-red-500 text-center mt-2">
                            پرداخت شما ناموفق بود. لطفا دوباره تلاش کنید.
                        </p>
                    )}
                </div>

                <div className="w-full flex flex-col gap-3 mt-6">
                    {isSuccess ? (
                        <Link
                            href="/orders"
                            className="w-full text-center bg-prime text-white py-3 rounded-lg hover:opacity-90 transition"
                        >
                            مشاهده سفارش‌ها
                        </Link>
                    ) : (
                        <Link
                            href="/cart"
                            className="w-full text-center bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition"
                        >
                            بازگشت به سبد خرید
                        </Link>
                    )}

                    <Link
                        href="/"
                        className="w-full text-center border border-gray-300 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                    >
                        بازگشت به صفحه اصلی
                    </Link>
                </div>
            </div>
        </div>
    );
}