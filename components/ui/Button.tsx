"use client"

import React, { MouseEventHandler } from "react";
import clsx from "clsx";

interface ButtonProps {
    children: React.ReactNode;
    variant?: "fullWidth" | "fullWidthOutline";
    type?: "button" | "submit";
    disabled?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement> | (() => Promise<void>);
}

export default function Button({
                                   children,
                                   variant,
                                   type = "button",
                                   disabled = false,
                                   onClick,
                               }: ButtonProps) {
    const handleClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
        if (!onClick) return;

        const result = onClick(e);
        if (result instanceof Promise) {
            try {
                await result;
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <button
            onClick={handleClick}
            type={type}
            disabled={disabled}
            className={clsx(
                !variant &&
                "px-6 py-2 rounded-md bg-prime border border-prime text-white text-[14px] cursor-pointer transition hover:bg-prime/90",
                variant === "fullWidth" &&
                "w-full py-2 rounded-md bg-prime border border-prime text-white text-[14px] cursor-pointer transition hover:bg-prime/90",
                variant === "fullWidthOutline" &&
                "w-full py-2 rounded-md bg-transparent border border-prime text-[14px] cursor-pointer"
            )}
        >
            {children}
        </button>
    );
}