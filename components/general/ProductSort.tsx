"use client";

import { ArrowDownWideNarrow } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";

export default function ProductSort({ productsCount }: { productsCount: number }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentSort = searchParams.get("sort") || "popular";

    const updateSort = (sort: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", sort);

        const queryString = params.toString();
        router.push(queryString ? `${pathname}?${queryString}` : pathname);
    };

    const sortItemClass = (value: string) =>
        clsx(
            "px-4 py-2 rounded-md cursor-pointer",
            currentSort === value && "bg-prime text-white"
        );

    return (
        <div className="w-full h-16 rounded-md bg-white flex justify-between items-center gap-5 px-5 text-sm">
            <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                    <ArrowDownWideNarrow className="size-6" />
                    <span>مرتب سازی:</span>
                </div>

                <button
                    type="button"
                    className={sortItemClass("popular")}
                    onClick={() => updateSort("popular")}
                >
                    محبوب ترین
                </button>

                <button
                    type="button"
                    className={sortItemClass("newest")}
                    onClick={() => updateSort("newest")}
                >
                    جدید ترین
                </button>

                <button
                    type="button"
                    className={sortItemClass("expensive")}
                    onClick={() => updateSort("expensive")}
                >
                    گران ترین
                </button>

                <button
                    type="button"
                    className={sortItemClass("cheap")}
                    onClick={() => updateSort("cheap")}
                >
                    ارزان ترین
                </button>
            </div>

            <span>{productsCount} محصول</span>
        </div>
    );
}