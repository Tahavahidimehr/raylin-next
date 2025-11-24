"use client";

import { Switch } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CategoryFilter from "@/components/general/CategoryFilter";
import { Category } from "@/types/types";

type ProductFilterProps = {
    pageName: "products" | "category";
    categories: Category[];
};

export default function ProductFilter({ pageName, categories }: ProductFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const isOnlyAvailableOn = searchParams.get("only_available") === "1";
    const isSpecialOfferOn = searchParams.get("special_offer") === "1";

    const updateParam = (key: string, value: boolean) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set(key, "1");
        } else {
            params.delete(key);
        }

        const queryString = params.toString();
        router.push(queryString ? `${pathname}?${queryString}` : pathname);
    };

    const handleClearFilters = () => {
        // پاک کردن همه پارامترهای فیلتر
        router.push(pathname);
    };

    return (
        <div className="w-[300px] min-h-[400px] rounded-md bg-white p-5 flex flex-col text-sm gap-2">
            <div className="w-full flex justify-between items-center mb-3">
                <span className="font-semibold">فیلترها</span>
                <button
                    className="text-prime cursor-pointer"
                    onClick={handleClearFilters}
                >
                    حذف فیلترها
                </button>
            </div>

            <hr className="text-gray-200" />

            <CategoryFilter
                type={pageName === "products" ? "checkbox" : "link"}
                categories={categories}
            />

            <hr className="text-gray-200" />

            <div className="w-full h-10 flex justify-between items-center">
                <span>محصولات موجود</span>
                <Switch
                    size="small"
                    color="primary"
                    className="-ml-2"
                    checked={isOnlyAvailableOn}
                    onChange={(e) => updateParam("only_available", e.target.checked)}
                />
            </div>

            <hr className="text-gray-200" />

            <div className="w-full h-10 flex justify-between items-center">
                <span>پیشنهاد ویژه</span>
                <Switch
                    size="small"
                    color="primary"
                    className="-ml-2"
                    checked={isSpecialOfferOn}
                    onChange={(e) => updateParam("special_offer", e.target.checked)}
                />
            </div>
        </div>
    );
}