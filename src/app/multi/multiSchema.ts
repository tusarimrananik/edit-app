import { z } from 'zod';
export const multiSchema = z.object({
    step: z.string().optional(),
    payment: z.string().optional(),
    profile_pic: z.string().optional(),
    profile_name: z.string().optional()
});
