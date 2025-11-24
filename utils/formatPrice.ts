export function formatPrice(value: number | null) {
    if (value == null) return "";
    return value.toLocaleString("fa-IR");
}