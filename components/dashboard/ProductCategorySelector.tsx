"use client";

import React, { useEffect, useState, useRef } from "react";
import { Paper, TextField, Radio, FormControlLabel } from "@mui/material";
import { apiClient, ApiError } from "@/lib/apiClient";
import { Category } from "@/types/types";

interface ProductCategorySelectorProps {
    selectedCategory: number | null;
    onSelect: (id: number) => void;
}

const ProductCategorySelector: React.FC<ProductCategorySelectorProps> = ({
                                                                             selectedCategory,
                                                                             onSelect,
                                                                         }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [showCategorySelectBox, setShowCategorySelectBox] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const fetchCategories = async () => {
        try {
            const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
                withCredentials: true,
            });
            setCategories(res.data);
        } catch (err) {
            const error = err as ApiError;
            alert(error.message || "خطایی رخ داده است");
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowCategorySelectBox(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const buildCategoryTree = (flatCategories: Category[]): Category[] => {
        const map = new Map<number, Category>();
        const roots: Category[] = [];
        flatCategories.forEach((cat) => map.set(cat.id, { ...cat, children: [] }));
        map.forEach((cat) => {
            if (cat.parent_id) {
                const parent = map.get(cat.parent_id);
                if (parent) parent.children!.push(cat);
            } else {
                roots.push(cat);
            }
        });
        return roots;
    };

    const rootCategories = buildCategoryTree(categories);

    const CategoryRadioGroup: React.FC<{ categories: Category[]; level?: number }> = ({
              categories,
              level = 0,
          }) => {
        return (
            <div className="w-full flex flex-col">
                {categories.map((category) => (
                    <div key={category.id} className="flex flex-col">
                        <FormControlLabel
                            value={category.id}
                            control={<Radio />}
                            checked={selectedCategory === category.id}
                            onChange={() => {
                                onSelect(category.id);
                                setShowCategorySelectBox(false);
                            }}
                            label={category.name}
                            sx={{ pl: `${level * 2}rem` }}
                        />

                        {category.children && category.children.length > 0 && (
                            <CategoryRadioGroup categories={category.children} level={level + 1} />
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <TextField
                onClick={() => setShowCategorySelectBox(true)}
                value={
                    selectedCategory
                        ? categories.find((c) => c.id === selectedCategory)?.name || ""
                        : ""
                }
                label="دسته بندی"
                variant="outlined"
                fullWidth
                inputProps={{ readOnly: true }}
            />
            {showCategorySelectBox && (
                <Paper
                    className="absolute top-16 right-0 w-full z-20 px-3 py-2"
                    sx={{
                        width: "100%",
                        maxHeight: 220,
                        overflowY: "auto",
                        backgroundColor: "#fff",
                        boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                        "&::-webkit-scrollbar": { display: "none" },
                        msOverflowStyle: "none",
                        scrollbarWidth: "none",
                    }}
                >
                    <CategoryRadioGroup categories={rootCategories} />
                </Paper>
            )}
        </div>
    );
};

export default ProductCategorySelector;