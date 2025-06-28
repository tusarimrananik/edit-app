import { z } from 'zod';
export const gmailSchema = z.object({
    gmailAddress: z.string().nonempty("Gmail Address is required!"),
    gmailName: z.string().optional(),
    gmailProfilePic: z.instanceof(File).optional(),
    time: z.string().nonempty("Time is required."),
});