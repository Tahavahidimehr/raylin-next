"use client"

import {Button} from "@mui/material";
import {CreditCard, MapPin, Phone, Plus, ScrollText, ShoppingCart, Truck, Undo2, User} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import {useEffect, useState} from "react";
import {Address, ShippingMethod} from "@/types/types";
import {apiClient} from "@/lib/apiClient";
import {useCartStore} from "@/store/cartStore";
import toast from "react-hot-toast";

export default function Shipping() {

    const { items } = useCartStore();
    const { setSelectedAddress, setSelectedShippingMethod } = useCartStore();

    const totalFinal = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
    const totalOriginal = items.reduce(
        (sum, i) => sum + (i.original_price ?? i.unit_price) * i.quantity,
        0
    );
    const totalDiscount = Math.max(0, totalOriginal - totalFinal);

    const [addressesLoading, setAddressesLoading] = useState(true)
    const [shippingMethodsLoading, setShippingMethodsLoading] = useState(true)
    const [addresses, setAddresses] = useState<Address[] | null>(null)
    const [shippingMethods, setShippingMethods] = useState<ShippingMethod[] | null>(null)

    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [selectedShippingId, setSelectedShippingId] = useState<number | null>(null);

    const getUserAddresses = async () => {
        const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/site/addresses`, {
            withCredentials: true
        })
        setAddresses(res.data)
        setAddressesLoading(false)
    }

    const getShippingMethods = async () => {
        const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/site/shipping_methods`, {
            withCredentials: true
        })
        setShippingMethods(res.data)
        setShippingMethodsLoading(false)
    }

    useEffect(() => {
        getUserAddresses()
        getShippingMethods()
    }, []);

    return (
        <div className="w-full flex flex-col justify-start items-center gap-5 my-10 text-text">
            <div className="flex items-center">
                <span className="p-3 rounded-full bg-gray-200">
                    <ShoppingCart className="size-6 text-prime" />
                </span>
                <div className="w-60 h-1 rounded-full bg-prime"></div>
                <span className="p-3 rounded-full bg-gray-200 shadow-md">
                    <Truck className="size-6 text-prime" />
                </span>
                <div className="w-60 h-1 rounded-full bg-gray-200"></div>
                <span className="mr-3">
                    <CreditCard className="size-6 text-gray-400" />
                </span>
            </div>
            <div className="w-full flex justify-between items-start gap-7">
                <div className="w-full flex flex-col justify-start items-start gap-5">
                    <div className="w-full flex justify-between items-center">
                        <h1 className="font-semibold">آدرس و نحوه ارسال</h1>
                    </div>
                    <div className="w-full min-h-[228px] bg-white rounded-md flex flex-col justify-start items-start gap-5 p-5">
                        <div className="w-full h-10 flex justify-between items-center">
                            <span className="font-semibold">آدرس تحویل سفارش</span>
                            <Button>
                                <div className="w-full flex items-center gap-2">
                                    <Plus className="size-4" />
                                    <span>آدرس جدید</span>
                                </div>
                            </Button>
                        </div>
                        <div className="w-full flex flex-col gap-5">
                            {
                                addressesLoading ? (
                                    <div className="w-full animate-pulse rounded-md bg-gray-100 flex flex-col p-4 gap-4">
                                        <div className="w-3/4 h-5 rounded bg-gray-300"></div>
                                        <div className="w-2/4 h-5 rounded bg-gray-300"></div>
                                        <div className="w-1/4 h-5 rounded bg-gray-300"></div>
                                    </div>
                                ) : (
                                    addresses?.length ? (
                                        addresses.map(addr => (
                                            <label
                                                key={addr.id}
                                                className={`w-full rounded-md border flex flex-col p-4 gap-4 text-sm cursor-pointer
                                                    ${selectedAddressId === addr.id
                                                    ? "border-prime bg-purple-50/30 shadow-sm"
                                                    : "border-gray-200"}`}
                                                onClick={() => {
                                                    setSelectedAddressId(addr.id);
                                                    setSelectedAddress(addr);
                                                }}
                                            >
                                                <input
                                                    type="radio"
                                                    name="selectedAddress"
                                                    className="hidden"
                                                    checked={selectedAddressId === addr.id}
                                                    onChange={() => {}}
                                                />

                                                <div className="w-full flex items-center gap-2">
                                                    <MapPin className="size-5" />
                                                    <p>{addr.province}، {addr.city}، {addr.address}</p>
                                                </div>
                                                <div className="w-full flex items-center gap-2">
                                                    <User className="size-5" />
                                                    <p>{addr.receiver_name}</p>
                                                </div>
                                                <div className="w-full flex items-center gap-2">
                                                    <Phone className="size-4" />
                                                    <p>{addr.receiver_phone}</p>
                                                </div>
                                            </label>
                                        ))
                                    ) : (
                                        <div className="w-full flex flex-col justify-center items-center gap-3 mt-14">
                                            <ScrollText className="size-16 text-gray-300" />
                                            <p className="text-gray-500">آدرسی ثبت نشده است</p>
                                        </div>
                                    )
                                )
                            }
                        </div>
                    </div>
                    <div className="w-full bg-white rounded-md flex flex-col justify-start items-start gap-5 p-5">
                        <div className="w-full h-10 flex justify-start items-center">
                            <span className="font-semibold">نحوه ارسال سفارش</span>
                        </div>
                        <div className="w-full flex flex-col gap-5">
                            {
                                shippingMethodsLoading ? (
                                    <>
                                        <div className="w-full rounded-md animate-pulse bg-gray-100 flex flex-col p-4 gap-4">
                                            <span className="w-20 h-5 rounded bg-gray-300"></span>
                                            <span className="w-40 h-5 rounded bg-gray-300"></span>
                                        </div>
                                        <div className="w-full rounded-md animate-pulse bg-gray-100 flex flex-col p-4 gap-4">
                                            <span className="w-20 h-5 rounded bg-gray-300"></span>
                                            <span className="w-40 h-5 rounded bg-gray-300"></span>
                                        </div>
                                    </>
                                ) : (
                                    shippingMethods?.map(method => (
                                        <label
                                            key={method.id}
                                            className={`w-full rounded-md border flex justify-start items-center p-4 gap-4 text-sm cursor-pointer
                                                ${selectedShippingId === method.id
                                                ? "border-prime bg-purple-50/30 shadow-sm"
                                                : "border-gray-200"}`}
                                            onClick={() => {
                                                setSelectedShippingId(method.id);
                                                setSelectedShippingMethod(method);
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                name="selectedShipping"
                                                className="hidden"
                                                checked={selectedShippingId === method.id}
                                                onChange={() => {}}
                                            />

                                            <div className="flex flex-col gap-4">
                                                <span className="font-semibold">{method.name}</span>
                                                <p className="text-gray-700">{method.description}</p>
                                            </div>
                                        </label>
                                    ))
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className="min-w-[350px] flex flex-col gap-5">
                    <div className="w-full bg-white rounded-md p-5 flex flex-col gap-7">
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>قیمت کالاها ({items.length})</span>
                            <span>{totalOriginal.toLocaleString()} تومان</span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span>جمع سبد خرید</span>
                            <span>{totalFinal.toLocaleString()} تومان</span>
                        </div>

                        {
                            totalDiscount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>سود شما</span>
                                    <span>{totalDiscount.toLocaleString()} تومان</span>
                                </div>
                            )
                        }

                        {
                            (selectedAddressId && selectedShippingId) ? (
                                <Link href="/checkout/payment" className="w-full">
                                    <Button className="w-full" variant="contained">تایید و تکمیل سفارش</Button>
                                </Link>
                            ) : (
                                <Button className="w-full" variant="contained" onClick={() => toast.error("آدرس و نحوه ارسال سفارش باید انتخاب شود")}>تایید و تکمیل سفارش</Button>
                            )
                        }
                    </div>
                    <Link href="/checkout/cart" className="w-full">
                        <Button className="w-full" variant="outlined">
                            <div className="w-full flex justify-center items-center gap-2 text-prime">
                                <Undo2 className="size-5" />
                                <span>برگشت به سبد خرید</span>
                            </div>
                        </Button>
                    </Link>
                </div>
            </div>
        </div>

    )
}