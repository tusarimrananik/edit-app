import { z } from 'zod';

export const whatsAppSchema = z.object({
    whatsAppNumber: z.string().nonempty("WhatsApp Number is required."),
    whatsAppName: z.string().nonempty("WhatsApp Name is required!"),
    whatsAppAbout: z.string().optional(),
    whatsAppProfilePic: z.instanceof(File).optional(),
    time: z.string().nonempty("Time is required."),
});