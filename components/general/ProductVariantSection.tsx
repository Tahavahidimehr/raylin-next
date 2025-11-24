"use client";

import { useMemo, useState, useEffect } from "react";
import { Product, ProductVariant } from "@/types/types";
import { useProductVariantStore } from "@/store/productVariantStore";

interface Props {
    product: Product;
    onVariantChange?: (variant: ProductVariant | null) => void;
}

export default function ProductVariantSection({ product, onVariantChange }: Props) {
    if (product.type === "simple" || !product.variants || product.variants.length === 0) {
        return null;
    }

    const { setSelectedVariant, reset } = useProductVariantStore();

    // فقط واریانت‌های موجود
    const availableVariants = (product.variants as ProductVariant[]).filter(
        (v) => v.is_available
    );

    if (availableVariants.length === 0) {
        return null;
    }

    // سورت بر اساس ارزان‌ترین قیمت (final_price → price)
    const variants = useMemo(
        () =>
            [...availableVariants].sort((a, b) => {
                const aPrice = (a as any).final_price ?? a.price ?? Number.MAX_SAFE_INTEGER;
                const bPrice = (b as any).final_price ?? b.price ?? Number.MAX_SAFE_INTEGER;
                return aPrice - bPrice;
            }),
        [availableVariants]
    );

    const defaultVariant = variants[0];

    const [selectedVariantId, setSelectedVariantId] = useState<string | number>(
        defaultVariant.id
    );

    const selectedVariant = useMemo(
        () => variants.find((v) => v.id === selectedVariantId) ?? defaultVariant,
        [variants, selectedVariantId, defaultVariant]
    );

    useEffect(() => {
        setSelectedVariant(selectedVariant ?? null);

        if (onVariantChange) {
            onVariantChange(selectedVariant ?? null);
        }

        return () => {
            reset();
        };
    }, [selectedVariant, onVariantChange, setSelectedVariant, reset]);

    // 🔹 متن عنوان بالا: مثلا "رنگ: قرمز"
    const headerLabel = useMemo(() => {
        const v: any = selectedVariant;
        const vvList = v?.variant_values ?? v?.combination ?? [];

        if (vvList && vvList.length > 0) {
            // اگر variant_values از بک‌اند اومده باشد:
            const groupName = vvList[0]?.variant?.name ?? "گزینه";
            const valueText = vvList
                .map((vv: any) => vv.value ?? vv.name ?? "")
                .filter(Boolean)
                .join(" - ");

            if (valueText) {
                return `${groupName}: ${valueText}`;
            }
        }

        return "انتخاب گزینه";
    }, [selectedVariant]);

    // 🔹 متن روی دکمه‌ها: فقط مقدار واقعی (مثلا "قرمز")
    const getVariantLabel = (variant: ProductVariant) => {
        const v: any = variant;

        // اگر از بک‌اند variant_values داریم
        if (v.variant_values && Array.isArray(v.variant_values) && v.variant_values.length > 0) {
            return v.variant_values
                .map((vv: any) => vv.value ?? "")
                .filter(Boolean)
                .join(" - ");
        }

        //fallback قدیمی (اگر combination داشته باشی)
        if (v.combination && Array.isArray(v.combination) && v.combination.length > 0) {
            return v.combination
                .map((c: any) => c.name ?? "")
                .filter(Boolean)
                .join(" - ");
        }

        return `گزینه ${variant.id}`;
    };

    return (
        <div className="flex flex-col gap-5 mt-2">
            {/* ✅ فقط متن عوض شد، کلاس همون موند */}
            <span className="font-semibold">
                {headerLabel}
            </span>

            <div className="flex flex-wrap gap-2">
                {variants.map((variant) => {
                    const isSelected = selectedVariantId === variant.id;
                    const label = getVariantLabel(variant);

                    return (
                        <button
                            key={variant.id}
                            type="button"
                            onClick={() => setSelectedVariantId(variant.id)}
                            className={[
                                "px-4 py-1.5 rounded-sm border text-sm transition",
                                isSelected
                                    ? "border-prime bg-prime text-white"
                                    : "border-gray-300 bg-white text-text",
                            ].join(" ")}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}