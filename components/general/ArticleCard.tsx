import Link from "next/link";
import Image from "next/image";
import {Calendar} from "lucide-react";

export default function ArticleCard() {
    return (
        <Link href="/"
              className="h-[400px] rounded-md bg-white shadow-sm text-text flex flex-col justify-between gap-5 p-5 group"
        >
            <div className="w-full flex flex-col gap-5">
                <div className="w-full h-60 relative rounded-md overflow-hidden">
                    <Image
                        src="/images/product1.png"
                        alt="product image"
                        fill
                        className="rounded-md object-cover transition-all duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                <h3 className="text-text">چگونه زعفران تقلبی را از زعفران اصل تشخیص بدهیم؟</h3>
            </div>
            <div className="w-full flex flex-col justify-end items-end text-text">
                <div className="flex items-center gap-1 text-sm">
                    <span>18:10 - 17 شهریور 1404</span>
                    <Calendar className="size-4" />
                </div>
            </div>
        </Link>
    )
}