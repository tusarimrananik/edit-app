"use server";
import { auth } from "@/auth"
import prisma from '@/lib/prisma';
import { whatsAppSchema } from "./utils/whatsAppSchema"
import editWhatsApp from './utils/editWhatsApp';
import { z } from 'zod';
type formField = z.infer<typeof whatsAppSchema>;

export default async function getWhatsAppEdit(data: formField) {
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
  const result = whatsAppSchema.safeParse(data)
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.format()));
  }
  try {
    const { finalBufferProfile, finalBufferSettings } = await editWhatsApp(result.data);


    const base64ScreenshotProfile = Buffer.from(finalBufferProfile).toString('base64');
    const base64ScreenshotSettings = Buffer.from(finalBufferSettings).toString('base64');


    return { screenshotBufferProfile: base64ScreenshotProfile, screenshotBufferSettings: base64ScreenshotSettings, userId: session.user.id };


  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : 'An unknown error occurred in the server and failed to generate image buffer!';
    throw new Error(errorMessage);
  }
}




































// "use server";
// import editWhatsApp from './editWhatsApp';
// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData();

//     // Validate that an image file exists and is of type image
//     const imageFile = formData.get('image') as File | null;

//     if (!imageFile) {
//       return NextResponse.json(
//         { error: "No image file provided" },
//         { status: 400 }
//       );
//     }
//     if (!imageFile.type.startsWith('image/')) {
//       return NextResponse.json(
//         { error: "Invalid file type provided" },
//         { status: 400 }
//       );
//     }

//     // Process the image file
//     const imageBuffer = await imageFile.arrayBuffer();


//     // // Build the profile object using consistent key names
//     const whatsappProfile = {
//       image: Buffer.from(imageBuffer),
//       WhatsAppName: formData.get('WhatsAppName')?.toString() ?? '',
//       WhatsappNumber: formData.get('WhatsappNumber')?.toString() ?? '',
//       WhatsAppAbout: formData.get('WhatsAppAbout')?.toString() ?? ''
//     };

//     const finalImage = await editWhatsApp(whatsappProfile);

//     return new NextResponse(Buffer.from(finalImage), {
//       status: 200,
//       headers: {
//         'Content-Type': 'image/png',
//         'Content-Length': finalImage.length.toString()
//       }
//     });

//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
//     return NextResponse.json(
//       { error: errorMessage },
//       { status: 500 }
//     );
//   }
// }
