"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";

type PaginationProps = {
    currentPage: number;
    lastPage: number;
};

export default function Pagination({ currentPage, lastPage }: PaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    if (lastPage <= 1) return null; // اگه فقط یه صفحه هست، هیچی نشون نده

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());

        if (page <= 1) {
            params.delete("page"); // صفحه ۱ → تمیز کردن URL
        } else {
            params.set("page", String(page));
        }

        const qs = params.toString();
        router.push(`${pathname}${qs ? `?${qs}` : ""}`);
    };

    const pages = Array.from({ length: lastPage }, (_, i) => i + 1);

    return (
        <div className="w-full flex justify-center items-center gap-2 mt-6 text-sm">
            <button
                type="button"
                onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={clsx(
                    "px-3 py-1 rounded-sm border",
                    currentPage === 1
                        ? "text-gray-400 border-gray-200 cursor-not-allowed"
                        : "text-text border-gray-300 hover:bg-gray-100"
                )}
            >
                قبلی
            </button>

            {pages.map((page) => (
                <button
                    key={page}
                    type="button"
                    onClick={() => goToPage(page)}
                    className={clsx(
                        "w-8 h-8 flex items-center justify-center rounded-sm border text-sm",
                        page === currentPage
                            ? "bg-prime text-white border-prime"
                            : "bg-white text-text border-gray-300 hover:bg-gray-100"
                    )}
                >
                    {page}
                </button>
            ))}

            <button
                type="button"
                onClick={() => currentPage < lastPage && goToPage(currentPage + 1)}
                disabled={currentPage === lastPage}
                className={clsx(
                    "px-3 py-1 rounded-sm border",
                    currentPage === lastPage
                        ? "text-gray-400 border-gray-200 cursor-not-allowed"
                        : "text-text border-gray-300 hover:bg-gray-100"
                )}
            >
                بعدی
            </button>
        </div>
    );
}