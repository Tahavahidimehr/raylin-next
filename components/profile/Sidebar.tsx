"use client"

import {LogOut, LucideIcon, MapPin, Package, User, UserPen} from "lucide-react";
import Link from "next/link";
import {Button} from "@mui/material";
import {usePathname} from "next/navigation";
import clsx from "clsx";
import {useAuthStore} from "@/store/authStore";

export interface MenuLink {
    id: number;
    text: string;
    href: string;
    icon: LucideIcon;
}

const menuLinks: MenuLink[] = [
    { id: 1, text: "اطلاعات کاربری", href: "/profile", icon: User },
    { id: 2, text: "سفارش ها", href: "/profile/orders", icon: Package },
    { id: 3, text: "آدرس ها", href: "/profile/addresses", icon: MapPin },
];

export default function Sidebar() {

    const path = usePathname()

    const {userData} = useAuthStore()

    return (
        <aside className="w-[450px] bg-white rounded-md flex flex-col p-5 gap-5">
            <div className="w-full h-14 flex justify-between items-center border-b border-gray-200 pb-4">
                {
                    (userData?.first_name && userData?.last_name) && (
                        <span className="font-semibold text-text">{userData?.first_name + " " + userData?.last_name} </span>

                    )
                }
                <span className="text-sm text-gray-500">{userData?.mobile}</span>
            </div>
            <ul className="w-full h-full flex flex-col gap-5 border-b border-gray-200 pb-4">
                {
                    menuLinks.map((menuLink: MenuLink) => {
                        const Icon = menuLink.icon;
                        return (
                            <li key={menuLink.id} className={clsx(
                                "w-full rounded-md",
                                path === menuLink.href && "bg-prime text-white",
                            )}>
                                <Button className="w-full">
                                    <Link href={menuLink.href} className="w-full h-full flex items-center gap-2">
                                        <Icon className={clsx(
                                            "size-5",
                                            path === menuLink.href ? " text-white" : "text-text",
                                        )} />
                                        <span className={path === menuLink.href ? "text-white" : "text-text"}>{menuLink.text}</span>
                                    </Link>
                                </Button>
                            </li>
                        )
                    })
                }
            </ul>
            <Button className="w-full">
                <div className="w-full flex justify-start items-center gap-2">
                    <LogOut className="size-5 text-text" />
                    <span className="text-text">خروج از حساب کاربری</span>
                </div>
            </Button>
        </aside>
    )
}