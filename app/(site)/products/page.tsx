import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import ProductListingSection from "@/components/general/ProductListingSection";
import { Product, Category } from "@/types/types";

type ProductsPageProps = {
    searchParams: Promise<{ [key: string]: string | string[] }>;
};

type ProductsApiResponse = {
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
    };
    errors: any;
};

export default async function Products({ searchParams }: ProductsPageProps) {

    const resolvedSearchParams = await searchParams;

    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(resolvedSearchParams)) {
        if (Array.isArray(value)) {
            value.forEach((v) => {
                if (typeof v === "string") {
                    params.append(key, v);
                }
            });
        } else if (typeof value === "string") {
            params.set(key, value);
        }
    }

    const queryString = params.toString();

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/site/products${
        queryString ? `?${queryString}` : ""
    }`;

    const res = await apiClient<ProductsApiResponse>(url);

    const productsPagination = res.data.products;
    const products = productsPagination.data;
    const total = productsPagination.total;
    const currentPage = productsPagination.current_page;
    const lastPage = productsPagination.last_page;
    const categories = res.data.categories;

    return (
        <div className="w-full flex flex-col justify-start items-start gap-10 pb-10 text-text">
            <div className="flex flex-col gap-7 mt-10">
                <h1 className="text-3xl font-semibold">محصولات</h1>
                <div className="flex items-center gap-3 text-sm">
                    <Link href="/">فروشگاه مهرزار</Link>
                    <ChevronLeft className="size-4" />
                    <span>محصولات</span>
                </div>
            </div>

            <ProductListingSection
                pageName="products"
                products={products}
                total={total}
                categories={categories}
                currentPage={currentPage}
                lastPage={lastPage}
            />
        </div>
    );
}