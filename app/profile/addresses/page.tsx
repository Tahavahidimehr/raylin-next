"use client"

import * as React from "react";
import {Button} from "@mui/material";
import {MapPin, Phone, Plus, ScrollText, SquarePen, Trash2, User} from "lucide-react";
import {useEffect, useState} from "react";
import {Address, ShippingMethod} from "@/types/types";
import {apiClient} from "@/lib/apiClient";

export default function Addresses() {

    const [addressesLoading, setAddressesLoading] = useState(true)
    const [addresses, setAddresses] = useState<Address[] | null>(null)

    const getUserAddresses = async () => {
        const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/site/addresses`, {
            withCredentials: true
        })
        setAddresses(res.data)
        setAddressesLoading(false)
    }

    useEffect(() => {
        getUserAddresses()
    }, []);

    return (
        <div className="w-full min-h-[500px] bg-white flex flex-col justify-start rounded-md p-5 gap-5">
            <div className="w-full flex justify-between items-center">
                <h1 className="font-semibold text-text mb-5">آدرس ها</h1>
                <Button size="small" className="flex items-center gap-2">
                    <Plus className="size-4" />
                    <span>آدرس جدید</span>
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
                            addresses?.map((address: Address) => (
                                <div key={address.id} className="w-full rounded-md border border-gray-200 flex flex-col p-4 gap-4 text-sm">
                                    <div className="w-full flex items-center gap-2">
                                        <MapPin className="size-5" />
                                        <p>{address.address}</p>
                                    </div>
                                    <div className="w-full flex items-center gap-2">
                                        <User className="size-5" />
                                        <p>{address.receiver_name}</p>
                                    </div>
                                    <div className="w-full flex justify-between items-center">
                                        <div className="w-full flex items-center gap-2">
                                            <Phone className="size-4" />
                                            <p>{address.receiver_phone}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button size="small" className="flex items-center gap-2">
                                                <SquarePen className="size-4" />
                                                <span>ویرایش</span>
                                            </Button>
                                            <Button size="small" className="flex items-center gap-2">
                                                <Trash2 className="size-4 text-red-500" />
                                                <span className="text-red-500">حذف</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="w-full h-96 flex flex-col justify-center items-center gap-3">
                                <ScrollText className="size-16 text-gray-300" />
                                <p className="text-gray-500">آدرسی ثبت نشده است</p>
                            </div>
                        )
                    )
                }
            </div>
        </div>
    )
}