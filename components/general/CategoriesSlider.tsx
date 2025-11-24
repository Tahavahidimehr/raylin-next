"use client"

import {Autoplay, Navigation} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";
import {ChevronLeft, ChevronRight} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {Category} from "@/types/types";

export default function CategoriesSlider({categories}: { categories: Category[] | null }) {
    if (!categories || !categories.length) return null;
    return (
        <div className="w-full relative px-14 py-5 bg-white rounded-md">
            <Swiper
                modules={[Navigation, Autoplay]}
                navigation={{
                    nextEl: ".nextCategories",
                    prevEl: ".prevCategories",
                    disabledClass: "swiper-button-disabled",
                }}
                watchOverflow={true}
                spaceBetween={20}
                slidesPerView={6}
                onSwiper={(swiper) => {
                    const updateButtons = () => {
                        const prev = document.querySelector(".prevCategories");
                        const next = document.querySelector(".nextCategories");
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
                    categories.map((category) => (
                        <SwiperSlide key={category.id}>
                            <Link href={`/categories/${category.slug}`} className="group flex flex-col justify-between items-center gap-2">
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_API_URL}/${category.media?.[0].path}`}
                                    alt="category image"
                                    width={200}
                                    height={200}
                                    className="transition-all duration-500 ease-in-out hover:scale-110"
                                />
                                <span className="text-text font-semibold group-hover:text-second transition text-xl">{category.name}</span>
                            </Link>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
            <button className="prevCategories absolute top-28 right-3 w-9 h-9 cursor-pointer hover:bg-prime transition group border text-text rounded bg-white flex justify-center items-center disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronRight className="size-6 text-text group-hover:text-white" />
            </button>
            <button className="nextCategories absolute top-28 left-3 w-9 h-9 cursor-pointer hover:bg-prime transition group border text-text rounded bg-white flex justify-center items-center disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronLeft className="size-6 text-text group-hover:text-white" />
            </button>
        </div>
    )
}