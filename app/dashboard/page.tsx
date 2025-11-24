import {Button, FormControl, IconButton, InputLabel, MenuItem, Paper, Select} from "@mui/material";
import {ArrowUpDown, ChevronLeft, ClipboardList, CreditCard, Timer, User} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
    return (
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
            }}
            className="space-y-5"
        >
            <div className="w-full flex justify-between items-center py-5">
                <h2 className="text-xl font-semibold">خانه</h2>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                        <Timer className="size-4 text-green-700" />
                        سفارش گیری فعال
                    </span>
                    <IconButton>
                        <User className="size-6 text-prime" />
                    </IconButton>
                </div>
            </div>

            <div className="flex flex-col space-y-5 -mt-5 pb-5">
                <div className="w-full flex flex-col bg-white shadow rounded p-5 gap-5">
                    <div className="w-full flex justify-between items-start">
                        <h3 className="font-semibold">گزارش ها</h3>
                        <FormControl sx={{ minWidth: 120 }} size="small">
                            <Select
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={10}
                                variant="outlined"
                            >
                                <MenuItem value={10}>امروز</MenuItem>
                                <MenuItem value={20}>7 روز گذشته</MenuItem>
                                <MenuItem value={30}>30 روز گذشته</MenuItem>
                                <MenuItem value={30}>1 سال گذشته</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className="w-full grid grid-cols-2 grid-rows-2 gap-5">
                        <div className="h-24 bg-gray-100 rounded shadow flex flex-col justify-between p-4">
                            <div className="w-full flex justify-start items-center gap-2">
                                <ArrowUpDown className="size-5 text-prime" />
                                <h4 className="text-gray-600">بازدید سایت</h4>
                            </div>
                            <div className="w-full flex justify-end items-center">
                                <h4 className="text-gray-600 text-xl font-semibold">0</h4>
                            </div>
                        </div>
                        <div className="h-24 bg-gray-100 rounded shadow flex flex-col justify-between p-4">
                            <div className="w-full flex justify-start items-center gap-2">
                                <CreditCard className="size-5 text-prime" />
                                <h4 className="text-gray-600">فروش کل</h4>
                            </div>
                            <div className="w-full flex justify-end items-center">
                                <h4 className="text-gray-600 text-xl font-semibold">0</h4>
                            </div>
                        </div>
                        <div className="h-24 bg-gray-100 rounded shadow flex flex-col justify-between p-4">
                            <div className="w-full flex justify-start items-center gap-2">
                                <ClipboardList className="size-5 text-prime" />
                                <h4 className="text-gray-600">سفارش ها</h4>
                            </div>
                            <div className="w-full flex justify-end items-center">
                                <h4 className="text-gray-600 text-xl font-semibold">0</h4>
                            </div>
                        </div>
                        <div className="h-24 bg-gray-100 rounded shadow flex flex-col justify-between p-4">
                            <div className="w-full flex justify-start items-center gap-2">
                                <User className="size-5 text-prime" />
                                <h4 className="text-gray-600">مشتری جدید</h4>
                            </div>
                            <div className="w-full flex justify-end items-center">
                                <h4 className="text-gray-600 text-xl font-semibold">0</h4>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full h-[400px] flex flex-col bg-white shadow rounded p-5 gap-5">
                    <div className="w-full flex justify-between items-center">
                        <h3 className="font-semibold">جدیدترین سفارش ها</h3>
                        <Link href="/dashboard/orders">
                            <Button variant="text" className="gap-2">
                                مشاهده همه
                                <ChevronLeft className="size-5" />
                            </Button>
                        </Link>
                    </div>
                    <Paper
                        sx={{
                            width: "100%",
                            height: "100%",
                            overflowY: "auto",
                            boxShadow: "none",
                            backgroundColor: "#fff",
                            "&::-webkit-scrollbar": {
                                display: "none",
                            },
                            msOverflowStyle: "none",
                            scrollbarWidth: "none",
                        }}
                    >
                    </Paper>
                </div>

                <div className="w-full h-[400px] flex flex-col bg-white shadow rounded p-5 gap-5">
                    <div className="w-full flex justify-between items-center">
                        <h3 className="font-semibold">پربازدید ترین محصول ها</h3>
                        <Link href="/dashboard/products">
                            <Button variant="text" className="gap-2">
                                مشاهده همه
                                <ChevronLeft className="size-5" />
                            </Button>
                        </Link>
                    </div>
                    <Paper
                        sx={{
                            width: "100%",
                            height: "100%",
                            overflowY: "auto",
                            boxShadow: "none",
                            backgroundColor: "#fff",
                            "&::-webkit-scrollbar": {
                                display: "none",
                            },
                            msOverflowStyle: "none",
                            scrollbarWidth: "none",
                        }}
                    >
                    </Paper>
                </div>
            </div>
        </Paper>
    )
}