import { z } from 'zod';

export const ImoAppSchema = z.object({
    ImoNumber: z.string().nonempty("Imo Number is required."),
    ImoName: z.string().nonempty("Imo Name is required!"),
    ImoId: z.string().optional(),
    ImoProfilePic: z.instanceof(File).optional(),
    time: z.string().nonempty("Time is required."),
});