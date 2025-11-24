import ProductFilter from "@/components/general/ProductFilter";
import ProductSort from "@/components/general/ProductSort";
import FeatureHighlights from "@/components/general/FeatureHighlights";
import ProductCard from "@/components/general/ProductCard";
import { ScrollText } from "lucide-react";
import { Product, Category } from "@/types/types";
import Pagination from "@/components/general/Pagination";

interface Props {
    pageName: "products" | "category";
    products: Product[];
    total: number;
    categories: Category[];
    currentPage: number;
    lastPage: number;
}

export default function ProductListingSection({
          pageName,
          products,
          total,
          categories,
          currentPage,
          lastPage,
      }: Props) {
    return (
        <>
            <div className="w-full flex justify-between items-start gap-5">
                <ProductFilter pageName={pageName} categories={categories} />

                <div className="w-full flex flex-col justify-start items-start gap-5">
                    <ProductSort productsCount={total} />

                    {products.length ? (
                        <>
                            <div className="w-full grid grid-cols-3 gap-5">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            <Pagination
                                currentPage={currentPage}
                                lastPage={lastPage}
                            />
                        </>
                    ) : (
                        <div className="w-full h-96 flex flex-col justify-center items-center gap-3">
                            <ScrollText className="size-16 text-gray-300" />
                            <p className="text-gray-500">
                                محصولی با این مشخصات پیدا نشد
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="w-full flex flex-col gap-5 text-gray-500 border-y py-10 border-gray-200">
                <h1 className="text-xl font-semibold">نام دسته بندی</h1>
                <p>
                    توضیحات مربوطه به دسته بندی توضیحات مربوطه به دسته بندی توضیحات
                    مربوطه به دسته بندی توضیحات مربوطه به دسته بندی
                </p>
            </div>

            <FeatureHighlights />
        </>
    );
}