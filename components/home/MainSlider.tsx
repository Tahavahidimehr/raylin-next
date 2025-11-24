"use client"

import {Swiper, SwiperSlide} from "swiper/react";
import Image from "next/image";

export default function MainSlider() {
    return (
        <Swiper
            spaceBetween={20}
            slidesPerView={1}
            className="mt-10 rounded-md"
        >
            <SwiperSlide className="rounded-md bg-white overflow-hidden">
                <div className="relative w-full h-[500px]">
                    <Image
                        src="/images/mainBanner.png"
                        alt="main banner"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 1280px"
                    />
                </div>
            </SwiperSlide>
        </Swiper>
    )
}