import Link from "next/link";
import {ArrowRight, ChevronDown, Dot, ReceiptText, Trash2} from "lucide-react";
import * as React from "react";
import {Button, IconButton} from "@mui/material";
import Image from "next/image";
import MiniProductCounter from "@/components/cart/MiniProductCounter";

export default async function OrderDetail({ params }: { params: Promise<{ orderId: string }> }) {

    const { orderId } = await params

    return (
        <div className="w-full bg-white rounded-md flex flex-col">
            <div className="w-full flex justify-between items-center border-b border-gray-200 p-5">
                <div className="flex items-center gap-2">
                    <Link href="/profile/orders">
                        <IconButton>
                            <ArrowRight className="size-5" />
                        </IconButton>
                    </Link>
                    <span>جزئیات سفارش</span>
                </div>
                <Link href="/">
                    <Button className="flex items-center gap-2 text-prime text-sm">
                        <ReceiptText className="size-5" />
                        <span>مشاهده فاکتور</span>
                    </Button>
                </Link>
            </div>
            <div className="w-full flex flex-col gap-5 p-5">
                <div className="flex items-center gap-2 text-sm border-b border-gray-200 pb-5">
                    <span className="text-gray-400">کد پیگری سفارش</span>
                    <span className="text-text">454876514</span>
                    <Dot className="size-7 text-gray-300" />
                    <span className="text-gray-400">تاریخ ثبت سفارش</span>
                    <span className="text-text">12 دی 1404</span>
                </div>
                <div className="w-full flex flex-col gap-5 border-b border-gray-200 pb-5">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400">تحویل گیرنده</span>
                        <span className="text-text">طاها وحیدی مهر</span>
                        <Dot className="size-7 text-gray-300" />
                        <span className="text-gray-400">شماره موبایل</span>
                        <span className="text-text">09173275417</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400">آدرس</span>
                        <p className="text-text">تبریز، اول خیابان عباسی، خیابان بهشتی شمالی، اول خیابان مصطفی خمینی ، دیلی مارکت ۴۰۰۷</p>
                    </div>
                </div>
                <div className="w-full flex justify-between items-center border-b border-gray-200 pb-5">
                    <div className="flex items-center gap-5">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-400">مبلغ سفارش</span>
                            <span className="text-text">2,850,000 تومان</span>
                        </div>
                        <Dot className="size-7 text-gray-300" />
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-400">هزینه ارسال</span>
                            <span className="text-text">99,000 تومان</span>
                        </div>
                    </div>
                    <Button className="flex items-center gap-2 text-prime text-sm">
                        <span>تاریخچه تراکنش ها</span>
                        <ChevronDown className="size-5" />
                    </Button>
                </div>
                <div className="w-full h-32 flex justify-between items-center bg-white border-b border-gray-200 pb-5">
                    <div className="h-full flex justify-start items-start gap-5">
                        <Link href="/products/slug" className="w-32 h-full relative rounded-md overflow-hidden">
                            <Image
                                src="/images/product1.png"
                                alt="product image"
                                fill
                                className="rounded-md object-cover transition-all duration-500 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </Link>
                        <div className="h-full flex flex-col justify-between">
                            <div className="flex flex-col gap-3">
                                <h2 className="font-semibold">زعفران درجه یک صادراتی</h2>
                                <span className="text-sm">وزن: نیم مثقال</span>
                                <span className="text-sm">تعداد: 2</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-full flex flex-col justify-end items-end">
                        <div className="w-full flex flex-col justify-end items-end text-text gap-2">
                            <div className="w-full flex justify-end items-center gap-3">
                                <del className="text-gray-300">150,000</del>
                                <span className="w-9 h-6.5 rounded-full bg-prime text-white text-[12px] flex justify-center items-center">12%</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-xl font-semibold">1,200,000</span>
                                <span className="text-sm">تومان</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}