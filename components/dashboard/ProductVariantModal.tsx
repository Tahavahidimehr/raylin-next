"use client";

import {
    Button,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Modal,
    Paper,
    Select,
    Switch,
    TextField,
} from "@mui/material";
import React, {useEffect} from "react";
import { ChevronRight, X } from "lucide-react";
import MediaUploader from "@/components/dashboard/MediaUploader";
import { useProductVariantsStore } from "@/store/productVariantsStore";
import {NumericFormat} from "react-number-format";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productVariantSchema, ProductVariantFormType } from "@/schemas/productVariantSchema";
import toast from "react-hot-toast";

export default function ProductVariantModal({
        open,
        close,
        productVariantId,
    }: {
    open: boolean;
    close: () => void;
    productVariantId: string | null;
}) {
    const productVariants = useProductVariantsStore((s) => s.productVariants);
    const updateProductVariant = useProductVariantsStore((s) => s.updateProductVariant);
    const addMediaToProductVariant = useProductVariantsStore((s) => s.addMediaToProductVariant);
    const setMainMedia = useProductVariantsStore((s) => s.setMainMedia);

    const pvIndex = productVariants.findIndex((pv) => pv.id === productVariantId);
    const pv = pvIndex !== -1 ? productVariants[pvIndex] : null;

    const form = useForm<ProductVariantFormType>({
        resolver: zodResolver(productVariantSchema) as any,
        defaultValues: {
            price: null,
            discount_type: "amount",
            discount_amount: null,
            discount_percentage: null,
            need_preparation_time: true,
            preparation_time: null,
            has_order_limit: false,
            order_limit: null,
            is_default: false,
        },
    });

    useEffect(() => {
        if (open && pv) {
            form.reset({
                price: pv.price ?? null,
                discount_type: pv.discount_type ?? "amount",
                discount_amount: pv.discount_amount ?? null,
                discount_percentage: pv.discount_percentage ?? null,
                need_preparation_time: pv.need_preparation_time ?? true,
                preparation_time: pv.preparation_time ?? null,
                has_order_limit: pv.has_order_limit ?? false,
                order_limit: pv.order_limit ?? null,
                is_default: pv.is_default ?? false,
            });
        } else {
            form.reset();
        }
    }, [open, productVariantId]);


    useEffect(() => {
        console.log("🧩 productVariants changed:", productVariants);
    }, [productVariants]);

    if (!productVariantId || pvIndex === -1 || !open || !pv) {
        return null;
    }

    const onSubmit = async (data: ProductVariantFormType) => {
        try {
            updateProductVariant(pvIndex, (prev) => ({ ...prev, ...data }));
            toast.success("تنوع محصول با موفقیت ذخیره شد");
            close();
        } catch (e) {
            toast.error("خطا در ثبت تنوع محصول");
        }
    };

    return (
        <Modal
            open={open}
            onClose={close}
            aria-labelledby="productVariantModalLabel"
            aria-describedby="productVariantModalDescription"
            className="flex justify-center items-center mx-5"
        >
            <div className="w-full max-w-xl h-10/12 bg-gray-100 rounded p-5 flex flex-col gap-5">
                <div className="w-full flex justify-between items-center">
                    <div className="w-full flex justify-start items-center gap-1">
                        <IconButton onClick={close}>
                            <ChevronRight className="size-5 text-gray-600" />
                        </IconButton>
                        <h2 className="font-semibold">تنوع محصول</h2>
                    </div>
                    <IconButton onClick={close}>
                        <X className="size-5 text-gray-600" />
                    </IconButton>
                </div>

                <Paper
                    sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        overflowY: "auto",
                        boxShadow: "none",
                        backgroundColor: "#f3f4f6",
                        "&::-webkit-scrollbar": { display: "none" },
                        msOverflowStyle: "none",
                        scrollbarWidth: "none",
                    }}
                >
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                        <MediaUploader
                            folder="productVariants"
                            allowImages
                            allowVideos
                            maxImages={4}
                            maxVideos={1}
                            media={pv.media}
                            onChange={(newMedia) => addMediaToProductVariant(pvIndex, newMedia)}
                            onSetMain={(path) => setMainMedia(pvIndex, path)}
                        />

                        <div className="w-full bg-white flex flex-col shadow rounded px-5 py-6 gap-5">
                            <Controller
                                name="price"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <NumericFormat
                                        customInput={TextField}
                                        allowNegative={false}
                                        thousandSeparator=","
                                        className="w-full"
                                        size="medium"
                                        label="قیمت"
                                        value={field.value ?? ""}
                                        onValueChange={(values) => field.onChange(values.floatValue)}
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">تومان</InputAdornment>,
                                        }}
                                    />
                                )}
                            />

                            <div className="w-full flex items-center gap-5">
                                <div className="w-full">
                                    {form.watch("discount_type") === "amount" ? (
                                        <Controller
                                            name="discount_amount"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <NumericFormat
                                                    customInput={TextField}
                                                    thousandSeparator=","
                                                    allowNegative={false}
                                                    className="w-full"
                                                    size="medium"
                                                    label="تخفیف"
                                                    variant="outlined"
                                                    value={field.value ?? ""}
                                                    onValueChange={(values) => field.onChange(values.floatValue)}
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error?.message}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">تومان</InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            )}
                                        />
                                    ) : (
                                        <Controller
                                            name="discount_percentage"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <NumericFormat
                                                    customInput={TextField}
                                                    thousandSeparator=","
                                                    allowNegative={false}
                                                    className="w-full"
                                                    size="medium"
                                                    label="تخفیف"
                                                    variant="outlined"
                                                    value={field.value ?? ""}
                                                    onValueChange={(values) => field.onChange(values.floatValue)}
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error?.message}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">درصد</InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            )}
                                        />
                                    )}
                                </div>

                                <div className="min-w-32">
                                    <Controller
                                        name="discount_type"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormControl className="w-full" size="medium">
                                                <InputLabel id="discount-type-label">نوع تخفیف</InputLabel>
                                                <Select
                                                    error={!!form.formState.errors.discount_type}
                                                    {...field}
                                                    labelId="discount-type-label"
                                                    label="نوع تخفیف"
                                                >
                                                    <MenuItem value="amount">مبلغ ثابت</MenuItem>
                                                    <MenuItem value="percentage">درصدی</MenuItem>
                                                </Select>
                                            </FormControl>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="w-full flex flex-col gap-3">
                                <div className="w-full flex justify-between items-center">
                                    <h4>محصول نیاز به زمان آماده‌سازی دارد</h4>
                                    <Controller
                                        name="need_preparation_time"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Switch
                                                {...field}
                                                checked={field.value}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                            />
                                        )}
                                    />
                                </div>

                                {form.watch("need_preparation_time") && (
                                    <Controller
                                        name="preparation_time"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <NumericFormat
                                                customInput={TextField}
                                                thousandSeparator=","
                                                allowNegative={false}
                                                className="w-full"
                                                size="medium"
                                                label="روز"
                                                variant="outlined"
                                                value={field.value ?? ""}
                                                onValueChange={(values) => field.onChange(values.floatValue)}
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                            />
                                        )}
                                    />
                                )}
                            </div>

                            <div className="w-full flex flex-col gap-2">
                                <div className="w-full flex justify-between items-center">
                                    <h4>می‌خواهم محصول “ارسال امروز” داشته باشد</h4>
                                    <Controller
                                        name="need_preparation_time"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Switch
                                                {...field}
                                                checked={!field.value}
                                                onChange={() =>
                                                    form.setValue("need_preparation_time", !field.value)
                                                }
                                            />
                                        )}
                                    />
                                </div>

                                {!form.watch("need_preparation_time") && (
                                    <h4 className="text-[12px] text-gray-600">
                                        برچسب “ارسال امروز”، روی کارت این محصول در فروشگاه نمایش داده خواهد شد.
                                    </h4>
                                )}
                            </div>

                            <div className="w-full flex flex-col gap-3">
                                <div className="w-full flex justify-between items-center">
                                    <h4>محدودیت تعداد برای هر سفارش</h4>
                                    <Controller
                                        name="has_order_limit"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Switch
                                                {...field}
                                                checked={field.value}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                            />
                                        )}
                                    />
                                </div>

                                {form.watch("has_order_limit") && (
                                    <Controller
                                        name="order_limit"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <NumericFormat
                                                customInput={TextField}
                                                thousandSeparator=","
                                                allowNegative={false}
                                                className="w-full"
                                                size="medium"
                                                label="حداکثر تعداد قابل سفارش"
                                                variant="outlined"
                                                value={field.value ?? ""}
                                                onValueChange={(values) => field.onChange(values.floatValue)}
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                            />
                                        )}
                                    />
                                )}
                            </div>

                            <div className="w-full flex justify-between items-center">
                                <h4>تنوع محصول پیش‌فرض</h4>
                                <Switch
                                    checked={pv.is_default}
                                    onChange={() => {
                                        useProductVariantsStore.getState().setDefaultVariant(pvIndex);
                                        form.setValue("is_default", true);
                                    }}
                                />
                            </div>
                        </div>

                        <Button
                            variant="contained"
                            className="w-full"
                            type="submit"
                        >
                            {form.formState.isSubmitting ? "در حال ذخیره..." : "ثبت تنوع محصول"}
                        </Button>
                    </form>
                </Paper>
            </div>
        </Modal>
    );
}
