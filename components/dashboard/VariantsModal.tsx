"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    IconButton,
    Modal,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { ChevronDown, ChevronRight, Plus, Tags, X, Trash2 } from "lucide-react";
import { useProductVariantsStore } from "@/store/productVariantsStore";
import { apiClient, ApiError } from "@/lib/apiClient";

/* ---------- Types ---------- */
interface Variant {
    id: number;
    name: string;
    values: { id: number; value: string }[];
    selectedValueIds: number[];
}

interface VariantValue {
    id: number;
    value: string;
}

/* ---------- Main Modal ---------- */
export default function VariantsModal({
                                          open,
                                          close,
                                      }: {
    open: boolean;
    close: () => void;
}) {
    const { variants, addVariant, removeVariant } = useProductVariantsStore();
    const [variantName, setVariantName] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [loadingVariants, setLoadingVariants] = useState(false);
    const [creatingVariant, setCreatingVariant] = useState(false);
    const [openList, setOpenList] = useState(false);
    const [allVariants, setAllVariants] = useState<Variant[]>([]);
    const [expandedId, setExpandedId] = useState<number | false>(false);
    const ref = useRef<HTMLDivElement>(null);

    /* --- دریافت لیست variant ها --- */
    useEffect(() => {
        if (open) {
            if (variants.length === 0) setShowForm(true);
            else setShowForm(false);
            fetchVariants();
        }
    }, [open]);

    const fetchVariants = async () => {
        setLoadingVariants(true);
        try {
            const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/variants`);
            setAllVariants(Array.isArray(res) ? res : res.data || []);
        } catch (err) {
            const error = err as ApiError;
            console.error("خطا در دریافت واریانت‌ها:", error.message);
        } finally {
            setLoadingVariants(false);
        }
    };

    /* --- فیلتر واریانت‌ها --- */
    const filteredVariants = allVariants
        .filter((v) => !variants.some((vv) => vv.id === v.id))
        .filter((v) => v.name.toLowerCase().includes(variantName.toLowerCase()));

    const isNewVariant =
        variantName.trim() &&
        !variants.some((v) => v.name.toLowerCase() === variantName.trim().toLowerCase());

    /* --- انتخاب variant از لیست --- */
    const handleSelectVariant = (variant: Variant) => {
        addVariant(variant);
        setVariantName("");
        setOpenList(false);
        setShowForm(false);
        setExpandedId(variant.id);
    };

    /* --- ساخت variant جدید --- */
    const handleCreateVariant = async () => {
        if (!variantName.trim()) return;
        setCreatingVariant(true);
        try {
            const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/variants`, {
                method: "POST",
                body: { name: variantName.trim() },
                withCredentials: true,
            });
            const created: Variant = res.data || res;
            addVariant(created);
            setAllVariants((prev) => [...prev, created]);
            setVariantName("");
            setShowForm(false);
            setOpenList(false);
            setExpandedId(created.id);
        } catch (err) {
            const error = err as ApiError;
            alert(error.message || "خطا در ساخت ویژگی جدید");
        } finally {
            setCreatingVariant(false);
        }
    };

    /* --- حذف variant --- */
    const handleRemoveVariant = (id: number) => {
        removeVariant(id);
        if (expandedId === id) setExpandedId(false);
    };

    /* --- بستن لیست با کلیک بیرون --- */
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpenList(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <Modal
            open={open}
            onClose={close}
            aria-labelledby="variantModalLabel"
            aria-describedby="variantModalDescription"
            className="flex justify-center items-center mx-5"
        >
            <div className="w-full max-w-xl h-10/12 bg-gray-100 rounded p-5 flex flex-col gap-5">
                {/* Header */}
                <div className="w-full flex justify-between items-center">
                    <div className="w-full flex justify-start items-center gap-1">
                        <IconButton onClick={close}>
                            <ChevronRight className="size-5 text-gray-600" />
                        </IconButton>
                        <h2 className="font-semibold">ویژگی‌های محصول</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        {variants.length < 3 && !showForm && (
                            <Button
                                className="w-32 h-9 gap-2"
                                variant="text"
                                onClick={() => setShowForm(true)}
                            >
                                <Plus className="size-4" />
                                افزودن ویژگی
                            </Button>
                        )}
                        <IconButton onClick={close}>
                            <X className="size-5 text-gray-600" />
                        </IconButton>
                    </div>
                </div>

                {/* Body */}
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
                    {/* فرم افزودن Variant */}
                    {showForm && (
                        <div className="w-full rounded bg-white flex flex-col p-5 gap-5">
                            <h5 className="text-gray-600 font-semibold">ویژگی جدید</h5>
                            <div className="w-full flex items-center gap-5 relative" ref={ref}>
                                <TextField
                                    className="w-full"
                                    size="small"
                                    label="نام ویژگی"
                                    variant="outlined"
                                    value={variantName}
                                    onChange={(e) => {
                                        setVariantName(e.target.value);
                                        setOpenList(true);
                                    }}
                                    onFocus={() => setOpenList(true)}
                                />
                                <Button
                                    className="w-28 h-9 gap-1"
                                    variant="contained"
                                    disabled={!isNewVariant || creatingVariant}
                                    onClick={handleCreateVariant}
                                >
                                    {creatingVariant ? (
                                        <CircularProgress size={18} color="inherit" />
                                    ) : (
                                        <>
                                            <Plus className="size-4" />
                                            افزودن
                                        </>
                                    )}
                                </Button>

                                {openList && (
                                    <Paper
                                        className="absolute top-12 right-0 border border-gray-200 z-20"
                                        sx={{
                                            width: "calc(100% - 7rem)",
                                            maxHeight: 250,
                                            overflowY: "auto",
                                            backgroundColor: "#fff",
                                        }}
                                    >
                                        {loadingVariants ? (
                                            <div className="p-3 text-sm text-gray-500">
                                                در حال بارگذاری...
                                            </div>
                                        ) : filteredVariants.length > 0 ? (
                                            filteredVariants.map((v) => (
                                                <div
                                                    key={v.id}
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    onClick={() => handleSelectVariant(v)}
                                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                                >
                                                    {v.name}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-3 text-sm text-gray-500">
                                                ویژگی‌ای یافت نشد
                                            </div>
                                        )}
                                    </Paper>
                                )}
                            </div>
                        </div>
                    )}

                    {variants.map((variant: Variant) => (
                        <Accordion
                            key={variant.id}
                            variant="outlined"
                            expanded={expandedId === variant.id}
                            onChange={() =>
                                setExpandedId(expandedId === variant.id ? false : variant.id)
                            }
                        >
                            <AccordionSummary
                                expandIcon={<ChevronDown className="size-5 text-gray-500" />}
                                aria-controls={`panel-${variant.id}-content`}
                                id={`panel-${variant.id}-header`}
                            >
                                <div className="w-full flex justify-between items-center ml-5">
                                    <Typography component="span" className="flex gap-2 items-center">
                                        <Tags className="size-5 text-gray-500" />
                                        <h6 className="text-sm">{variant.name}</h6>
                                    </Typography>
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveVariant(variant.id);
                                        }}
                                        className="cursor-pointer"
                                    >
                                        <Trash2 className="size-5 text-gray-500" />
                                    </div>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <VariantValuesSection variant={variant} />
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Paper>
            </div>
        </Modal>
    );
}

/* ---------- زیرکامپوننت: مدیریت مقادیر variant ---------- */
function VariantValuesSection({ variant }: { variant: Variant }) {
    const { updateSelectedValues, updateVariantValues } = useProductVariantsStore();
    const [values, setValues] = useState<VariantValue[]>(variant.values || []);
    const [creatingValue, setCreatingValue] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [openList, setOpenList] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // مقادیر انتخاب شده مستقیم از استور میاد
    const selectedValues = variant.selectedValueIds || [];

    const filteredValues = (values || []).filter((v) =>
        v.value.toLowerCase().includes(searchValue.toLowerCase())
    );

    const isNewValue =
        searchValue.trim() &&
        !values.some((v) => v.value.toLowerCase() === searchValue.trim().toLowerCase()) &&
        !selectedValues.some((id) => values.find((v) => v.id === id)?.value.toLowerCase() === searchValue.trim().toLowerCase());

    const handleToggleValue = (id: number) => {
        let newSelected: number[];
        if (selectedValues.includes(id)) {
            newSelected = selectedValues.filter((v) => v !== id);
        } else {
            newSelected = [...selectedValues, id];
        }
        updateSelectedValues(variant.id, newSelected);
    };

    const handleCreateValue = async () => {
        if (!searchValue.trim()) return;
        setCreatingValue(true);
        try {
            const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/variantValues`, {
                method: "POST",
                body: { variant_id: variant.id, value: searchValue.trim() },
                withCredentials: true,
            });
            const created: VariantValue = res.data || res;
            setValues((prev) => [...prev, created]);
            updateSelectedValues(variant.id, [...selectedValues, created.id]);
            updateVariantValues(variant.id, [...values, created]);
            setSearchValue("");
        } catch (err) {
            const error = err as ApiError;
            alert(error.message || "خطا در ایجاد مقدار جدید");
        } finally {
            setCreatingValue(false);
        }
    };

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpenList(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="w-full flex flex-col gap-5 bg-gray-100 rounded p-5 relative">
            <div ref={ref} className="w-full flex items-center gap-5 relative">
                <TextField
                    className="w-full"
                    size="small"
                    label="جستجو یا افزودن مقدار"
                    variant="outlined"
                    value={searchValue}
                    onChange={(e) => {
                        setSearchValue(e.target.value);
                        setOpenList(true);
                    }}
                    onFocus={() => setOpenList(true)}
                />
                <Button
                    className="w-28 h-9 gap-1"
                    variant="contained"
                    disabled={!isNewValue || creatingValue}
                    onClick={handleCreateValue}
                >
                    {creatingValue ? (
                        <CircularProgress size={18} color="inherit" />
                    ) : (
                        <>
                            <Plus className="size-4" />
                            افزودن
                        </>
                    )}
                </Button>

                {openList && (
                    <Paper
                        className="absolute top-[44px] right-0 border border-gray-200 z-30 shadow-md"
                        sx={{
                            width: "calc(100% - 7rem)",
                            maxHeight: 200,
                            overflowY: "auto",
                            backgroundColor: "#fff",
                        }}
                    >
                        {filteredValues.length > 0 ? (
                            filteredValues.map((v) => (
                                <div
                                    key={v.id}
                                    onMouseDown={(e) => e.preventDefault()}
                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={selectedValues.includes(v.id)}
                                                onChange={() => handleToggleValue(v.id)}
                                            />
                                        }
                                        label={v.value}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="p-3 text-sm text-gray-500">مقداری یافت نشد</div>
                        )}
                    </Paper>
                )}
            </div>

            {selectedValues.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {values
                        .filter((v) => selectedValues.includes(v.id))
                        .map((v) => (
                            <span
                                key={v.id}
                                className="flex items-center gap-1 px-3 py-1 bg-violet-100 text-prime rounded-full text-xs"
                            >
                                {v.value}
                                <X
                                    className="size-3 cursor-pointer"
                                    onClick={() =>
                                        handleToggleValue(v.id)
                                    }
                                />
                            </span>
                        ))}
                </div>
            )}
        </div>
    );
}