import {TextField} from "@mui/material";
import React from "react";
import Button from "@/components/ui/Button";

export default function Profile() {
    return (
        <div className="w-full h-96 bg-white rounded-md flex flex-col justify-start items-start p-5 gap-5">
            <h1 className="font-semibold text-text mb-5">اطلاعات کاربری</h1>
            <div className="w-full flex flex-col gap-5">
                <div className="w-full flex justify-between items-center gap-5">
                    <div className="w-1/2">
                        <TextField
                            label="نام"
                            variant="outlined"
                            fullWidth
                            size="small"
                        />
                    </div>
                    <div className="w-1/2">
                        <TextField
                            label="نام خانوادگی"
                            variant="outlined"
                            fullWidth
                            size="small"
                        />
                    </div>
                </div>
                <div className="w-full flex justify-between items-center gap-5">
                    <div className="w-1/2">
                        <TextField
                            label="موبایل"
                            variant="outlined"
                            fullWidth
                            size="small"
                        />
                    </div>
                    <div className="w-1/2">
                        <TextField
                            label="کدملی"
                            variant="outlined"
                            fullWidth
                            size="small"
                        />
                    </div>
                </div>
            </div>
            <div className="w-full flex justify-end gap-5">
                <Button>ذخیره تغییرات</Button>
            </div>
        </div>
    )
}