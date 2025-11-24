"use client";

import * as React from "react";
import { Tabs, Tab } from "@mui/material";
import {CheckCircle, CheckCircle2, ChevronLeft, Dot, ScrollText} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`orders-tabpanel-${index}`}
            aria-labelledby={`orders-tab-${index}`}
            {...other}
        >
            {value === index && (
                <div className="pt-4">
                    {children}
                </div>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `orders-tab-${index}`,
        "aria-controls": `orders-tabpanel-${index}`,
    };
}

export default function Orders() {
    const [value, setValue] = React.useState(0);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div className="w-full min-h-[500px] bg-white flex flex-col justify-start rounded-md p-5">
            <h1 className="font-semibold text-text mb-5">سفارش ها</h1>
            <Tabs
                value={value}
                onChange={handleChange}
                textColor="secondary"
                indicatorColor="secondary"
                aria-label="orders tabs"
            >
                <Tab label="جاری" {...a11yProps(0)} />
                <Tab label="تحویل شده" {...a11yProps(1)} />
                <Tab label="مرجوع شده" {...a11yProps(2)} />
                <Tab label="لغو شده" {...a11yProps(3)} />
            </Tabs>

            <div className="w-full mt-3">
                <TabPanel value={value} index={0}>
                    <div className="w-full h-full flex flex-col gap-5">
                        <Link href={`/profile/orders/${1234}`} className="w-full flex flex-col gap-5">
                            <div className="w-full border border-gray-200 rounded-md flex flex-col gap-5 p-5">
                                <div className="w-full flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-sm font-semibold">
                                        <CheckCircle2 className="text-green-600" />
                                        <span>تحویل شده</span>
                                    </div>
                                    <ChevronLeft className="size-5" />
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-500">12 دی 1404</span>
                                    <Dot className="size-7 text-gray-300" />
                                    <span className="text-gray-400">کد سفارش</span>
                                    <span className="text-text">454876514</span>
                                    <Dot className="size-7 text-gray-300" />
                                    <span className="text-gray-400">مبلغ</span>
                                    <span className="text-text">2,875,000 تومان</span>
                                </div>
                                <div className="w-full border-t border-gray-200 grid grid-cols-7 pt-5">
                                    {
                                        [1, 2, 3, 4].map((_) => (
                                            <div key={_} className="w-20 h-20 rounded-md">
                                                <div className="w-full h-full relative rounded-md overflow-hidden">
                                                    <Image
                                                        src="/images/product1.png"
                                                        alt="product image"
                                                        fill
                                                        className="rounded-md object-cover transition-all duration-500 group-hover:scale-110"
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </Link>
                    </div>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <div className="w-full flex flex-col justify-center items-center gap-3 mt-28">
                        <ScrollText className="size-16 text-gray-300" />
                        <p className="text-gray-500">سفارشی ثبت نشده است</p>
                    </div>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <div className="w-full flex flex-col justify-center items-center gap-3 mt-28">
                        <ScrollText className="size-16 text-gray-300" />
                        <p className="text-gray-500">سفارشی ثبت نشده است</p>
                    </div>
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <div className="w-full flex flex-col justify-center items-center gap-3 mt-28">
                        <ScrollText className="size-16 text-gray-300" />
                        <p className="text-gray-500">سفارشی ثبت نشده است</p>
                    </div>
                </TabPanel>
            </div>
        </div>
    );
}