"use client"

import {CreditCard, FileText, ShoppingCart, Tag, Truck} from "lucide-react";
import {Button, TextField} from "@mui/material";
import * as React from "react";
import {useCartStore} from "@/store/cartStore";
import { apiClient } from "@/lib/apiClient";
import toast from "react-hot-toast";

export default function Payment() {

    const {
        items,
        selectedShippingMethod,
        selectedAddress,
        orderNote,
        discountCode
    } = useCartStore();

    const [loading, setLoading] = React.useState(false);

    /* -------------------------------
       BUILD ORDER PAYLOAD
    --------------------------------*/
    const buildPayload = () => ({
        address_id: selectedAddress?.id,
        shipping_method_id: selectedShippingMethod?.id,
        note: orderNote || null,
        discount_code: discountCode?.code ?? null,
        items: items.map(i => ({
            product_id: i.product_id,
            variant_id: i.product_variant_id,
            quantity: i.quantity
        }))
    });

    /* -------------------------------
       CREATE ORDER
    --------------------------------*/
    const createOrder = async () => {
        return await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/site/orders`, {
            method: "POST",
            body: buildPayload(),
        });
    };

    /* -------------------------------
       REQUEST PAY
    --------------------------------*/
    const payOrder = async (orderId: number) => {
        return await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/site/orders/${orderId}/pay`, {
            method: "POST",
        });
    };

    /* -------------------------------
       HANDLE BUTTON CLICK
    --------------------------------*/
    const handleSubmit = async () => {
        try {
            if (!selectedAddress) return toast.error("آدرس انتخاب نشده");
            if (!selectedShippingMethod) return toast.error("روش ارسال انتخاب نشده");
            if (items.length === 0) return toast.error("سبد خرید خالی است");

            setLoading(true);

            // 1️⃣ ایجاد سفارش
            const orderRes = await createOrder();
            const order = orderRes.data;

            // 2️⃣ درخواست پرداخت
            const payRes = await payOrder(order.id);

            // 3️⃣ ریدایرکت به زیبال
            window.location.href = payRes.data.payment_url;

        } catch (e: any) {
            console.error(e);
            toast.error(e.message || "خطا در ایجاد سفارش");
        } finally {
            setLoading(false);
        }
    };

    /* -------------------------------
       PRICE CALCULATIONS
    --------------------------------*/
    const totalFinal = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
    const totalOriginal = items.reduce(
        (sum, i) => sum + (i.original_price ?? i.unit_price) * i.quantity,
        0
    );
    const totalDiscount = Math.max(0, totalOriginal - totalFinal);

    return (
        <div className="w-full flex flex-col justify-start items-center gap-5 my-10 text-text">
            <div className="flex items-center">
                <span className="p-3 rounded-full bg-gray-200">
                    <ShoppingCart className="size-6 text-prime" />
                </span>
                <div className="w-60 h-1 rounded-full bg-prime"></div>
                <span className="p-3 rounded-full bg-gray-200">
                    <Truck className="size-6 text-prime" />
                </span>
                <div className="w-60 h-1 rounded-full bg-prime"></div>
                <span className="p-3 rounded-full bg-gray-200 shadow-md">
                    <CreditCard className="size-6 text-prime" />
                </span>
            </div>
            <div className="w-full flex justify-between items-start gap-7">
                <div className="w-full flex flex-col justify-start items-start gap-5">
                    <div className="w-full flex justify-between items-center">
                        <h1 className="font-semibold">تکمیل سفارش و پرداخت</h1>
                    </div>
                    <div className="w-full bg-white rounded-md flex flex-col justify-start items-start p-5 gap-5">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Tag className="size-4" />
                            <span>اگر دارای کد تخفیف هستید لطفا در کادر زیر وارد نمایید</span>
                        </div>
                        <div className="w-full flex justify-between items-center gap-5">
                            <TextField className="w-full" size="small" placeholder="کد تخفیف" />
                            <Button variant="contained">اعمال</Button>
                        </div>
                    </div>
                    <div className="w-full bg-white rounded-md flex flex-col justify-start items-start p-5 gap-5">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <FileText className="size-4" />
                            <span>اگر نیاز به توضیحات است، لطفا بنویسید</span>
                        </div>
                        <TextField
                            multiline
                            rows={4}
                            placeholder="توضیحات"
                            size="small"
                            className="w-full"
                        />
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

                        <div className="w-full flex justify-between items-center text-sm">
                            <span>هزینه ارسال</span>
                            <span>{selectedShippingMethod?.price.toLocaleString()} تومان</span>
                        </div>

                        {totalDiscount > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                                <span>سود شما</span>
                                <span>{totalDiscount.toLocaleString()} تومان</span>
                            </div>
                        )}

                        <div className="w-full flex justify-between items-center text-sm">
                            <span>مبلغ قابل پرداخت</span>
                            <span>{
                                ((selectedShippingMethod?.price ?? 0) + totalFinal).toLocaleString()
                            } تومان</span>
                        </div>

                        <Button
                            className="w-full"
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? "در حال انتقال..." : "تایید و تکمیل سفارش"}
                        </Button>
                    </div>
                    <p className="w-full text-[13px] text-gray-600 text-center">
                        هزینه این سفارش هنوز پرداخت نشده‌ و در صورت اتمام موجودی، کالاها از سبد حذف می‌شوند
                    </p>
                </div>
            </div>
        </div>

    )
}