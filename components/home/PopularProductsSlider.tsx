"use client"

import {ChevronLeft, ChevronRight} from "lucide-react";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Navigation} from "swiper/modules";
import ProductCard from "@/components/general/ProductCard";
import {Product} from "@/types/types";

export default function PopularProductsSlider({products}: {products: Product[]}) {
    if (!products || !products.length) return null;
    return(
        <div className="w-full mt-20">
            <div className="w-full flex justify-between items-center">
                <h2 className="text-text text-2xl font-semibold">محبوب ترین ها</h2>
                <div className="flex items-center gap-5">
                    <button className="prevPopular w-9 h-9 cursor-pointer hover:bg-prime transition group border text-text rounded bg-white flex justify-center items-center disabled:opacity-40 disabled:cursor-not-allowed">
                        <ChevronRight className="size-6 text-text group-hover:text-white" />
                    </button>
                    <button className="nextPopular w-9 h-9 cursor-pointer hover:bg-prime transition group border text-text rounded bg-white flex justify-center items-center disabled:opacity-40 disabled:cursor-not-allowed">
                        <ChevronLeft className="size-6 text-text group-hover:text-white" />
                    </button>
                </div>
            </div>
            <div className="mt-10">
                <Swiper
                    modules={[Navigation, Autoplay]}
                    navigation={{
                        nextEl: ".nextPopular",
                        prevEl: ".prevPopular",
                        disabledClass: "swiper-button-disabled",
                    }}
                    // autoplay={{
                    //     delay: 6000,
                    //     disableOnInteraction: true,
                    // }}
                    watchOverflow={true}
                    spaceBetween={20}
                    slidesPerView={4}
                    onSwiper={(swiper) => {
                        const updateButtons = () => {
                            const prev = document.querySelector(".prevPopular");
                            const next = document.querySelector(".nextPopular");
                            if (prev && next) {
                                if (swiper.isBeginning) prev.setAttribute("disabled", "true");
                                else prev.removeAttribute("disabled");

                                if (swiper.isEnd) next.setAttribute("disabled", "true");
                                else next.removeAttribute("disabled");
                            }
                        };
                        updateButtons();

                        (swiper as any).updateButtons = updateButtons;
                    }}
                    onSlideChange={(swiper) => (swiper as any).updateButtons?.()}
                    className="rounded-md"
                >
                    {
                        products.map((product: Product) => (
                            <SwiperSlide key={product.id}>
                                <ProductCard product={product} />
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>
        </div>
    )
}