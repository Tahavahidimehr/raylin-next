"use client"

import {Home, List, LucideIcon, Package, Settings} from "lucide-react";
import Link from "next/link";
import {Button} from "@mui/material";
import {usePathname} from "next/navigation";
import clsx from "clsx";
import Image from "next/image";

export interface MenuLink {
    id: number;
    text: string;
    href: string;
    icon: LucideIcon;
}

const menuLinks: MenuLink[] = [
    { id: 1, text: "خانه", href: "/dashboard", icon: Home },
    { id: 2, text: "محصولات", href: "/dashboard/products", icon: Package },
    { id: 3, text: "سفارش ها", href: "/dashboard/orders", icon: List },
    { id: 4, text: "تنظیمات", href: "/dashboard/setting", icon: Settings },
];

export default function Sidebar() {

    const path = usePathname()

    return (
        <aside className="min-w-[230px] h-full flex flex-col justify-between items-start py-5">
            <div className="w-full flex flex-col gap-5">
                <Link href="/" className="relative w-24 h-14">
                    <Image
                        src="/images/logo.png"
                        alt="logo"
                        fill
                        className="object-contain mt-2"
                        sizes="(max-width: 768px) 6rem, 8rem"
                        priority
                    />
                </Link>
                <ul className="w-full flex flex-col gap-5">
                    {
                        menuLinks.map((menuLink: MenuLink) => {
                            const Icon = menuLink.icon;
                            return (
                                <li key={menuLink.id} className="w-full">
                                    <Link href={menuLink.href} className={clsx(
                                        "w-full rounded text-gray-600 flex items-center gap-3 p-3 text-sm",
                                        menuLink.href == path && "bg-prime/10"
                                    )}>
                                        <Icon className="size-5 text-prime" />
                                        {menuLink.text}
                                    </Link>
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
            <Link href="/" className="w-full">
                <Button className="w-full" variant="outlined">مشاهده فروشگاه</Button>
            </Link>
        </aside>
    )
}