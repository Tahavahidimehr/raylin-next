import SpecialOfferProductsSlider from "@/components/home/SpecialOfferProductsSlider";
import PopularProductsSlider from "@/components/home/PopularProductsSlider";
import Categories from "@/components/home/Categories";
import MainSlider from "@/components/home/MainSlider";
import LastPublishedArticles from "@/components/home/LastPublishedArticles";
import FeatureHighlights from "@/components/general/FeatureHighlights";
import Image from "next/image";
import {apiClient} from "@/lib/apiClient";

export default async function Home() {

    const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/home`);

    return (
      <div className="space-y-20 pb-20">
        <MainSlider />
        <Categories categories={res.data.categories} />
        <SpecialOfferProductsSlider products={res.data.specialProducts} />
        <div className="w-full grid grid-cols-2 grid-rows-2 gap-5">
            {
                [1, 2, 3, 4].map((_: number) => (
                    <div key={_} className="relative w-full h-[260px] rounded-md bg-white">
                        <Image
                            src="/images/mainBanner.png"
                            alt="main banner"
                            fill
                            className="object-cover rounded-md"
                            sizes="(max-width: 768px) 100vw, 1280px"
                        />
                    </div>
                ))
            }
        </div>
        <PopularProductsSlider products={res.data.popularProducts} />
        {/*<div className="w-full h-[145px] rounded-md bg-white"></div>*/}
        {/*<LastPublishedArticles />*/}
        <FeatureHighlights />
      </div>
    );
}
