"use client";

import { Minus, Plus } from "lucide-react";
import { NumericFormat } from "react-number-format";
import { TextField } from "@mui/material";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cartStore";

interface MiniProductCounterProps {
    item: any;
}

export default function MiniProductCounter({ item }: MiniProductCounterProps) {
    const { addItem, removeItem } = useCartStore();

    const isAvailable = item.product?.is_available;

    const maxQty = (() => {
        const variant = item.variant;
        const product = item.product;

        if (!product) return 1;

        if (variant) {
            const stock = Number(variant.total_stock) || 0;
            let max = stock > 0 ? stock : 1;

            if (variant.has_order_limit && Number(variant.order_limit) > 0) {
                max = Math.min(max, Number(variant.order_limit));
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

    const handleIncrease = () => {
        if (!isAvailable) return;

        if (item.quantity >= maxQty) {
            toast.error(`حداکثر تعداد قابل سفارش ${maxQty} عدد است`);
            return;
        }

        addItem(
            item.product_id,
            item.product_variant_id,
            1,
            item.product,
            item.variant
        );
    };

    const handleDecrease = () => {
        if (!isAvailable) return;

        if (item.quantity <= 1) {
            removeItem(item.product_id, item.product_variant_id);
            return;
        }

        addItem(
            item.product_id,
            item.product_variant_id,
            -1,
            item.product,
            item.variant
        );
    };

    return (
        <div className="w-[100px] h-[45px] border border-gray-200 rounded-md flex justify-between items-center gap-2 px-2">

            <span
                className={`h-full flex justify-center items-center ${
                    !isAvailable || item.quantity >= maxQty
                        ? "cursor-not-allowed opacity-40"
                        : "cursor-pointer"
                }`}
                onClick={handleIncrease}
            >
                <Plus className="size-4 text-text" />
            </span>

            <NumericFormat
                value={item.quantity}
                customInput={TextField}
                thousandSeparator=","
                allowNegative={false}
                variant="standard"
                InputProps={{ disableUnderline: true }}
                inputProps={{
                    readOnly: true,
                    style: {
                        textAlign: "center",
                        fontSize: "1rem",
                        fontWeight: "500",
                        background: "transparent",
                    },
                }}
            />

            <span
                className={`h-full flex justify-center items-center ${
                    !isAvailable ? "cursor-not-allowed opacity-40" : "cursor-pointer"
                }`}
                onClick={handleDecrease}
            >
                <Minus className="size-4 text-text" />
            </span>
        </div>
    );
}
