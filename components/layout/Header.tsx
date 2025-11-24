"use client"

import Image from "next/image";
import Link from "next/link";
import {
    LayoutGrid,
    Newspaper,
    Package2,
    PackageSearch,
    ShoppingCart,
    Users
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { apiClient, ApiError } from "@/lib/apiClient";
import UserDropdown from "@/components/ui/UserDropdown";
import { Button } from "@mui/material";
import { useCartStore } from "@/store/cartStore";

export default function Header() {

    const { authenticated, userData, logout } = useAuthStore()
    const { items } = useCartStore()

    const cartCount = items.length;

    const logoutUser = async () => {
        try {
            const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
                method: "POST",
                withCredentials: true,
            });

            if (res.status === 200 || res.success) {
                logout();
            }
        } catch (err) {
            const error = err as ApiError;
            console.log(error);
        }
    };

    return (
        <div className="w-full">
            <div className="w-full bg-white shadow-sm fixed top-0 right-0 z-10">
                <header className="max-w-7xl mx-auto h-20 flex justify-between items-center">
                    <div className="flex items-center gap-10">
                        <Link href="/" className="relative w-24 h-20">
                            <Image
                                src="/images/logo.png"
                                alt="logo"
                                fill
                                className="object-contain mt-1"
                                sizes="(max-width: 768px) 6rem, 8rem"
                                priority
                            />
                        </Link>

                        <ul className="flex items-center gap-10 text-text">
                            <li>
                                <Link
                                    href="/"
                                    className="group flex items-center gap-2 hover:text-second transition"
                                >
                                    <LayoutGrid className="size-5 group-hover:text-second transition" />
                                    <span className="group-hover:text-second transition">دسته بندی</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/products"
                                      className="group flex items-center gap-2 hover:text-second transition"
                                >
                                    <Package2 className="size-5 group-hover:text-second transition" />
                                    <span className="group-hover:text-second transition">محصولات</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/"
                                      className="group flex items-center gap-2 hover:text-second transition"
                                >
                                    <Newspaper className="size-5 group-hover:text-second transition" />
                                    <span className="group-hover:text-second transition">مقالات</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/about"
                                      className="group flex items-center gap-2 hover:text-second transition"
                                >
                                    <Users className="size-5 group-hover:text-second transition" />
                                    <span className="group-hover:text-second transition">درباره ما</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/"
                                      className="group flex items-center gap-2 hover:text-second transition"
                                >
                                    <PackageSearch className="size-5 group-hover:text-second transition" />
                                    <span className="group-hover:text-second transition">پیگیری سفارش</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="flex items-center gap-5">

                        <Link href="/checkout/cart" className="relative">
                            <ShoppingCart className="size-6" />

                            {cartCount > 0 && (
                                <span className="absolute -top-3 -right-3 w-5 h-5 flex justify-center items-center rounded-full bg-prime text-white text-[10px]">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {authenticated ? (
                            <UserDropdown
                                displayName={userData?.mobile}
                                onLogout={logoutUser}
                            />
                        ) : (
                            <Link href="/auth/login">
                                <Button variant="contained">
                                    <span className="px-5">ورود و ثبت نام</span>
                                </Button>
                            </Link>
                        )}
                    </div>
                </header>
            </div>
            <div className="w-full h-20"></div>
        </div>
    );
}