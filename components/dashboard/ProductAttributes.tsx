import Link from "next/link";
import {Button, IconButton} from "@mui/material";
import {Plus, Trash2} from "lucide-react";
import React, {useState} from "react";
import CreateProductAttributeModal from "@/components/dashboard/CreateProductAttributeModal";
import {useProductAttributesStore} from "@/store/productAttributesStore";

export default function ProductAttributes() {

    const [showCreateProductAttributeModal, setShowCreateProductAttributeModal] = useState(false)
    const [showEditProductAttributeModal, setShowEditProductAttributeModal] = useState(false)

    const {selectedAttributes, removeAttribute} = useProductAttributesStore()

    return (
        <>
            <div className="w-full bg-white flex flex-col shadow rounded p-5 gap-5">
                <div className="w-full flex justify-between">
                    <h5>مشخصات</h5>
                    <Link href="/dashboard/products/create">
                        <Button variant="text" className="gap-2" onClick={() => setShowCreateProductAttributeModal(true)}>
                            <Plus className="size-4" />
                            افزودن مشخصات جدید
                        </Button>
                    </Link>
                </div>
                {
                    selectedAttributes.length > 0 ? (
                        selectedAttributes.map((attribute) => (
                            <div key={attribute.attribute_id} className="w-full flex flex-col gap-5">
                                <div className="w-full h-14 border border-gray-300 rounded flex justify-between items-center px-3">
                                    <div className="flex items-center gap-3">
                                        <h5 className="text-sm">{attribute.attribute_name}</h5>
                                        <p className="text-gray-400 text-sm">{attribute.value}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {/*<IconButton>*/}
                                        {/*    <Edit className="size-5" />*/}
                                        {/*</IconButton>*/}
                                        <IconButton onClick={() => removeAttribute(attribute.attribute_id)}>
                                            <Trash2 className="size-5" />
                                        </IconButton>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-sm text-gray-500 my-5">با تعریف مشخصات محصول، ویژگی‌های محصول خود را معرفی و به تصمیم گیری سریعتر مشتریان به خرید کمک کنید</p>
                    )
                }
            </div>
            <CreateProductAttributeModal open={showCreateProductAttributeModal} close={() => setShowCreateProductAttributeModal(false)} />
        </>
    )
}