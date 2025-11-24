"use client"

import {Button, Paper} from "@mui/material";
import {ArrowUpDown, EllipsisVertical, Plus, Search, X} from "lucide-react";
import Link from "next/link";

export default function Products() {
    return (
        <>
            <div className="w-full flex justify-between items-center py-5">
                <h2 className="text-xl font-semibold">محصولات</h2>
                <Link href="/dashboard/products/create">
                    <Button variant="text" className="gap-2">
                        <Plus className="size-4" />
                        افزودن محصول جدید
                    </Button>
                </Link>
            </div>

            <div className="relative">
                <Search className="absolute right-3 top-3 size-5 text-gray-400" />
                <input className="w-full h-11 shadow bg-white focus:outline-none rounded px-10 text-sm" placeholder="جستجو در محصول ها" />
                <X className="absolute left-3 top-3 size-5 text-gray-400 cursor-pointer" />
            </div>

            <div className="w-full flex justify-between items-center mt-5">
                <Button variant="text" className="gap-2">
                    <Plus className="size-4" />
                    فیلتر
                </Button>
                <Button variant="text" className="gap-2">
                    <ArrowUpDown className="size-4" />
                    مرتب سازی
                </Button>
                <Button variant="text" className="gap-2 bg-g">
                    <EllipsisVertical className="size-4" />
                    امکانات بیشتر
                </Button>
            </div>

            <Paper
                sx={{
                    width: "100%",
                    height: "100%",
                    overflowY: "auto",
                    boxShadow: "none",
                    backgroundColor: "#f3f4f6",
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                    marginTop: "20px"
                }}
            >
            </Paper>
        </>
    )
}