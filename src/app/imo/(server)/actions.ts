"use server";
import { auth } from "@/auth"
import prisma from '@/lib/prisma';
import { ImoAppSchema } from "@/app/imo/(server)/utils/ImoAppSchema";
import editWhatsApp from './utils/editImo';
import { z } from 'zod';
type formField = z.infer<typeof ImoAppSchema>;

export default async function getImoEdit(data: formField) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Unauthorized access: missing user credentials.");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });
  if (!user) {
    throw new Error("User not found: please ensure your account exists.");
  }
  if (!user.canEdit || user.edits <= -10) {
    throw new Error("Insufficient edit credits: please recharge your account to continue editing!");
  }
  const result = ImoAppSchema.safeParse(data)
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.format()));
  }
  try {
    const finalBufferProfile = await editWhatsApp(result.data);


    const base64ScreenshotProfile = Buffer.from(finalBufferProfile).toString('base64');


    return { screenshotBufferProfile: base64ScreenshotProfile, userId: session.user.id };


  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : 'An unknown error occurred in the server and failed to generate image buffer!';
    throw new Error(errorMessage);
  }
}