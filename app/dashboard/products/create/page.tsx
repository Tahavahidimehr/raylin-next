"use client"

import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    IconButton, InputAdornment,
    InputLabel, MenuItem,
    Paper,
    Select,
    Switch,
    TextField, Typography
} from "@mui/material";
import {ChevronRight, Edit, Plus, Tags} from "lucide-react";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import VariantsModal from "@/components/dashboard/VariantsModal";
import ProductVariantModal from "@/components/dashboard/ProductVariantModal";
import MediaUploader from "@/components/dashboard/MediaUploader";
import ProductCategorySelector from "@/components/dashboard/ProductCategorySelector";
import ProductAttributes from "@/components/dashboard/ProductAttributes";
import {useProductVariantsStore} from "@/store/productVariantsStore";
import useProductStore from "@/store/productStore";
import { NumericFormat } from 'react-number-format';
import {Controller, useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {ProductFormType, productSchema} from "@/schemas/productSchema";
import {apiClient, ApiError} from "@/lib/apiClient";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";

export default function CreateProduct() {

    const [showVariantsModal, setShowVariantsModal] = useState(false)
    const [showProductVariantModal, setShowProductVariantModal] = useState(false)
    const [currentProductVariantId, setCurrentProductVariantId] = useState<string | null>(null);
    const { variants, productVariants, generateProductVariants } = useProductVariantsStore();
    const  [loading, setLoading] = useState(false)

    const router = useRouter()

    useEffect(() => {
        if (variants.length > 0) {
            generateProductVariants();
        }
        productStore.syncTypeWithVariants(variants.length);
        form.setValue('type', variants.length > 0 ? 'variable' : 'simple');
    }, [variants]);

    const productStore = useProductStore();

    const form = useForm<ProductFormType>({
        resolver: zodResolver(productSchema),
        defaultValues: useProductStore.getState(),
    });

    useEffect(() => {
        const subscription = form.watch((values) => {
            const currentId = productStore.id;

            Object.entries(values).forEach(([key, value]) => {
                productStore.setField(key as keyof ProductFormType, value as any);
            });

            if (currentId && !values.id) {
                productStore.setField("id", currentId as any);
            }
        });

        return () => subscription.unsubscribe();
    }, [form.watch]);

    const createAndSyncProductVariants = async (productId: number) => {
        try {
            const { productVariants, updateVariantId } = useProductVariantsStore.getState();

            if (!productVariants.length) return;

            for (const variant of productVariants) {
                // مرحله ۱: ایجاد واریانت
                const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/productVariants`, {
                    method: "POST",
                    withCredentials: true,
                    body: {
                        product_id: productId,
                        price: variant.price,
                        discount_type: variant.discount_type,
                        discount_amount: variant.discount_amount,
                        discount_percentage: variant.discount_percentage,
                        need_preparation_time: variant.need_preparation_time,
                        preparation_time: variant.preparation_time,
                        has_order_limit: variant.has_order_limit,
                        order_limit: variant.order_limit,
                        is_default: variant.is_default,
                        variant_values: variant.combination.map((c) => c.valueId),
                    },
                });

                const newId = res?.data?.id;
                if (!newId) continue;

                // جایگزینی UUID با ID واقعی
                updateVariantId(variant.id.toString(), newId);

                // مرحله ۲: سینک مدیا برای این واریانت
                if (variant.media && variant.media.length > 0) {
                    await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/medias/sync`, {
                        method: "POST",
                        withCredentials: true,
                        body: {
                            mediable_id: newId,
                            mediable_type: "App\\Models\\ProductVariant",
                            media: variant.media.map((m) => ({
                                id: m.id,
                                is_main: m.is_main ?? false,
                            })),
                            clear_previous: true,
                        },
                    });
                }
            }

            toast.success("ویژگی های محصول با موفقیت ساخته شدند");
        } catch (error) {
            console.error("Error syncing product variants:", error);
            toast.error("خطا در ساخت واریانت‌ها");
        }
    };

    const onSubmit = async (data: ProductFormType) => {
        setLoading(true);
        try {
            let res;

            if (!productStore.id) {
                res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
                    method: "POST",
                    body: data,
                    withCredentials: true,
                });

                if (res?.data?.id) {
                    productStore.setProductId(res.data.id);
                    Object.entries(res.data).forEach(([key, value]) =>
                        productStore.setField(key as keyof ProductFormType, value as any)
                    );
                    if (productStore.media?.length > 0) {
                        await syncProductMedia(res?.data?.id);
                    }
                    await createAndSyncProductVariants(res.data.id);
                    toast.success(res.message);
                }
            } else {
                res = await apiClient(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productStore.id}`,
                    {
                        method: "PUT",
                        body: data,
                        withCredentials: true,
                    }
                );

                if (res?.data) {
                    Object.entries(res.data).forEach(([key, value]) =>
                        productStore.setField(key as keyof ProductFormType, value as any)
                    );
                }

                if (productStore.media?.length > 0) {
                    await syncProductMedia(res?.data?.id);
                }

                if (productVariants.length > 0) {
                    await createAndSyncProductVariants(productStore.id);
                }
            }
            useProductVariantsStore.getState().reset();
            productStore.reset()
            router.push(`/products`);
        } catch (err) {
            const error = err as ApiError;
            toast.error(error.message || "خطا در ذخیره محصول");
        } finally {
            setLoading(false);
        }
    };

    const syncProductMedia = async (productId?: number) => {
        try {
            const id = productId ?? productStore.id;
            if (!id) return;
            if (!productStore.media?.length) return;

            const body = {
                mediable_id: id,
                mediable_type: "App\\Models\\Product",
                media: productStore.media.map((m) => ({
                    id: m.id,
                    is_main: m.is_main ?? false,
                })),
                clear_previous: true,
            };

            await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/medias/sync`, {
                method: "POST",
                withCredentials: true,
                body,
            });

        } catch (err) {
            console.error("Error syncing media:", err);
        }
    };

    return (
        <>
            <div className="w-full flex justify-start items-center py-5 gap-2">
                <Link href="/dashboard/products">
                    <IconButton>
                        <ChevronRight className="size-5 text-gray-600" />
                    </IconButton>
                </Link>
                <h2 className="text-xl font-semibold">افزودن محصول جدید</h2>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Paper
                    sx={{
                        width: "100%",
                        height: "calc(100vh - 95px)",
                        overflowY: "auto",
                        boxShadow: "none",
                        backgroundColor: "#f3f4f6",
                        "&::-webkit-scrollbar": {
                            display: "none",
                        },
                        msOverflowStyle: "none",
                        scrollbarWidth: "none",
                    }}
                >
                    <div className="flex flex-col gap-5">
                        <Controller
                            name="media"
                            control={form.control}
                            render={({ field }) => (
                                <MediaUploader
                                    folder="products"
                                    allowImages
                                    allowVideos
                                    maxImages={4}
                                    maxVideos={1}
                                    media={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        <div className="w-full bg-white flex flex-col shadow rounded px-5 py-6 gap-5">
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="نام محصول"
                                        variant="outlined"
                                        fullWidth
                                        error={!!form.formState.errors.name}
                                        helperText={form.formState.errors.name?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="price"
                                control={form.control}
                                render={({ field }) => (
                                    <NumericFormat
                                        customInput={TextField}
                                        thousandSeparator=","
                                        allowNegative={false}
                                        disabled={productStore.type === 'variable'}
                                        label="قیمت"
                                        value={field.value ?? null}
                                        onValueChange={(values) => {
                                            console.log(values.floatValue)
                                            field.onChange(values.floatValue)
                                        }}
                                        error={!!form.formState.errors.price}
                                        helperText={form.formState.errors.price?.message}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">تومان</InputAdornment>,
                                        }}
                                    />
                                )}
                            />
                            <Controller
                                name="category_id"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <ProductCategorySelector
                                            selectedCategory={field.value ?? null}
                                            onSelect={field.onChange}
                                        />
                                        {fieldState.error && (
                                            <Typography variant="caption" color="error">
                                                {fieldState.error.message}
                                            </Typography>
                                        )}
                                    </>
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
                                                    className="w-full"
                                                    customInput={TextField}
                                                    thousandSeparator=","
                                                    allowNegative={false}
                                                    disabled={productStore.type === 'variable'}
                                                    label="تخفیف"
                                                    value={field.value}
                                                    onValueChange={(values) => field.onChange(values.floatValue)}
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error?.message}
                                                    InputProps={{
                                                        endAdornment: <InputAdornment position="end">تومان</InputAdornment>,
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
                                                    className="w-full"
                                                    customInput={TextField}
                                                    thousandSeparator=","
                                                    allowNegative={false}
                                                    disabled={productStore.type === 'variable'}
                                                    label="تخفیف"
                                                    value={field.value}
                                                    onValueChange={(values) => field.onChange(values.floatValue)}
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error?.message}
                                                    InputProps={{
                                                        endAdornment: <InputAdornment position="end">درصد</InputAdornment>,
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
                                            <FormControl fullWidth>
                                                <InputLabel id="discount_type_label">نوع تخفیف</InputLabel>
                                                <Select {...field} labelId="discount_type_label" label="نوع تخفیف" disabled={productStore.type === 'variable'}>
                                                    <MenuItem value="amount">مبلغ ثابت</MenuItem>
                                                    <MenuItem value="percentage">درصدی</MenuItem>
                                                </Select>
                                            </FormControl>
                                        )}
                                    />
                                </div>
                            </div>
                            <Controller
                                name="special_offer"
                                control={form.control}
                                render={({ field }) => (
                                    <FormControlLabel
                                        control={<Checkbox {...field} checked={field.value} />}
                                        label="افزودن محصول به پیشنهاد ویژه"
                                    />
                                )}
                            />
                            <div className="w-full flex items-center gap-5">
                                <div className="w-full">
                                    <Controller
                                        name="weight"
                                        control={form.control}
                                        render={({ field }) => (
                                            <NumericFormat
                                                className="w-full"
                                                customInput={TextField}
                                                thousandSeparator=","
                                                allowNegative={false}
                                                label="وزن"
                                                error={!!form.formState.errors.weight}
                                                helperText={form.formState.errors.weight?.message}
                                                value={field.value}
                                                onValueChange={(values) => field.onChange(values.floatValue)}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="min-w-32">
                                    <Controller
                                        name="weight_unit"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormControl fullWidth>
                                                <InputLabel id="weight_unit_label">واحد</InputLabel>
                                                <Select {...field} labelId="weight_unit_label" label="واحد">
                                                    <MenuItem value="g">گرم</MenuItem>
                                                    <MenuItem value="kg">کیلوگرم</MenuItem>
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
                                                disabled={productStore.type === 'variable'}
                                            />
                                        )}
                                    />
                                </div>
                                {
                                    form.watch("need_preparation_time") === true && (
                                        <Controller
                                            name="preparation_time"
                                            control={form.control}
                                            render={({ field }) => (
                                                <NumericFormat
                                                    customInput={TextField}
                                                    thousandSeparator=","
                                                    allowNegative={false}
                                                    disabled={productStore.type === 'variable'}
                                                    label="روز"
                                                    value={field.value}
                                                    onValueChange={(values) => field.onChange(values.floatValue)}
                                                    error={!!form.formState.errors.preparation_time}
                                                    helperText={form.formState.errors.preparation_time?.message}
                                                />
                                            )}
                                        />
                                    )
                                }
                            </div>
                            <div className="w-full flex flex-col gap-2">
                                <div className="w-full flex justify-between items-center">
                                    <h4>می خواهم محصول “ارسال امروز” داشته باشد.</h4>
                                    <Controller
                                        name="need_preparation_time"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Switch
                                                {...field}
                                                disabled={productStore.type === 'variable'}
                                                checked={!field.value}
                                                onChange={() => {
                                                    form.setValue("need_preparation_time", !field.value);
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                                {
                                    form.watch("need_preparation_time") !== true && (
                                        <h4 className="text-[12px] text-gray-600">برچسب “ارسال امروز” ، روی کارت این محصول در فروشگاه نمایش داده خواهد شد.</h4>
                                    )
                                }
                            </div>
                            <Controller
                                name="description"
                                control={form.control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="توضیحات"
                                        multiline
                                        rows={5}
                                        error={!!form.formState.errors.description}
                                        helperText={form.formState.errors.description?.message}
                                    />
                                )}
                            />
                            <div className="w-full flex flex-col gap-3">
                                <div className="w-full flex justify-between items-center">
                                    <h4>محدودیت تعداد برای هر سفارش</h4>
                                    <Controller
                                        name="has_order_limit"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Switch
                                                {...field}
                                                disabled={productStore.type === 'variable'}
                                                checked={field.value}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                            />
                                        )}
                                    />
                                </div>
                                {
                                    form.watch("has_order_limit") === true && (
                                        <Controller
                                            name="order_limit"
                                            control={form.control}
                                            render={({ field }) => (
                                                <NumericFormat
                                                    customInput={TextField}
                                                    thousandSeparator=","
                                                    allowNegative={false}
                                                    label="حداکثر تعداد قابل سفارش"
                                                    value={field.value}
                                                    onValueChange={(values) => field.onChange(values.floatValue)}
                                                    error={!!form.formState.errors.order_limit}
                                                    helperText={form.formState.errors.order_limit?.message}
                                                />
                                            )}
                                        />
                                    )
                                }
                            </div>
                        </div>
                        <ProductAttributes />
                        <div className="w-full bg-white flex flex-col shadow rounded p-5 gap-5">
                            <div className="w-full flex justify-between">
                                <h5>ویژگی های محصول</h5>
                                {
                                    productVariants.length > 0 ? (
                                        <Button onClick={() => setShowVariantsModal(true)} variant="text" className="gap-2">
                                            <Edit className="size-4" />
                                            ویرایش ویژگی ها
                                        </Button>
                                    ) : (
                                        <Button onClick={() => setShowVariantsModal(true)} variant="text" className="gap-2">
                                            <Plus className="size-4" />
                                            افزودن ویژگی
                                        </Button>
                                    )
                                }
                            </div>
                            {
                                productVariants.length > 0 ? (
                                    variants.map(variant => (
                                        variant.selectedValueIds.length > 0 && (
                                            <div key={variant.id} className="flex flex-col gap-5">
                                                <Typography component="span" className="flex gap-2 items-center">
                                                    <Tags className="size-5 text-gray-500" />
                                                    <h6 className="text-sm">{variant.name}</h6>
                                                </Typography>
                                                <div className="flex items-center gap-5">
                                                    {
                                                        variant.selectedValueIds.length > 0 && (
                                                            variant.selectedValueIds.map((selectedValueId) => (
                                                                <span key={variant.id + selectedValueId} className="px-3 py-1 rounded-full bg-violet-100 text-prime text-sm">
                                                                {
                                                                    variant.values.find((vv) => vv.id === selectedValueId)?.value
                                                                }
                                                            </span>
                                                            ))
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        )
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 text-center my-5">این محصول تنوع رنگ‌بندی و سایزبندی و ... دارد؟ از این بخش می‌تونید آنها را اضافه کنید</p>
                                )
                            }
                        </div>
                        {
                            productVariants.length > 0 && (
                                <h5 className="border-r-2 pr-4 border-gray-300">تنوع های محصول</h5>
                            )
                        }
                        <div className="w-full flex flex-col gap-3">
                            {productVariants.length === 0 ? null : (
                                productVariants.map(pv => (
                                    <div key={pv.id} className="w-full bg-white flex flex-col shadow rounded p-5 gap-2">
                                        <div className="w-full flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                {pv.combination.map((c, idx) => (
                                                    <React.Fragment key={c.valueId}>
                                                        <h4>{c.name}</h4>
                                                        {idx < pv.combination.length - 1 && <span>،</span>}
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                            <IconButton onClick={() => {
                                                setCurrentProductVariantId(String(pv.id))
                                                setShowProductVariantModal(true)
                                            }}>
                                                <Edit className="size-5 text-prime" />
                                            </IconButton>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <Button type="submit" variant="contained" className="w-full" disabled={loading}>{loading ? "ثبت محصول ..." : "ثبت محصول"}</Button>
                    </div>
                </Paper>
            </form>
            <VariantsModal open={showVariantsModal} close={() => setShowVariantsModal(false)} />
            <ProductVariantModal productVariantId={currentProductVariantId} open={showProductVariantModal} close={() => setShowProductVariantModal(false)} />
        </>
    )
}