"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {LogOut, User, ChevronDown, Package} from "lucide-react";

type Item =
    | { type: "link"; href: string; text: string; icon?: React.ReactNode }
    | { type: "button"; text: string; icon?: React.ReactNode; onClick: () => void | Promise<void> }
    | { type: "label"; text: string; icon?: React.ReactNode }
    | { type: "divider" };

type Props = {
    displayName?: string | null;
    email?: string | null;
    avatarUrl?: string | null;
    onLogout: () => void | Promise<void>;
};

export default function UserDropdown({ displayName, email, avatarUrl, onLogout }: Props) {
    const [open, setOpen] = React.useState(false);
    const btnRef = React.useRef<HTMLButtonElement | null>(null);
    const menuRef = React.useRef<HTMLDivElement | null>(null);

    const name = displayName || email || "کاربر";
    const initials = name.trim()[0]?.toUpperCase() || "ش";

    const items: Item[] = [
        { type: "link", href: "/profile", text: "اطلاعات کاربری", icon: <User className="size-4" /> },
        { type: "link", href: "/profile/orders", text: "سفارش‌ها", icon: <Package className="size-4" /> },
        { type: "divider" },
        { type: "button", text: "خروج", icon: <LogOut className="size-4" />, onClick: onLogout },
    ];

    // کلیک بیرون
    React.useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!open) return;
            const t = e.target as Node;
            if (menuRef.current?.contains(t) || btnRef.current?.contains(t)) return;
            setOpen(false);
        };
        window.addEventListener("mousedown", handler);
        return () => window.removeEventListener("mousedown", handler);
    }, [open]);

    // ESC
    React.useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
        <div className="relative">
            {/* Trigger: آواتار + نام کاربر */}
            <button
                ref={btnRef}
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={open}
                className="flex items-center gap-3 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-200"
                title={name}
            >
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {avatarUrl ? (
                        <Image src={avatarUrl} alt={name} fill className="object-cover" sizes="2rem" />
                    ) : (
                        <span className="text-sm font-semibold">{initials}</span>
                    )}
                </div>
                <span className="text-sm font-medium max-w-[10rem] truncate">{name}</span>
                <ChevronDown className={`size-4 transition ${open ? "rotate-180" : ""}`} />
            </button>

            {/* Menu */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        ref={menuRef}
                        role="menu"
                        aria-label="منوی کاربر"
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.16, ease: "easeOut" }}
                        className="absolute left-0 mt-2 w-60 rounded-md bg-white shadow-md ring-1 ring-black/5 z-50 overflow-hidden"
                    >
                        <ul className="py-1">
                            {items.map((it, i) => {
                                if (it.type === "divider") {
                                    return <li key={`div-${i}`} className="my-1 h-px bg-gray-200" />;
                                }
                                if (it.type === "label") {
                                    return (
                                        <li key={`lab-${i}`} className="px-3 py-2 text-sm flex items-center gap-2">
                                            <span>{it.icon}</span>
                                            <span className="truncate">{it.text}</span>
                                        </li>
                                    );
                                }
                                if (it.type === "link") {
                                    return (
                                        <li key={`lnk-${i}`}>
                                            <Link
                                                href={it.href}
                                                role="menuitem"
                                                onClick={() => setOpen(false)}
                                                className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 focus:bg-gray-50 outline-none"
                                            >
                                                {it.icon && <span>{it.icon}</span>}
                                                <span>{it.text}</span>
                                            </Link>
                                        </li>
                                    );
                                }
                                if (it.type === "button") {
                                    return (
                                        <li key={`btn-${i}`}>
                                            <button
                                                role="menuitem"
                                                onClick={async () => { setOpen(false); await it.onClick?.(); }}
                                                className="w-full text-right px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 focus:bg-gray-50 outline-none"
                                            >
                                                {it.icon && <span>{it.icon}</span>}
                                                <span>{it.text}</span>
                                            </button>
                                        </li>
                                    );
                                }
                                return null;
                            })}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}