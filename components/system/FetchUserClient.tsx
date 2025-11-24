"use client"

import {ReactElement, useEffect, useRef} from "react";
import {apiClient, ApiError} from "@/lib/apiClient";
import {usePathname, useRouter} from "next/navigation";
import {getAuthStore} from "@/store/authStore";

export default function FetchUserClient({ roles, setLoading }: { roles?: string[], setLoading?: (state: boolean) => void }): ReactElement {
    const router = useRouter();
    const pathname = usePathname();
    const fetchedRef = useRef(false);

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        const fetchUser = async () => {
            if (setLoading) setLoading(true);
            const { setUserData, setAuthenticated, setRole } = getAuthStore();

            try {
                const res = await apiClient(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/user`, {
                    withCredentials: true,
                });

                setUserData(res.data.user);
                setRole(res.data.user.role);
                setAuthenticated(true);

                if (pathname.startsWith("/dashboard")) {
                    if (roles && !roles.includes(res.data.user.role)) {
                        if (setLoading) setLoading(false);
                        router.replace("/");
                        return;
                    }
                }

            } catch (err) {
                const error = err as ApiError;
                setUserData(null);
                setAuthenticated(false);

                if (pathname.startsWith("/dashboard")) {
                    router.replace("/");
                }
                return;
            } finally {
                if (setLoading) setLoading(false);
            }
        };

        fetchUser();
    }, [pathname, roles, setLoading, router]);

    return <></>
}