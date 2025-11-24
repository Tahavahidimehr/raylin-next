import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <div className="w-full max-w-7xl mx-auto">
                {children}
            </div>
            <Footer />
        </>
    )
}