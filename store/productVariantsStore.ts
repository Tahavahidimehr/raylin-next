import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { Media, ProductVariant } from "@/types/types";

export interface VariantValue {
    id: number;
    value: string;
}

export interface Variant {
    id: number;
    name: string;
    values: VariantValue[];
    selectedValueIds: number[];
}

interface ProductVariantsState {
    variants: Variant[];
    productVariants: ProductVariant[];
    setVariants: (variants: Variant[]) => void;
    addVariant: (variant: Variant) => void;
    removeVariant: (id: number) => void;
    updateVariantValues: (variantId: number, values: VariantValue[]) => void;
    updateSelectedValues: (variantId: number, selectedIds: number[]) => void;
    generateProductVariants: () => void;
    updateProductVariant: (
        index: number,
        updated: ProductVariant | ((prev: ProductVariant) => ProductVariant)
    ) => void;
    addMediaToProductVariant: (index: number, media: Media[]) => void;
    setMainMedia: (index: number, path: string) => void;
    updateVariantId(oldId: string, newId: number): void;
    setDefaultVariant: (index: number) => void;
    reset: () => void;
}

export const useProductVariantsStore = create<ProductVariantsState>()(
    persist(
        (set, get) => ({
            variants: [],
            productVariants: [],

            setVariants: (variants) =>
                set({
                    variants: variants.map((v) => ({
                        ...v,
                        selectedValueIds: v.selectedValueIds || [],
                    })),
                }),

            addVariant: (variant) =>
                set((state) => ({
                    variants: [
                        ...state.variants,
                        { ...variant, selectedValueIds: variant.selectedValueIds || [] },
                    ],
                })),

            removeVariant: (id) =>
                set((state) => {
                    const updatedVariants = state.variants.filter((v) => v.id !== id);
                    const updatedProductVariants = state.productVariants.filter(
                        (pv) => !pv.combination.some((c) => c.variantId === id)
                    );
                    return {
                        variants: updatedVariants,
                        productVariants: updatedProductVariants,
                    };
                }),

            updateVariantValues: (variantId, values) =>
                set((state) => ({
                    variants: state.variants.map((v) =>
                        v.id === variantId ? { ...v, values } : v
                    ),
                })),

            updateSelectedValues: (variantId, selectedIds) =>
                set((state) => ({
                    variants: state.variants.map((v) =>
                        v.id === variantId ? { ...v, selectedValueIds: selectedIds } : v
                    ),
                })),

            generateProductVariants: () => {
                const { variants } = get();
                set({ productVariants: [] });

                const selectedVariants = variants.filter(
                    (v) => v.selectedValueIds.length > 0
                );
                if (selectedVariants.length === 0) return;

                const cartesian = (arr: VariantValue[][]): VariantValue[][] =>
                    arr.reduce<VariantValue[][]>(
                        (a, b) => a.flatMap((d) => b.map((e) => [...d, e])),
                        [[]]
                    );

                const valueArrays = selectedVariants.map((v) =>
                    v.values.filter((val) => v.selectedValueIds.includes(val.id))
                );

                const combinations = cartesian(valueArrays);

                const productVariants: ProductVariant[] = combinations.map((comb) => ({
                    id: uuidv4(),
                    price: null,
                    discount_type: "amount",
                    discount_amount: null,
                    discount_percentage: null,
                    need_preparation_time: true,
                    preparation_time: null,
                    has_order_limit: false,
                    order_limit: null,
                    is_default: false,
                    media: [],
                    combination: comb.map((val, idx) => ({
                        variantId: selectedVariants[idx].id,
                        valueId: val.id,
                        name: val.value,
                    })),
                }));

                set({ productVariants });
            },

            updateProductVariant: (index, updated) =>
                set((state) => {
                    const newList = [...state.productVariants];
                    if (typeof updated === "function") {
                        newList[index] = updated(state.productVariants[index]);
                    } else {
                        newList[index] = { ...state.productVariants[index], ...updated };
                    }
                    return { productVariants: newList };
                }),

            addMediaToProductVariant: (index, media) =>
                set((state) => {
                    const newList = [...state.productVariants];
                    newList[index] = { ...newList[index], media };
                    return { productVariants: newList };
                }),

            setMainMedia: (index, path) =>
                set((state) => {
                    const newList = [...state.productVariants];
                    newList[index] = {
                        ...newList[index],
                        media: newList[index].media.map((m) => ({
                            ...m,
                            is_main: m.path === path,
                        })),
                    };
                    return { productVariants: newList };
                }),

            updateVariantId: (oldId: string, newId: number) =>
                set((state) => ({
                    productVariants: state.productVariants.map((v) =>
                        v.id === oldId ? { ...v, id: newId } : v
                    ),
                })),

            setDefaultVariant: (index) =>
                set((state) => {
                    const targetId = state.productVariants[index]?.id;
                    if (!targetId) return state;
                    const updated = state.productVariants.map((pv) => ({
                        ...pv,
                        is_default: pv.id === targetId,
                    }));
                    return { productVariants: updated };
                }),

            reset: () => set({ variants: [], productVariants: [] }),
        }),
        {
            name: "product-variants-store",
        }
    )
);