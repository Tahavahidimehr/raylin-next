import { z } from "zod";

export const productVariantSchema = z.object({
    price: z.number().nullable().optional(),
    discount_type: z.enum(["amount", "percentage"]),
    discount_amount: z.number().nullable().optional(),
    discount_percentage: z.number().nullable().optional(),
    need_preparation_time: z.boolean(),
    preparation_time: z.number().nullable().optional(),
    has_order_limit: z.boolean(),
    order_limit: z.number().nullable().optional(),
    is_default: z.boolean().optional().default(false).catch(false),
});

export type ProductVariantFormType = z.infer<typeof productVariantSchema>;
