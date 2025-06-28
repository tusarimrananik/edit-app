"use server";
import { auth } from "@/auth"
import prisma from '@/lib/prisma';
import { gmailSchema } from "./utils/gmailSchema"
import editGmail from './utils/editGmail';
import { z } from 'zod';
type formField = z.infer<typeof gmailSchema>;

export default async function getGmailEdit(data: formField) {
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
  const result = gmailSchema.safeParse(data)
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.format()));
  }
  try {
    const { finalBufferDesktop, finalBufferMobile } = await editGmail(result.data);
    const base64ScreenshotDesktop = Buffer.from(finalBufferDesktop).toString('base64');
    const base64ScreenshotMobile = Buffer.from(finalBufferMobile).toString('base64');
    return { screenshotBufferDesktop: base64ScreenshotDesktop, screenshotBufferMobile: base64ScreenshotMobile, userId: session.user.id };
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : 'An unknown error occurred in the server and failed to generate image buffer!';
    throw new Error(errorMessage);
  }

}