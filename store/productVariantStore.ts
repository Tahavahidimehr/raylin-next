import { create } from "zustand";
import { ProductVariant } from "@/types/types";

interface ProductVariantState {
    selectedVariant: ProductVariant | null;
    setSelectedVariant: (variant: ProductVariant | null) => void;
    reset: () => void;
}

export const useProductVariantStore = create<ProductVariantState>((set) => ({
    selectedVariant: null,
    setSelectedVariant: (variant) => set({ selectedVariant: variant }),
    reset: () => set({ selectedVariant: null }),
}));
