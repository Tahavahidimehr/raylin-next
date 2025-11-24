"use client"

import Sidebar from "@/components/dashboard/Sidebar";
import FetchUserClient from "@/components/system/FetchUserClient";
import {useState} from "react";

export default function Layout({ children }: { children: React.ReactNode }) {

    const [loading, setLoading] = useState(true)

    return (
        <>
            <FetchUserClient setLoading={setLoading} roles={["admin"]} />
            {loading ? null : (
                <div className="max-w-5xl mx-auto h-screen flex justify-between items-center gap-10 overflow-hidden">
                    <Sidebar />
                    <div className="w-full h-full">{children}</div>
                </div>
            )}
        </>
    )
}