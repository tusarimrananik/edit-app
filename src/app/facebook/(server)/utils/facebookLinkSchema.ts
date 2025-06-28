import { z } from 'zod';
export const facebookLinkSchema = z.object({
    facebookLink: z.string({
        required_error: "The URL is required.",
    })
        .min(1, { message: "The URL cannot be empty." })
        .regex(
            /^(https?:\/\/)?(www\.|m\.|mbasic\.|web\.)?(facebook\.com|fb\.com)\/[a-zA-Z0-9(\.\?)?]+/,
            { message: "The URL must be a valid Facebook URL (e.g., https://facebook.com/username)." }
        ),
    time: z.string()

});
