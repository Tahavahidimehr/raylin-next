import Link from "next/link";
import Image from "next/image";
import {Category} from "@/types/types";

export default function Categories({categories}: {categories: Category[] | null}) {
    if (!categories || !categories.length) return null;
    return (
        <>
            <div className="flex flex-col gap-5">
                <h2 className="text-center text-text text-2xl font-semibold">دسته بندی محصولات</h2>
                <p className="text-center text-text">دسته بندی مورد نظر خود را انتخاب کنید</p>
            </div>

            <div className="w-full grid grid-cols-4 gap-10 -mt-10">
                {
                    categories.map((category) => (
                        <Link href={`/categories/${category.slug}`} key={category.id} className="group flex flex-col justify-between items-center gap-2">
                            <Image
                                src={`${category.media?.[0].url}`}
                                alt="category image"
                                width={200}
                                height={200}
                                className="transition-all duration-500 ease-in-out hover:scale-110"
                            />
                            <span className="text-text font-semibold group-hover:text-second transition text-xl">{category.name}</span>
                        </Link>
                    ))
                }
            </div>
        </>
    )
}