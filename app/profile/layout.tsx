"use client"

import Sidebar from "@/components/profile/Sidebar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {

    return (
        <>
            <Header />
            <div className="max-w-7xl mx-auto flex justify-between items-start gap-5 my-10 overflow-hidden">
                <Sidebar />
                <div className="w-full h-full">{children}</div>
            </div>
            <Footer />
        </>
    )
}