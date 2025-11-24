"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "@/lib/apiClient";
import {ShippingMethod} from "@/types/types";

/* -------------------------------------
   📌 Types
--------------------------------------*/
export interface CartItem {
    product_id: number;
    product_variant_id: number | null;
    quantity: number;

    unit_price: number;
    original_price: number;

    discount_type: "amount" | "percentage" | null;
    discount_value: number | null;

    product: any;
    variant: any;
}

interface GuestSyncResponseItem {
    product_id: number;
    variant_id: number | null;
    quantity: number;

    original_price: number;
    unit_price: number;

    discount_type: string | null;
    discount_value: number | null;

    product: any;
    variant: any;

    changes: string[];
}

interface ApiSyncResponse {
    success: boolean;
    message: string;
    data: { items: GuestSyncResponseItem[] };
    errors: any;
}

interface CartChange {
    item_id: number;
    variant_id: number | null;
    type: "updated" | "deleted";
    message: string;
}

interface CartStore {
    items: CartItem[];
    changes: CartChange[];
    loading: boolean;

    selectedAddress: any | null;
    selectedShippingMethod: ShippingMethod | null;

    setSelectedAddress: (address: any | null) => void;
    setSelectedShippingMethod: (method: ShippingMethod | null) => void;

    /* 💛 جدید */
    orderNote: string;
    setOrderNote: (note: string) => void;

    discountCode: any | null;
    setDiscountCode: (data: any | null) => void;

    addItem: (
        product_id: number,
        variant_id: number | null,
        quantity: number,
        product: any,
        variant: any
    ) => void;

    removeItem: (product_id: number, variant_id: number | null) => void;

    syncCart: () => Promise<void>;
}

function extractDiscount(variant: any, product: any) {
    const src = variant ?? product;

    const type = src.discount_type ?? null;

    let value = null;

    if (type === "amount") value = src.discount_amount ?? null;
    if (type === "percentage") value = src.discount_percentage ?? null;

    return { type, value };
}

/* -------------------------------------
   📌 Zustand Store (Final + Added Fields)
--------------------------------------*/
export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({

            items: [],
            changes: [],
            loading: false,

            selectedAddress: null,
            setSelectedAddress: (address) => set({ selectedAddress: address }),

            selectedShippingMethod: null,
            setSelectedShippingMethod: (method) => set({ selectedShippingMethod: method }),

            /* -------------------------------------
               💛 جدید: توضیح سفارش
            --------------------------------------*/
            orderNote: "",
            setOrderNote: (note) => set({ orderNote: note }),

            /* -------------------------------------
               💛 جدید: آبجکت کد تخفیف
            --------------------------------------*/
            discountCode: null,
            setDiscountCode: (data) => set({ discountCode: data }),

            /* ------------------------------
               ADD ITEM
            ------------------------------*/
            addItem: (product_id, variant_id, quantity, product, variant) => {
                const items = [...get().items];

                const exists = items.find(
                    (i) =>
                        i.product_id === product_id &&
                        i.product_variant_id === variant_id
                );

                if (exists) {
                    exists.quantity += quantity;

                    if (exists.quantity <= 0) {
                        return set({
                            items: items.filter(
                                (i) =>
                                    !(
                                        i.product_id === product_id &&
                                        i.product_variant_id === variant_id
                                    )
                            ),
                        });
                    }

                    return set({ items });
                }

                const src = variant ?? product;

                const original_price = src.original_price ?? src.price;
                const final_price = src.final_price;

                const { type, value } = extractDiscount(variant, product);

                items.push({
                    product_id,
                    product_variant_id: variant_id,
                    quantity,
                    unit_price: final_price,
                    original_price,
                    discount_type: type,
                    discount_value: value,
                    product,
                    variant,
                });

                set({ items });
            },

            /* ------------------------------
               REMOVE ITEM
            ------------------------------*/
            removeItem: (product_id, variant_id) => {
                const filtered = get().items.filter(
                    (i) =>
                        !(
                            i.product_id === product_id &&
                            i.product_variant_id === variant_id
                        )
                );
                set({ items: filtered });
            },

            /* ------------------------------
               SYNC
            ------------------------------*/
            syncCart: async () => {
                const items = get().items;
                if (!items.length) return;

                try {
                    set({ loading: true });

                    const response = await apiClient<ApiSyncResponse>(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/site/cart/sync`,
                        {
                            method: "POST",
                            body: {
                                items: items.map(i => ({
                                    product_id: i.product_id,
                                    variant_id: i.product_variant_id,
                                    quantity: i.quantity,
                                    unit_price: i.unit_price,
                                    original_price: i.original_price,
                                    discount_type: i.discount_type,
                                    discount_value: i.discount_value,
                                }))
                            },
                        }
                    );

                    const serverItems = response.data.items;

                    const synced: CartItem[] = [];
                    const changes: CartChange[] = [];

                    for (const item of serverItems) {

                        const original = items.find(
                            (g) =>
                                g.product_id === item.product_id &&
                                g.product_variant_id === item.variant_id
                        );

                        if (!original) continue;

                        if (item.quantity <= 0) {
                            changes.push({
                                item_id: item.product_id,
                                variant_id: item.variant_id,
                                type: "deleted",
                                message: "این کالا از سبد حذف شد",
                            });
                            continue;
                        }

                        synced.push({
                            ...original,
                            quantity: item.quantity,
                            unit_price: item.unit_price,
                            original_price: item.original_price,
                            discount_type: item.discount_type as any,
                            discount_value: item.discount_value,
                            product: item.product,
                            variant: item.variant,
                        });

                        item.changes.forEach(msg => {
                            changes.push({
                                item_id: item.product_id,
                                variant_id: item.variant_id,
                                type: "updated",
                                message: msg,
                            });
                        });
                    }

                    set({
                        items: synced,
                        changes,
                    });

                } catch (e) {
                    console.error("syncCart error:", e);
                } finally {
                    set({ loading: false });
                }
            },
        }),

        { name: "cart-storage" }
    )
);