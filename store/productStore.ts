import {create} from "zustand";
import {Product} from "@/types/types";

interface ProductStoreActions extends Product {
    setField: <K extends keyof Product>(field: K, value: Product[K]) => void;
    setType: (type: 'simple' | 'variable') => void;
    syncTypeWithVariants: (variantCount: number) => void;
    setProductId: (id: number) => void;
    reset: () => void;
}

export const initialState: Product = {
    id: null,
    name: '',
    slug: '',
    type: 'simple',
    price: null,
    category_id: null,
    discount_type: 'amount',
    discount_amount: null,
    discount_percentage: null,
    special_offer: false,
    need_preparation_time: true,
    preparation_time: null,
    weight_unit: 'g',
    weight: null,
    description: '',
    has_order_limit: false,
    order_limit: null,
    media: []
};

const useProductStore = create<ProductStoreActions>((set) => ({
    ...initialState,

    setField: (field, value) => set((state) => ({
        ...state,
        [field]: value,
    })),

    setType: (type) => set({ type }),

    syncTypeWithVariants: (variantCount) => {
        set({ type: variantCount > 0 ? 'variable' : 'simple' });
    },

    setProductId: (id) => set({ id }),

    reset: () => set({ ...initialState }),
}));

export default useProductStore;