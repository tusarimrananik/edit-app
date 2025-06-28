import { z } from 'zod';
export const loginSchema = z.object({
    accessToken: z.string({
        required_error: "Access Token Is Required!",
    })
        .min(1, { message: "minimum 1 charecter" })
});
