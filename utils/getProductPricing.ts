// src/utils/getProductPricing.ts

import { Product, ProductVariant } from "@/types/types";

export interface PricingResult {
    hasDiscount: boolean;
    originalPrice: number | null;
    finalPrice: number | null;
    discountPercent: number | null;
    discountBadgeText: string | null;
}

// فقط برای نمایش عدد قشنگ
export function formatPrice(value: number | null) {
    if (value == null) return "";
    return value.toLocaleString("fa-IR");
}

/**
 * قیمت نماینده‌ی خود Product (برای کارت‌ها، لیست‌ها)
 */
export function getProductPricing(product: Product | null): PricingResult {
    if (!product) {
        return {
            hasDiscount: false,
            originalPrice: null,
            finalPrice: null,
            discountPercent: null,
            discountBadgeText: null,
        };
    }

    const finalPrice = product.final_price ?? product.price ?? null;
    const originalPrice =
        product.original_price ??
        product.price ??
        finalPrice;

    if (finalPrice == null && originalPrice == null) {
        return {
            hasDiscount: false,
            originalPrice: null,
            finalPrice: null,
            discountPercent: null,
            discountBadgeText: null,
        };
    }

    let hasDiscount = false;
    let discountPercent: number | null = null;

    if (
        finalPrice !== null &&
        originalPrice !== null &&
        finalPrice < originalPrice
    ) {
        hasDiscount = true;

        if (
            typeof product.discount_percent_for_badge === "number" &&
            product.discount_percent_for_badge > 0
        ) {
            discountPercent = product.discount_percent_for_badge;
        } else {
            const diff = originalPrice - finalPrice;
            discountPercent = Math.round((diff / originalPrice) * 100);
        }
    }

    const discountBadgeText =
        hasDiscount && discountPercent !== null ? `${discountPercent}%` : null;

    return {
        hasDiscount,
        originalPrice: originalPrice ?? null,
        finalPrice: finalPrice ?? null,
        discountPercent,
        discountBadgeText,
    };
}

/**
 * قیمت هر Variant (برای صفحه‌ی دیتیل و انتخاب واریانت)
 */
export function getVariantPricing(variant: ProductVariant | null): PricingResult {
    if (!variant) {
        return {
            hasDiscount: false,
            originalPrice: null,
            finalPrice: null,
            discountPercent: null,
            discountBadgeText: null,
        };
    }

    const finalPrice = variant.final_price ?? variant.price ?? null;
    const originalPrice =
        variant.original_price ??
        variant.price ??
        finalPrice;

    if (finalPrice == null && originalPrice == null) {
        return {
            hasDiscount: false,
            originalPrice: null,
            finalPrice: null,
            discountPercent: null,
            discountBadgeText: null,
        };
    }

    let hasDiscount = false;
    let discountPercent: number | null = null;

    if (
        finalPrice !== null &&
        originalPrice !== null &&
        finalPrice < originalPrice
    ) {
        hasDiscount = true;

        if (
            typeof (variant as any).discount_percent_for_badge === "number" &&
            (variant as any).discount_percent_for_badge > 0
        ) {
            discountPercent = (variant as any).discount_percent_for_badge;
        } else {
            const diff = originalPrice - finalPrice;
            discountPercent = Math.round((diff / originalPrice) * 100);
        }
    }

    const discountBadgeText =
        hasDiscount && discountPercent !== null ? `${discountPercent}%` : null;

    return {
        hasDiscount,
        originalPrice: originalPrice ?? null,
        finalPrice: finalPrice ?? null,
        discountPercent,
        discountBadgeText,
    };
}
