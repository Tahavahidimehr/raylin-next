import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import ProductListingSection from "@/components/general/ProductListingSection";
import { Product, Category } from "@/types/types";

type CategoryPageProps = {
    params: Promise<{ categorySlug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

type CategoryApiResponse = {
    success: boolean;
    message: string;
    data: {
        products: {
            data: Product[];
            total: number;
            current_page: number;
            last_page: number;
        };
        categories: Category[];
        category: Category;
    };
    errors: any;
};

export default async function CategoryPage(props: CategoryPageProps) {
    const { categorySlug } = await props.params;
    const resolvedSearchParams = await props.searchParams;

    // Build URL query params
    const paramsObj = new URLSearchParams();

    for (const [key, value] of Object.entries(resolvedSearchParams || {})) {
        if (Array.isArray(value)) {
            for (const v of value) {
                if (typeof v === "string") paramsObj.append(key, v);
            }
        } else if (typeof value === "string") {
            paramsObj.set(key, value);
        }
    }

    const queryString = paramsObj.toString();

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/site/categories/${categorySlug}/products${
        queryString ? `?${queryString}` : ""
    }`;

    const res = await apiClient<CategoryApiResponse>(url);

    const productsPagination = res.data.products;

    return (
        <div className="w-full flex flex-col justify-start items-start gap-10 pb-10 text-text">
            <div className="flex flex-col gap-7 mt-10">
                <h1 className="text-3xl font-semibold">{res.data.category.name}</h1>
                <div className="flex items-center gap-3 text-sm">
                    <Link href="/">فروشگاه مهرزار</Link>
                    <ChevronLeft className="size-4" />
                    <span>{res.data.category.name}</span>
                </div>
            </div>

            <ProductListingSection
                pageName="category"
                products={productsPagination.data}
                total={productsPagination.total}
                categories={res.data.categories}
                currentPage={productsPagination.current_page}
                lastPage={productsPagination.last_page}
            />
        </div>
    );
}