"use client";
import { useEffect } from "react";

export default function AppVersionChecker() {
    useEffect(() => {
        const checkVersion = async () => {
            try {
                const res = await fetch("/version.json?cache=" + Date.now());
                const data = await res.json();
                const lastVersion = localStorage.getItem("app_version");

                if (lastVersion !== data.version) {
                    localStorage.setItem("app_version", data.version);
                    alert(`✨ نسخه جدید (${data.version}) نصب شد!\n${data.changelog.join("\n- ")}`);
                }
            } catch (err) {
                console.error("خطا در بررسی نسخه:", err);
            }
        };

        checkVersion();
    }, []);

    return null;
}