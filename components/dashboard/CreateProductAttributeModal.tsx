"use client"

import {Accordion, AccordionActions, AccordionDetails, AccordionSummary,
    Button, IconButton, Modal, Paper, TextField, Typography} from "@mui/material";
import React, {useState} from "react";
import {ChevronDown, ChevronRight, Plus, Settings, Tags, X} from "lucide-react";
import ProductAttributesSelector from "@/components/dashboard/ProductAttributesSelector";
import {useProductAttributesStore} from "@/store/productAttributesStore";

export default function CreateProductAttributeModal({open, close}: {open: boolean, close: () => void}) {

    const [attributesData, setAttributesData] = useState<{ [id: number]: any }>({});

    const handleAttributesChange = (selected: { [id: number]: any }) => {
        setAttributesData(selected);
    };

    return (
        <Modal
            open={open}
            onClose={close}
            aria-labelledby="createProductAttributeModalLabel"
            aria-describedby="createProductAttributeModalDescription"
            className="flex justify-center items-center mx-5"
        >
            <div className="w-full h-10/12 max-w-xl bg-gray-100 rounded p-5 flex flex-col gap-5">
                <div className="w-full flex justify-between items-center">
                    <div className="w-full flex justify-start items-center gap-1">
                        <IconButton onClick={close}>
                            <ChevronRight className="size-5 text-gray-600" />
                        </IconButton>
                        <h2 className="font-semibold">مشخصه جدید</h2>
                    </div>
                    <IconButton onClick={close}>
                        <X className="size-5 text-gray-600" />
                    </IconButton>
                </div>
                <Paper
                    className="space-y-5"
                    sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
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
                    <ProductAttributesSelector onChange={handleAttributesChange} close={close} />
                </Paper>
            </div>
        </Modal>
    )
}