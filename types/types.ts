export interface User {
    first_name: string | null;
    last_name: string | null;
    mobile: string;
    mobile_verified_at: string | null;
    sheba_number: string | null;
    card_number: string | null;
    role: "user" | "admin";
    last_order_at: string | null;
}

export interface Media {
    id: number;
    type: 'image' | 'video';
    path: string;
    is_main: boolean;
    url: string;
}

export interface Product {
    id?: number | null;
    name: string;
    slug: string;
    type: 'simple' | 'variable';
    price: number | null;
    category_id: number | null;
    discount_type: 'amount' | 'percentage';
    discount_amount: number | null;
    discount_percentage: number | null;
    special_offer: boolean;
    need_preparation_time: boolean;
    preparation_time: number | null;
    weight_unit: 'kg' | 'g';
    weight: number | null;
    description: string | null;
    has_order_limit: boolean;
    order_limit: number | null;
    media: Media[];
    total_stock?: number;
    is_available?: boolean;
    original_price?: number | null;
    final_price?: number | null;
    discount_percent_for_badge?: number | null;
    sort_price?: number | null;
    variants?: ProductVariant[];
}

export interface ProductVariant {
    id: string | number;
    price: number | null;
    discount_type: "amount" | "percentage";
    discount_amount: number | null;
    discount_percentage: number | null;
    need_preparation_time: boolean;
    preparation_time: number | null;
    has_order_limit: boolean;
    order_limit: number | null;
    is_default: boolean;
    media: Media[];
    total_stock?: number;
    is_available?: boolean;
    original_price?: number | null;
    final_price?: number | null;
    discount_percent_for_badge?: number | null;
    combination: { variantId: number; valueId: number; name: string }[];
}

export interface Attribute {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    values?: AttributeValue[];
}

export interface AttributeValue {
    id: number;
    attribute_id: number;
    value: string;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    parent_id?: number | null;
    description?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    parent?: Category | null;
    children?: Category[];
    media?: Media[];
}

export interface Address {
    id: number;
    user_id: number;
    title: string | null;
    receiver_name: string;
    receiver_phone: string;
    address: string;
    postal_code: string;
    province: string;
    city: string;
    latitude: number | null;
    longitude: number | null;
    created_at: string;
    updated_at: string;
}

export interface ShippingMethod {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    price: number;
    created_at: string;
    updated_at: string;
}

