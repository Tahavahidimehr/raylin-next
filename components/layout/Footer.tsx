import Image from "next/image";
import {Mail, Phone} from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto flex flex-col justify-center items-center py-10 gap-10">
                <div className="w-full h-20 flex justify-between items-center">
                    <div className="relative w-24 h-24">
                        <Image
                            src="/images/logo.png"
                            alt="logo"
                            fill
                            className="object-contain mt-2"
                            sizes="(max-width: 768px) 6rem, 8rem"
                            priority
                        />
                    </div>
                    <div className="flex items-center gap-5">
                        <span className="text-text text-sm">با ما همراه باشید</span>
                        <div className="flex items-center gap-5">
                            <svg className="size-8 fill-prime" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
                            </svg>
                            <svg className="size-8 fill-prime" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
                                <path d="M248,8C111.033,8,0,119.033,0,256S111.033,504,248,504,496,392.967,496,256,384.967,8,248,8ZM362.952,176.66c-3.732,39.215-19.881,134.378-28.1,178.3-3.476,18.584-10.322,24.816-16.948,25.425-14.4,1.326-25.338-9.517-39.287-18.661-21.827-14.308-34.158-23.215-55.346-37.177-24.485-16.135-8.612-25,5.342-39.5,3.652-3.793,67.107-61.51,68.335-66.746.153-.655.3-3.1-1.154-4.384s-3.59-.849-5.135-.5q-3.283.746-104.608,69.142-14.845,10.194-26.894,9.934c-8.855-.191-25.888-5.006-38.551-9.123-15.531-5.048-27.875-7.717-26.8-16.291q.84-6.7,18.45-13.7,108.446-47.248,144.628-62.3c68.872-28.647,83.183-33.623,92.511-33.789,2.052-.034,6.639.474,9.61,2.885a10.452,10.452,0,0,1,3.53,6.716A43.765,43.765,0,0,1,362.952,176.66Z"/>
                            </svg>
                            <svg className="size-8 fill-prime" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-20">
                    <div className="flex flex-col gap-5">
                        <p className="text-text text-justify leading-8 text-sm">
                            رایلین از دل عشق به زیبایی، ظرافت و درخشش جزئیات کوچک روزمره متولد شد.
                            ما باور داریم یک اکسسوری کوچک می‌تواند حال‌وهوای یک روز، یک استایل یا حتی یک احساس را تغییر دهد؛ برای همین، در رایلین مجموعه‌ای کامل و متنوع از اکسسوری‌های دخترانه و زنانه را در کنار هم جمع کرده‌ایم.
                        </p>
                    </div>
                    <div className="w-full grid grid-cols-2">
                        <div className="flex flex-col gap-5 text-text mr-10">
                            <span className="font-semibold">اطلاعات تماس</span>
                            <ul className="flex flex-col gap-3 text-sm">
                                <li>
                                    <Link href="tel:09336407175" className="flex gap-2">
                                        <Phone className="size-4" />
                                        09336407175
                                    </Link>
                                </li>
                                <li>
                                    <Link href="mailto:info@raylin.ir" className="flex gap-2">
                                        <Mail className="size-4" />
                                        info@raylin.ir
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="flex flex-col gap-5 text-text">
                            <span className="font-semibold">آدرس</span>
                            <p className="text-sm leading-6 text-justify">شیراز، بلوار مدرس، کوچه 17/3، ساختمان طلوع</p>
                        </div>
                    </div>
                </div>
                {/*<div className="w-full flex justify-between items-end">*/}
                {/*    <div className="w-full grid grid-cols-4 gap-5">*/}
                {/*        <div className="flex flex-col gap-5 text-text">*/}
                {/*            <span className="font-semibold">محصولات پرطرفدار</span>*/}
                {/*            <ul className="flex flex-col gap-3 text-sm">*/}
                {/*                <li>*/}
                {/*                    <Link href="/">زعفران</Link>*/}
                {/*                </li>*/}
                {/*                <li>*/}
                {/*                    <Link href="/">هل</Link>*/}
                {/*                </li>*/}
                {/*                <li>*/}
                {/*                    <Link href="/">ادویه</Link>*/}
                {/*                </li>*/}
                {/*                <li>*/}
                {/*                    <Link href="/">خشکبار</Link>*/}
                {/*                </li>*/}
                {/*            </ul>*/}
                {/*        </div>*/}
                {/*        <div className="flex flex-col gap-5 text-text">*/}
                {/*            <span className="font-semibold">محصولات پرطرفدار</span>*/}
                {/*            <ul className="flex flex-col gap-3 text-sm">*/}
                {/*                <li>*/}
                {/*                    <Link href="/">زعفران</Link>*/}
                {/*                </li>*/}
                {/*                <li>*/}
                {/*                    <Link href="/">هل</Link>*/}
                {/*                </li>*/}
                {/*                <li>*/}
                {/*                    <Link href="/">ادویه</Link>*/}
                {/*                </li>*/}
                {/*                <li>*/}
                {/*                    <Link href="/">خشکبار</Link>*/}
                {/*                </li>*/}
                {/*            </ul>*/}
                {/*        </div>*/}
                {/*        <div className="flex flex-col gap-5 text-text">*/}
                {/*            <span className="font-semibold">لینک های پر کاربرد</span>*/}
                {/*            <ul className="flex flex-col gap-3 text-sm">*/}
                {/*                <li>*/}
                {/*                    <Link href="/">زعفران</Link>*/}
                {/*                </li>*/}
                {/*                <li>*/}
                {/*                    <Link href="/">هل</Link>*/}
                {/*                </li>*/}
                {/*                <li>*/}
                {/*                    <Link href="/">ادویه</Link>*/}
                {/*                </li>*/}
                {/*                <li>*/}
                {/*                    <Link href="/">خشکبار</Link>*/}
                {/*                </li>*/}
                {/*            </ul>*/}
                {/*        </div>*/}
                {/*        <div className="flex flex-col gap-5 text-text">*/}
                {/*            <span className="font-semibold">مقالات مهم</span>*/}
                {/*            <ul className="flex flex-col gap-3 text-sm">*/}
                {/*                <li>*/}
                {/*                    <Link href="/">زعفران</Link>*/}
                {/*                </li>*/}
                {/*                <li>*/}
                {/*                    <Link href="/">هل</Link>*/}
                {/*                </li>*/}
                {/*                <li>*/}
                {/*                    <Link href="/">ادویه</Link>*/}
                {/*                </li>*/}
                {/*                <li>*/}
                {/*                    <Link href="/">خشکبار</Link>*/}
                {/*                </li>*/}
                {/*            </ul>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*    <div className="flex justify-end items-end gap-5">*/}
                {/*        <div className="w-32 h-32 rounded-md bg-gray-50 flex justify-center items-center relative">*/}
                {/*            <Image src="/images/samandehi.png" alt="enamad" fill className="object-contain" sizes="(max-width: 768px) 100vw, 160px" />*/}
                {/*        </div>*/}
                {/*        <div className="w-32 h-32 rounded-md bg-gray-50 flex justify-center items-center relative">*/}
                {/*            <Image src="/images/enamad.png" alt="enamad" fill className="object-contain" sizes="(max-width: 768px) 100vw, 160px" />*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className="w-full pt-5 border-t border-gray-200 flex justify-center items-center">
                    <p className="text-text text-center text-sm mt-5">کلیه حقوق مادی و معنوی این وبسایت متعلق به رایلین می باشد.</p>
                </div>
            </div>
        </footer>
    )
}