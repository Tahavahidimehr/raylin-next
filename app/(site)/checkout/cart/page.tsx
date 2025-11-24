"use client";

import { useCartStore } from "@/store/cartStore";
import { useEffect } from "react";
import {Trash2, ShoppingCart, Truck, CreditCard, ShoppingBasket} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MiniProductCounter from "@/components/cart/MiniProductCounter";
import {Button, Tooltip} from "@mui/material";
import {useAuthStore} from "@/store/authStore";

export default function Cart() {
    const { items, changes, removeItem, syncCart } = useCartStore();
    const { authenticated } = useAuthStore()

    useEffect(() => {
        syncCart();
    }, []);

    const totalOriginal = items.reduce(
        (sum, i) => sum + (i.original_price ?? i.unit_price) * i.quantity,
        0
    );

    const totalFinal = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);

    const totalDiscount = Math.max(0, totalOriginal - totalFinal);

    return (
        <div className="w-full flex flex-col justify-start items-center gap-5 my-10 text-text">

            {
                items.length > 0 && (
                    <div className="flex items-center">
                        <span className="p-3 rounded-full bg-gray-200 shadow-md">
                            <ShoppingCart className="size-6 text-prime" />
                        </span>
                        <div className="w-60 h-1 rounded-full bg-gray-200" />
                            <Truck className="mx-3 size-6 text-gray-400" />
                        <div className="w-60 h-1 rounded-full bg-gray-200" />
                        <CreditCard className="mr-3 size-6 text-gray-400" />
                    </div>
                )
            }

            {items.length === 0 ? (
                <div className="w-full h-[289px] flex flex-col justify-between items-center rounded-md bg-white p-10 text-center text-gray-500">
                    <ShoppingBasket className="size-20 text-gray-300" />
                    <span>سبد خرید شما خالی است</span>
                    <Button variant="contained">
                        <Link href="/" className="w-full">رفتن به صفحه اصلی</Link>
                    </Button>
                </div>
            ) : (
                <div className="w-full flex justify-between items-start gap-7">

                    {/* Product List */}
                    <div className="w-full flex flex-col gap-5">

                        <div className="w-full flex justify-between items-center">
                            <h1 className="font-semibold">سبد خرید شما</h1>
                            <span className="text-sm">{items.length} محصول</span>
                        </div>

                        {items.map((item) => {
                            const image =
                                item.variant?.media?.[0]?.url ||
                                item.product.media?.[0]?.url ||
                                "/images/placeholder.png";

                            // قیمت‌ها ضرب در تعداد
                            const originalSingle = item.original_price ?? item.unit_price;
                            const finalSingle = item.unit_price;

                            const originalTotal = originalSingle * item.quantity;
                            const finalTotal = finalSingle * item.quantity;

                            // درصد تخفیف از کل محاسبه شود
                            let discountPercent: number | null = null;

                            if (originalTotal > finalTotal) {
                                const diff = originalTotal - finalTotal;
                                discountPercent = Math.round((diff / originalTotal) * 100);
                            }

                            const hasDiscountBadge = discountPercent !== null && discountPercent > 0;

                            // پیام‌های تغییرات
                            const itemChanges = changes.filter(
                                (c) =>
                                    c.item_id === item.product_id &&
                                    c.variant_id === item.product_variant_id
                            );

                            return (
                                <div
                                    key={`${item.product_id}-${item.product_variant_id}`}
                                    className="w-full h-44 bg-white rounded-md p-5 flex justify-between items-center"
                                >
                                    {/* Left */}
                                    <div className="flex gap-5 h-full">
                                        <Link
                                            href={`/products/${item.product.slug}`}
                                            className="relative w-36 h-full rounded-md overflow-hidden"
                                        >
                                            <Image
                                                src={image}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </Link>

                                        <div className="flex flex-col justify-between h-full">
                                            <div className="flex flex-col gap-2">

                                                <div className="w-full flex items-center gap-3">
                                                    <h2 className="font-semibold">{item.product.name}</h2>

                                                    {itemChanges.length > 0 && (
                                                        <Tooltip
                                                            title={itemChanges.map((c) => c.message).join(" • ")}
                                                        >
                                                        <span className="relative flex size-3 cursor-pointer">
                                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-prime opacity-75"></span>
                                                            <span className="relative inline-flex size-3 rounded-full bg-prime"></span>
                                                        </span>
                                                        </Tooltip>
                                                    )}
                                                </div>

                                                {item.variant && (
                                                    <span className="text-sm text-gray-500">
                                                    {item.variant.variant_values
                                                        ?.map((v: any) => `${v.variant.name}: ${v.value}`)
                                                        .join(" / ")}
                                                </span>
                                                )}
                                            </div>

                                            <MiniProductCounter item={item} />
                                        </div>
                                    </div>

                                    {/* Right */}
                                    <div className="flex flex-col justify-between items-end h-full">

                                        <button
                                            className="text-prime cursor-pointer"
                                            onClick={() =>
                                                removeItem(item.product_id, item.product_variant_id)
                                            }
                                        >
                                            <Trash2 className="size-5" />
                                        </button>

                                        <div className="flex flex-col items-end gap-2">

                                            {/* Original + Badge */}
                                            {hasDiscountBadge && (
                                                <div className="flex items-center gap-3">
                                                    <del className="text-gray-300">
                                                        {originalTotal.toLocaleString()}
                                                    </del>

                                                    <span className="bg-prime text-white text-xs px-3 py-1 rounded-full">
                                                    %{discountPercent}
                                                </span>
                                                </div>
                                            )}

                                            {/* Final */}
                                            <div className="flex items-center gap-1">
                                            <span className="text-xl font-semibold">
                                                {finalTotal.toLocaleString()}
                                            </span>
                                                <span className="text-sm">تومان</span>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Summary */}
                    <div className="min-w-[350px] bg-white rounded-md p-5 flex flex-col gap-7">
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>قیمت کالاها ({items.length})</span>
                            <span>{totalOriginal.toLocaleString()} تومان</span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span>جمع سبد خرید</span>
                            <span>{totalFinal.toLocaleString()} تومان</span>
                        </div>

                        {
                            totalDiscount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>سود شما</span>
                                    <span>{totalDiscount.toLocaleString()} تومان</span>
                                </div>
                            )
                        }

                        {
                            authenticated ? (
                                <Link href="/checkout/shipping" className="w-full">
                                    <Button className="w-full" variant="contained">تایید و تکمیل سفارش</Button>
                                </Link>
                            ) : (
                                <Link href="/auth/login?backUrl=/checkout/shipping" className="w-full">
                                    <Button className="w-full" variant="contained">تایید و تکمیل سفارش</Button>
                                </Link>
                            )
                        }
                    </div>

                </div>
            )}
        </div>
    );
}