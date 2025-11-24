export interface ApiError extends Error {
    status?: number;
    errors?: Record<string, string[]>;
}

function getCookie(name: string) {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
}

export async function apiClient<T = any, B = any>(
    url: string,
    options: {
        method?: string;
        headers?: HeadersInit;
        body?: B;
        withCredentials?: boolean;
    } = {}
): Promise<T> {
    const { body, withCredentials = true, ...fetchOptions } = options;
    const method = (fetchOptions.method || "GET").toUpperCase();

    const xsrfToken = getCookie("XSRF-TOKEN");

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(xsrfToken ? { "X-XSRF-TOKEN": decodeURIComponent(xsrfToken) } : {}),
        ...fetchOptions.headers,
    };

    const fetchBody = body && method !== "GET" ? JSON.stringify(body) : undefined;

    const res = await fetch(url, {
        ...fetchOptions,
        method,
        headers,
        credentials: withCredentials ? "include" : "same-origin",
        body: fetchBody,
    });

    let json: any;
    try {
        json = await res.json();
    } catch {
        json = {};
    }

    if (!res.ok || json.success === false) {
        const error: ApiError = new Error(json.message || "Request failed");
        error.status = res.status;
        error.errors = json.errors;
        throw error;
    }

    return json;
}