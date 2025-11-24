import { z } from "zod";

export const productSchema = z.object({
    id: z.number().nullable().optional(),
    name: z.string().min(1, "نام محصول الزامی است"),
    price: z.number().nullable(),
    category_id: z.number().nullable().optional(),
    type: z.enum(["simple", "variable"]),
    discount_type: z.enum(["amount", "percentage"]),
    discount_amount: z.number().nullable().optional(),
    discount_percentage: z.number().nullable().optional(),
    special_offer: z.boolean(),
    need_preparation_time: z.boolean(),
    preparation_time: z.number().nullable().optional(),
    weight: z.number().nullable(),
    weight_unit: z.enum(["g", "kg"]),
    description: z.string().nullable().optional(),
    has_order_limit: z.boolean(),
    order_limit: z.number().nullable().optional(),
    media: z.array(z.any()).optional(),
});

export type ProductFormType = z.infer<typeof productSchema>;