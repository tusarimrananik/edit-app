"use server";
import getPuppeteerBrowser from '@/app/utils/getPuppeteerBrowser';
import { facebookCookies } from './utils/facebookCookie';
import { scrapeFacebook } from './utils/scrapeFB';
import setDataTakeSS from './utils/setDataTakeSS';
import { facebookLinkSchema } from "./utils/facebookLinkSchema";
import { auth } from "@/auth";
import prisma from '@/lib/prisma';
import { ServerStatus } from '@/app/utils/ServerStatus';
import { getActiveBrowser } from "@/app/utils/getAndSetBrowsers"

export default async function getFacebookScreenshot(data: { facebookLink: string, time: string }) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "পিন দিয়ে লগিন করো তারপর এডিট হবে!" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) {
    return { error: "তোমার একাউন্ট পাওয়া যায় নি!" };
  }

  if (!user.canEdit || user.edits <= -10) {
    return { error: "তোমার টাকা শেষ নতুন করে এডিট নিতে টাকা সেন্ড করো!" };
  }

  const result = facebookLinkSchema.safeParse(data);
  if (!result.success) {
    return { error: JSON.stringify(result.error.format()) };
  }

  const { facebookLink, time } = result.data;

  try {
    if (ServerStatus.isBusy()) {
      return { error: "আরেকজন এডিট নিচ্ছে কিচ্ছুক্ষন অপেক্ষা করো!" };
    } else {
      ServerStatus.setBusy(true);
    }

    const getBrowser = await getActiveBrowser()
    const page = await getPuppeteerBrowser(facebookLink, facebookCookies(), undefined, getBrowser?.name);
    if (!page) {
      ServerStatus.setBusy(false);
      return { error: "Failed to launch page." };
    }

    const scrapedData = await scrapeFacebook(page);

    await page.goto(`https://tusarimrananik.github.io/FacebookProfile/`);

    //This is for development purpose
    // await page.goto(`http://localhost:3000/FacebookUI/index.html`);


    const screenshotBuffer = await setDataTakeSS(scrapedData, page, time);
    await page.close();


    // This code is for development purpose
    // await fetch(`https://humane-newt-formally.ngrok-free.app/stop`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' }
    // }).catch((err: Error) => {
    //   console.warn(`Failed to stop Chrome:`, err.message);
    // });

    const base64Screenshot = Buffer.from(screenshotBuffer).toString('base64');
    ServerStatus.setBusy(false);
    return { screenshotBuffer: base64Screenshot, userId: session.user.id };
  } catch (error) {
    ServerStatus.setBusy(false);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'An unknown error occurred in the server and failed to generate image buffer!';
    return { error: errorMessage };
  }
}