"use client";

import { useState, useEffect } from "react";
import { NumericFormat } from "react-number-format";
import { Button, TextField } from "@mui/material";
import { Minus, Plus } from "lucide-react";
import { Product } from "@/types/types";
import {
    getProductPricing,
    getVariantPricing,
    formatPrice
} from "@/utils/getProductPricing";
import clsx from "clsx";
import { useProductVariantStore } from "@/store/productVariantStore";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";

export default function ProductCounter({ product }: { product: Product }) {
    const { selectedVariant } = useProductVariantStore();
    const { addItem, items } = useCartStore();

    const [quantity, setQuantity] = useState<number>(1);

    /* ------------------------------------------------------
       📌 تعداد موجود از این محصول/واریانت در سبد
    ------------------------------------------------------ */
    const cartQty = (() => {
        if (selectedVariant) {
            const found = items.find(
                i =>
                    i.product_id === product.id &&
                    i.product_variant_id === selectedVariant.id
            );
            return found ? found.quantity : 0;
        }

        const found = items.find(
            i =>
                i.product_id === product.id &&
                i.product_variant_id === null
        );
        return found ? found.quantity : 0;
    })();

    /* ------------------------------------------------------
       📌 محاسبه سقف مجاز خرید (min(stock , order_limit))
    ------------------------------------------------------ */
    const maxQty = (() => {
        if (selectedVariant) {
            const v: any = selectedVariant;
            const stock = Number(v.total_stock) || 0;

            let max = stock > 0 ? stock : 1;

            if (v.has_order_limit && Number(v.order_limit) > 0) {
                max = Math.min(max, Number(v.order_limit));
            }
            return max;
        }

        const stock = Number(product.total_stock) || 0;
        let max = stock > 0 ? stock : 1;

        if (product.has_order_limit && Number(product.order_limit) > 0) {
            max = Math.min(max, Number(product.order_limit));
        }

        return max;
    })();

    /* ------------------------------------------------------
       📌 تغییر واریانت → مقدار برگردد به ۱
    ------------------------------------------------------ */
    useEffect(() => {
        setQuantity(1);
    }, [selectedVariant, product.id]);

    /* ------------------------------------------------------
       📌 قیمت محصول
    ------------------------------------------------------ */
    const {
        hasDiscount,
        originalPrice,
        finalPrice,
        discountBadgeText
    } = selectedVariant
        ? getVariantPricing(selectedVariant)
        : getProductPricing(product);

    const isAvailable = product.is_available;

    const canIncrease = isAvailable && quantity < maxQty;
    const canDecrease = isAvailable && quantity > 1;

    /* ------------------------------------------------------
       ➕ افزایش
    ------------------------------------------------------ */
    const handleIncrease = () => {
        if (!isAvailable) return;

        if (quantity >= maxQty) {
            toast.error(`حداکثر تعداد قابل سفارش ${maxQty} عدد است`);
            return;
        }

        setQuantity(prev => prev + 1);
    };

    /* ------------------------------------------------------
       ➖ کاهش
    ------------------------------------------------------ */
    const handleDecrease = () => {
        if (!isAvailable) return;
        if (quantity <= 1) return;

        setQuantity(prev => prev - 1);
    };

    /* ------------------------------------------------------
       🔢 ورود مستقیم عدد
    ------------------------------------------------------ */
    const handleDirectChange = (value: number | null | undefined) => {
        if (!isAvailable) return;

        if (!value || value <= 0) {
            setQuantity(1);
            return;
        }

        let q = Math.floor(value);
        if (q < 1) q = 1;

        if (q > maxQty) {
            toast.error(`حداکثر تعداد قابل سفارش ${maxQty} عدد است.`);
            q = maxQty;
        }

        setQuantity(q);
    };

    /* ------------------------------------------------------
       🛒 افزودن به سبد خرید (با چک maxQty و مقدار داخل سبد)
    ------------------------------------------------------ */
    const handleAddToCart = async () => {
        if (!isAvailable) return;

        const productId = Number(product.id);
        const variantId = selectedVariant ? Number(selectedVariant.id) : null;

        const currentQty = cartQty;
        const totalAfterAdd = currentQty + quantity;

        if (totalAfterAdd > maxQty) {
            toast.error(`حداکثر تعداد قابل سفارش ${maxQty} عدد است`);
            return;
        }

        await addItem(productId, variantId, quantity, product, selectedVariant);

        toast.success("به سبد خرید اضافه شد");
    };

    /* ------------------------------------------------------
       👇 UI
    ------------------------------------------------------ */
    return (
        <div
            className={clsx(
                "min-w-[300px] bg-white rounded-md flex flex-col justify-between items-center p-5",
                isAvailable ? "h-[340px]" : "h-[150px]"
            )}
        >
            {isAvailable && (
                <>
                    {/* باکس کنترل تعداد */}
                    <div className="w-full bg-gray-50 rounded-md flex flex-col justify-between items-center gap-3 p-3">
                        <span className="w-full border-b border-gray-200 text-center pb-3">
                            تعداد
                        </span>

                        <div className="w-full flex justify-between items-center gap-1 px-1">
                            {/* Increase */}
                            <span
                                className={clsx(
                                    "h-full pt-2",
                                    canIncrease
                                        ? "cursor-pointer"
                                        : "cursor-not-allowed opacity-40"
                                )}
                                onClick={handleIncrease}
                            >
                                <Plus className="size-6 text-text" />
                            </span>

                            {/* Textbox */}
                            <NumericFormat
                                customInput={TextField}
                                thousandSeparator=","
                                allowNegative={false}
                                variant="standard"
                                value={quantity}
                                onValueChange={v =>
                                    handleDirectChange(v.floatValue)
                                }
                                InputProps={{ disableUnderline: true }}
                                inputProps={{
                                    style: {
                                        textAlign: "center",
                                        fontSize: "1.5rem",
                                        fontWeight: "600",
                                        background: "transparent"
                                    }
                                }}
                            />

                            {/* Decrease */}
                            <span
                                className={clsx(
                                    "h-full pt-2",
                                    canDecrease
                                        ? "cursor-pointer"
                                        : "cursor-not-allowed opacity-40"
                                )}
                                onClick={handleDecrease}
                            >
                                <Minus className="size-6 text-text" />
                            </span>
                        </div>
                    </div>
                </>
            )}

            {/* قیمت */}
            <div className="w-full flex flex-col justify-end items-end text-text gap-3 mt-3">
                {!isAvailable ? (
                    <div className="w-full h-14 flex justify-center items-center">
                        <p className="text-gray-500">این کالا فعلا موجود نیست</p>
                    </div>
                ) : (
                    <>
                        {hasDiscount &&
                            originalPrice !== null &&
                            discountBadgeText && (
                                <div className="w-full flex justify-end items-center gap-3">
                                    <del className="text-gray-300 text-xl">
                                        {formatPrice(originalPrice)}
                                    </del>
                                    <span className="w-10 h-7 rounded-full bg-prime text-white text-sm flex justify-center items-center">
                                        {discountBadgeText}
                                    </span>
                                </div>
                            )}

                        <div className="flex items-center gap-1">
                            <span className="text-2xl font-semibold">
                                {finalPrice !== null
                                    ? formatPrice(finalPrice)
                                    : "—"}
                            </span>
                            <span className="text-sm">تومان</span>
                        </div>
                    </>
                )}
            </div>

            {cartQty > 0 ? (
                <Link className="w-full" href="/checkout/cart">
                    <Button variant="outlined" className="w-full flex items-center gap-1">
                        در سبد شما، مشاهده سبد خرید
                    </Button>
                </Link>
            ) : (
                <Button
                    variant="contained"
                    className="w-full bg-prime text-white rounded-md py-3 text-center mt-3"
                    disabled={!isAvailable}
                    onClick={handleAddToCart}
                >
                    افزودن به سبد خرید
                </Button>
            )}
        </div>
    );
}