"use client";

import React, { useEffect, useRef, useState } from "react";
import { TextField, Button, Paper, CircularProgress } from "@mui/material";
import { Plus } from "lucide-react";
import { apiClient, ApiError } from "@/lib/apiClient";
import {useProductAttributesStore} from "@/store/productAttributesStore";

interface AttributeValue {
    id: number;
    value: string;
    attribute_id?: number;
}

interface Attribute {
    id: number;
    name: string;
    values: AttributeValue[];
}

interface ProductAttributesSelectorProps {
    onChange: (selected: { [attributeId: number]: AttributeValue }) => void;
    close: () => void;
}

const ProductAttributesSelector: React.FC<ProductAttributesSelectorProps> = ({ onChange, close }) => {
    const [attributes, setAttributes] = useState<Attribute[]>([]);
    const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(null);
    const [selectedValues, setSelectedValues] = useState<{ [key: number]: AttributeValue }>({});
    const [searchAttribute, setSearchAttribute] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [openAttributeList, setOpenAttributeList] = useState(false);
    const [openValueList, setOpenValueList] = useState(false);
    const [loadingAttributes, setLoadingAttributes] = useState(false);
    const [creatingAttribute, setCreatingAttribute] = useState(false);
    const [creatingValue, setCreatingValue] = useState(false);

    const attrRef = useRef<HTMLDivElement>(null);
    const valRef = useRef<HTMLDivElement>(null);

    const {addOrUpdateAttribute} = useProductAttributesStore()

    useEffect(() => {
        const fetchAttributes = async () => {
            setLoadingAttributes(true);
            try {
                const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/attributes`, {
                    withCredentials: true,
                });
                setAttributes(Array.isArray(res) ? res : res.data || []);
            } catch (err) {
                const error = err as ApiError;
                alert(error.message || "خطا در دریافت مشخصه‌ها");
            } finally {
                setLoadingAttributes(false);
            }
        };
        fetchAttributes();
    }, []);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                attrRef.current && !attrRef.current.contains(e.target as Node) &&
                valRef.current && !valRef.current.contains(e.target as Node)
            ) {
                setOpenAttributeList(false);
                setOpenValueList(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredAttributes = attributes.filter((a) =>
        a.name.toLowerCase().includes(searchAttribute.toLowerCase())
    );

    const filteredValues =
        selectedAttribute?.values.filter((v) =>
            v.value.toLowerCase().includes(searchValue.toLowerCase())
        ) || [];

    // 🔹 فانکشن ذخیره در استور
    const saveToStoreIfReady = (attr: Attribute | null, value: AttributeValue | null) => {
        if (attr && value) {
            addOrUpdateAttribute({
                attribute_id: attr.id,
                attribute_name: attr.name,
                value_id: value.id,
                value: value.value,
            });
        }
    };

    const handleSelectAttribute = (attr: Attribute) => {
        setSelectedAttribute(attr);
        setSearchAttribute(attr.name);
        setOpenAttributeList(false);
        setSearchValue("");

        const value = selectedValues[attr.id] || null;
        saveToStoreIfReady(attr, value);
    };

    const handleCreateAttribute = async () => {
        if (!searchAttribute.trim()) return;

        const exists = attributes.some(
            (a) => a.name.toLowerCase() === searchAttribute.trim().toLowerCase()
        );
        if (exists) return;

        try {
            setCreatingAttribute(true);
            const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/attributes`, {
                method: "POST",
                body: { name: searchAttribute.trim() },
                withCredentials: true,
            });

            const created: Attribute = { ...(res.data || res), values: [] };
            setAttributes((prev) => [...prev, created]);
            setSelectedAttribute(created);
            setOpenAttributeList(false);
        } catch (err) {
            const error = err as ApiError;
            alert(error.message || "خطا در ایجاد ویژگی جدید");
        } finally {
            setCreatingAttribute(false);
        }
    };

    const handleSelectValue = (value: AttributeValue) => {
        if (!selectedAttribute) return;
        const updated = { ...selectedValues, [selectedAttribute.id]: value };
        setSelectedValues(updated);
        onChange(updated);
        setSearchValue(value.value);
        setOpenValueList(false);
        saveToStoreIfReady(selectedAttribute, value);
        close()
    };

    const handleCreateValue = async () => {
        if (!selectedAttribute || !searchValue.trim()) return;

        const exists = selectedAttribute.values.some(
            (v) => v.value.toLowerCase() === searchValue.trim().toLowerCase()
        );
        if (exists) return;

        try {
            setCreatingValue(true);
            const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/attributeValues`, {
                method: "POST",
                body: {
                    attribute_id: selectedAttribute.id,
                    value: searchValue.trim(),
                },
                withCredentials: true,
            });

            const created: AttributeValue = res.data;

            const updatedAttributes = attributes.map((a) =>
                a.id === selectedAttribute.id
                    ? { ...a, values: [...a.values, created] }
                    : a
            );
            setAttributes(updatedAttributes);

            const updatedSelected = updatedAttributes.find(a => a.id === selectedAttribute.id)!;
            setSelectedAttribute(updatedSelected);

            handleSelectValue(created);
        } catch (err) {
            const error = err as ApiError;
            alert(error.message || "خطا در ایجاد مقدار جدید");
        } finally {
            setCreatingValue(false);
            close()
        }
    };

    const isNewAttribute =
        searchAttribute.trim() &&
        !attributes.some(
            (a) => a.name.toLowerCase() === searchAttribute.trim().toLowerCase()
        );

    const isNewValue =
        searchValue.trim() &&
        selectedAttribute &&
        !selectedAttribute.values.some(
            (v) => v.value.toLowerCase() === searchValue.trim().toLowerCase()
        );

    return (
        <div className="flex flex-col gap-6">
            {/* ATTRIBUTE SELECTOR */}
            <div ref={attrRef} className="w-full flex items-center gap-3 relative">
                <TextField
                    value={searchAttribute}
                    onChange={(e) => setSearchAttribute(e.target.value)}
                    onFocus={() => {
                        setOpenAttributeList(true);
                        setOpenValueList(false);
                    }}
                    placeholder="انتخاب یا افزودن ویژگی"
                    className="w-full"
                    size="small"
                />
                <Button
                    variant="contained"
                    disabled={!isNewAttribute || creatingAttribute}
                    onClick={handleCreateAttribute}
                    className="w-28 h-9 gap-1"
                >
                    {creatingAttribute ? (
                        <CircularProgress size={18} color="inherit" />
                    ) : (
                        <>
                            <Plus className="size-4" />
                            افزودن
                        </>
                    )}
                </Button>

                {openAttributeList && (
                    <Paper
                        className="absolute top-12 right-0 border border-gray-200 z-20"
                        sx={{
                            width: "calc(100% - 7rem)",
                            maxHeight: 250,
                            overflowY: "auto",
                            backgroundColor: "#fff",
                        }}
                    >
                        {filteredAttributes.length > 0 ? (
                            filteredAttributes.map((a) => (
                                <div
                                    key={a.id}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => handleSelectAttribute(a)}
                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                >
                                    {a.name}
                                </div>
                            ))
                        ) : (
                            <div className="p-3 text-gray-500 text-sm">ویژگی‌ای یافت نشد</div>
                        )}
                    </Paper>
                )}
            </div>

            {/* VALUE SELECTOR */}
            {selectedAttribute && (
                <div ref={valRef} className="w-full flex items-center gap-3 relative">
                    <TextField
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onFocus={() => {
                            setOpenValueList(true);
                            setOpenAttributeList(false);
                        }}
                        placeholder="انتخاب یا افزودن مقدار"
                        className="w-full"
                        size="small"
                    />
                    <Button
                        variant="contained"
                        onClick={handleCreateValue}
                        disabled={!isNewValue || creatingValue}
                        className="w-28 h-9 gap-1"
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

                    {openValueList && (
                        <Paper
                            className="absolute top-12 right-0 border border-gray-200 z-20"
                            sx={{
                                width: "calc(100% - 7rem)",
                                maxHeight: 250,
                                overflowY: "auto",
                                backgroundColor: "#fff",
                            }}
                        >
                            {filteredValues.length > 0 ? (
                                filteredValues.map((v) => (
                                    <div
                                        key={v.id}
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => handleSelectValue(v)}
                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                    >
                                        {v.value}
                                    </div>
                                ))
                            ) : (
                                <div className="p-3 text-gray-500 text-sm">مقداری یافت نشد</div>
                            )}
                        </Paper>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductAttributesSelector;