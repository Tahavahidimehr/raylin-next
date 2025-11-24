import { create } from "zustand";

export interface SelectedAttributeValue {
    attribute_id: number;
    attribute_name: string;
    value_id: number;
    value: string;
}

interface ProductAttributesState {
    selectedAttributes: SelectedAttributeValue[];
    addOrUpdateAttribute: (attr: SelectedAttributeValue) => void;
    removeAttribute: (attribute_id: number) => void;
    reset: () => void;
}

export const useProductAttributesStore = create<ProductAttributesState>((set) => ({
    selectedAttributes: [],

    addOrUpdateAttribute: (attr) =>
        set((state) => {
            const existsIndex = state.selectedAttributes.findIndex(
                (a) => a.attribute_id === attr.attribute_id
            );
            if (existsIndex > -1) {
                const newArr = [...state.selectedAttributes];
                newArr[existsIndex] = attr;
                return { selectedAttributes: newArr };
            }
            return { selectedAttributes: [...state.selectedAttributes, attr] };
        }),

    removeAttribute: (attribute_id) =>
        set((state) => ({
            selectedAttributes: state.selectedAttributes.filter(a => a.attribute_id !== attribute_id)
        })),

    reset: () => set({ selectedAttributes: [] })
}));