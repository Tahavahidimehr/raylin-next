import Image from "next/image";
import Link from "next/link";
import { Media, Product } from "@/types/types";
import { getProductPricing, formatPrice } from "@/utils/getProductPricing";
import { Image as ImageIcon } from "lucide-react";

export default function ProductCard({ product }: { product: Product | null }) {
    if (!product) return null;

    const {
        hasDiscount,
        originalPrice,
        finalPrice,
        discountBadgeText,
    } = getProductPricing(product);

    const isAvailable = product.is_available;

    return (
        <Link
            href={`/products/${product.slug}`}
            className="h-[440px] rounded-md bg-white shadow-sm text-text flex flex-col justify-between gap-5 p-5 group"
        >
            <div className="w-full flex flex-col gap-5">
                <div className="w-full h-60 relative rounded-md overflow-hidden">
                    {product.media?.length > 0 ? (
                        <Image
                            src={`${product.media.find(
                                (item: Media) => item.is_main
                            )?.url}`}
                            alt="product image"
                            fill
                            className="rounded-md object-cover transition-all duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-100 flex justify-center items-center">
                            <ImageIcon className="size-28 text-gray-200" />
                        </div>
                    )}
                </div>
                <h3 className="text-text font-semibold group-hover:text-second transition">
                    {product.name}
                </h3>
            </div>

            {/* قیمت */}
            <div className="w-full flex flex-col justify-end items-end text-text gap-1">
                {!isAvailable ? (
                    <span className="font-semibold text-gray-400">
                        ناموجود
                    </span>
                ) : (
                    <>
                        {hasDiscount && originalPrice !== null && discountBadgeText && (
                            <div className="w-full flex justify-end items-center gap-3">
                                <del className="text-gray-300 text-xl">
                                    {formatPrice(originalPrice)}
                                </del>
                                <span className="w-10 h-7 rounded-full bg-prime text-white text-sm flex justify-center items-center">
                                    {discountBadgeText}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center gap-1">
                            <span className="text-2xl font-semibold">
                                {finalPrice !== null ? formatPrice(finalPrice) : "—"}
                            </span>
                            <span className="text-sm">تومان</span>
                        </div>
                    </>
                )}
            </div>
        </Link>
    );
}