import {BadgeCheck, Headset, PackageCheck, ShieldCheck, Truck} from "lucide-react";

export default function FeatureHighlights() {
    return (
        <div className="w-full grid grid-cols-5 gap-10">
            <div className="flex flex-col justify-center items-center gap-5">
                <Headset className="text-prime size-12" />
                <span className="text-xl text-text">پشتیبانی آنلاین</span>
            </div>
            <div className="flex flex-col justify-center items-center gap-5">
                <BadgeCheck className="text-prime size-12" />
                <span className="text-xl text-text">تضمین اصالت کالا</span>
            </div>
            <div className="flex flex-col justify-center items-center gap-5">
                <PackageCheck className="text-prime size-12" />
                <span className="text-xl text-text">بسته بندی با کیفیت</span>
            </div>
            <div className="flex flex-col justify-center items-center gap-5">
                <Truck className="text-prime size-12" />
                <span className="text-xl text-text">ارسال به موقع</span>
            </div>
            <div className="flex flex-col justify-center items-center gap-5">
                <ShieldCheck className="text-prime size-12" />
                <span className="text-xl text-text">پرداخت امن آنلاین</span>
            </div>
        </div>
    )
}