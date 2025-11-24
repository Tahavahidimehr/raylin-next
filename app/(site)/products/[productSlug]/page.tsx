import Link from "next/link";
import {ChevronLeft, Dot, Image as ImageIcon} from "lucide-react";
import FeatureHighlights from "@/components/general/FeatureHighlights";
import Image from "next/image";
import SimilarProductsSlider from "@/components/product/SimilarProductsSlider";
import React from "react";
import ProductCounter from "@/components/product/ProductCounter";
import {apiClient} from "@/lib/apiClient";
import {Media} from "@/types/types";
import {notFound} from "next/navigation";
import ProductVariantSection from "@/components/general/ProductVariantSection";

export default async function Product({ params }: { params: Promise<{ productSlug: string }> }) {

    const { productSlug } = await params

    const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/site/products/${productSlug}`);

    const product = res.data.product;

    if (!product.id) notFound()

    const isAvailable = product.is_available;

    return (
        <div className="w-full flex flex-col justify-start items-start gap-10 pb-10 text-text">
            <div className="flex flex-col gap-7 mt-10">
                <div className="flex items-center gap-3 text-sm">
                    <Link href="/">فروشگاه مهرزار</Link>
                    <ChevronLeft className="size-4" />
                    <Link href={`/categories/${product.category.slug}`}>{product.category.name}</Link>
                    <ChevronLeft className="size-4" />
                    <span>{product.name}</span>
                </div>
            </div>
            <div className="w-full rounded-md flex justify-between items-start gap-7">
                <div className="w-1/3 flex flex-col gap-5">
                    <div className="w-full h-[400px] rounded-md">
                        <div className="w-full h-full relative rounded-md overflow-hidden">
                            {
                                product.media.find((item: Media) => item.is_main) ? (
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_API_URL}/${
                                            product.media.find((item: Media) => item.is_main)?.path
                                        }`}
                                        alt="product image"
                                        fill
                                        className="rounded-md object-cover transition-all duration-500 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex justify-center items-center border border-gray-300 rounded-md">
                                        <ImageIcon className="size-52 text-gray-200" />
                                    </div>
                                )
                            }
                        </div>
                    </div>

                    {
                        product.media.filter((item: Media) => !item.is_main).length > 0 && (
                            <div className="w-full flex justify-between items-center gap-5">
                                {
                                    product.media.filter((item: Media) => !item.is_main).map((item: Media) => (
                                        <div key={item.id} className="w-20 h-20 border border-gray-300 rounded-md p-1">
                                            <div className="w-full h-full relative rounded-md overflow-hidden">
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_API_URL}/${item.path}`}
                                                    alt="product image"
                                                    fill
                                                    className="rounded-md object-cover transition-all duration-500 group-hover:scale-110"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }
                </div>
                <div className="w-2/3 flex flex-col justify-start items-start gap-7">
                    <div className="w-full flex justify-between items-start gap-7">
                        <div className="w-full flex flex-col gap-5">
                            {
                                isAvailable ? (
                                    <h1 className="text-2xl font-semibold">{product.name}</h1>
                                ) : (
                                    <div className="flex items-center gap-3 bg-red-100/60 p-2 rounded-md">
                                        <span className="text-red-500 font-semibold text-xl">ناموجود</span>
                                        <h1 className="text-xl font-semibold">{product.name}</h1>
                                    </div>
                                )
                            }
                            <hr className="text-gray-300" />
                            <ProductVariantSection product={product} />
                            {/*<span className="font-semibold">ویژگی ها</span>*/}
                            {/*<ul className="w-full flex flex-col gap-4">*/}
                            {/*    <li className="flex items-center gap-2">*/}
                            {/*        <div className="flex items-center gap-0.5 text-gray-500">*/}
                            {/*            <Dot className="size-6" />*/}
                            {/*            <span>تاریخ انقضا</span>*/}
                            {/*            <span>:</span>*/}
                            {/*        </div>*/}
                            {/*        <span className="text-text">2 سال پس از تولید</span>*/}
                            {/*    </li>*/}
                            {/*    <li className="flex items-center gap-2">*/}
                            {/*        <div className="flex items-center gap-0.5 text-gray-500">*/}
                            {/*            <Dot className="size-6" />*/}
                            {/*            <span>بسته‌بندی</span>*/}
                            {/*            <span>:</span>*/}
                            {/*        </div>*/}
                            {/*        <span className="text-text">جعبه مقوایی مقاوم و بهداشتی</span>*/}
                            {/*    </li>*/}
                            {/*</ul>*/}
                        </div>
                        <ProductCounter product={product} />
                    </div>
                </div>
            </div>
            <SimilarProductsSlider products={null} />
            {/*<div className="w-full h-96 bg-white rounded-md"></div>*/}
            <FeatureHighlights />
        </div>
    )
}
