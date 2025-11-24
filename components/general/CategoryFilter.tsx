"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { Checkbox } from "@mui/material";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Category = {
    id: number;
    name: string;
    slug: string;
};

export default function CategoryFilter({
                                           type,
                                           categories,
                                       }: {
    type: "link" | "checkbox";
    categories: Category[];
}) {
    const [open, setOpen] = useState(false);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // multi select: از category_ids[] می‌خوانیم
    const selectedCategoryIds = searchParams.getAll("category_ids[]"); // ['1','2',...]

    const handleCheckboxChange = (id: number, checked: boolean) => {
        const params = new URLSearchParams(searchParams.toString());
        const key = "category_ids[]";

        const current = params.getAll(key); // ['1','2',...]

        let next: string[];

        if (checked) {
            if (!current.includes(String(id))) {
                next = [...current, String(id)];
            } else {
                next = current;
            }
        } else {
            next = current.filter((val) => val !== String(id));
        }

        params.delete(key);
        next.forEach((val) => params.append(key, val));

        const qs = params.toString();
        router.push(`${pathname}${qs ? `?${qs}` : ""}`);
    };

    return (
        <div className="w-full">
            <button
                onClick={() => setOpen(!open)}
                className="w-full h-10 flex justify-between items-center text-right cursor-pointer"
            >
                <span className="font-medium">دسته‌بندی‌ها</span>
                <ChevronDown
                    className={clsx(
                        "size-4 transition-transform duration-300",
                        open && "rotate-180"
                    )}
                />
            </button>

            <div
                className={clsx(
                    "overflow-hidden transition-[max-height] duration-500 ease-in-out",
                    open ? "max-h-96" : "max-h-0"
                )}
            >
                <div className="w-full rounded-md my-2">
                    <ul className="w-full flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
                        {categories.map((category) =>
                            type === "checkbox" ? (
                                <li
                                    key={category.id}
                                    className="w-full flex justify-between items-center pr-2"
                                >
                                    <span>{category.name}</span>
                                    <Checkbox
                                        size="small"
                                        checked={selectedCategoryIds.includes(
                                            String(category.id)
                                        )}
                                        onChange={(e) =>
                                            handleCheckboxChange(
                                                category.id,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </li>
                            ) : (
                                <li
                                    key={category.id}
                                    className="w-full flex justify-between items-center pr-2"
                                >
                                    <Link
                                        href={`/categories/${category.slug}`}
                                        className="hover:text-prime transition-colors"
                                    >
                                        {category.name}
                                    </Link>
                                </li>
                            )
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}