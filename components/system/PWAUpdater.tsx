"use client";
import { useEffect } from "react";

export default function PWAUpdater() {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.ready.then((registration) => {
                registration.addEventListener("updatefound", () => {
                    const newWorker = registration.installing;
                    newWorker?.addEventListener("statechange", () => {
                        if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                            if (confirm("نسخه جدید اپ در دسترس است. بروزرسانی کنید؟")) {
                                window.location.reload();
                            }
                        }
                    });
                });
            });
        }
    }, []);

    return null;
}