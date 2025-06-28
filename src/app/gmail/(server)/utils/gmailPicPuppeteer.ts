import getPuppeteerBrowser from "@/app/utils/getPuppeteerBrowser";
import { ElementHandle, Page } from 'puppeteer';
// import { getActiveBrowser } from "@/app/utils/getAndSetBrowsers"

const config = {
    GMAIL_URL: 'https://mail.google.com/mail/mu/mp/938/#tl/priority/%5Eio_im',
    USER_AGENT: 'Mozilla/5.0 (Linux; Android 10; Mobile; rv:89.0) Gecko/89.0 Firefox/89.0',
    SELECTORS: {
        COMPOSE: ".kYbzg.pNR6wf.laQMJf.AXeQ0c.YaxK2.leetlb.LTRkrd",
        RECIPIENT: "#composeto",
        IMAGE: "img.pSeF4d.DL8b0c.Rqt9Te"
    },
    TIMEOUTS: {
        COMPOSE: 15000,
        RECIPIENT: 15000,
        IMAGE: 20000
    }
};

async function getGmailProfilePicture(recipientEmail: string) {
    let page: Page | null = null;

    try {
        // Initialize browser and page
        // const getBrowser = await getActiveBrowser()
        page = await getPuppeteerBrowser(config.GMAIL_URL, undefined, config.USER_AGENT, "localhost");

        // Click compose button
        await page.waitForSelector(config.SELECTORS.COMPOSE, { timeout: config.TIMEOUTS.COMPOSE });
        await page.click(config.SELECTORS.COMPOSE);

        // Handle recipient input
        await page.waitForSelector(config.SELECTORS.RECIPIENT, { timeout: config.TIMEOUTS.RECIPIENT });
        await page.focus(config.SELECTORS.RECIPIENT);
        await page.type(config.SELECTORS.RECIPIENT, `${recipientEmail}\n`);

        // Get profile image
        await page.waitForSelector(config.SELECTORS.IMAGE, { timeout: config.TIMEOUTS.IMAGE });
        const imageElement: ElementHandle | null = await page.$(config.SELECTORS.IMAGE);

        if (!imageElement) {
            // throw new Error('Profile image element not found');
            return null
        }

        // Extract image URL and convert to buffer
        const imageSrc = await page.evaluate((el) => (el as HTMLImageElement).src, imageElement);
        const imageResponse = await page.evaluate(async (url) => {
            const response = await fetch(url);
            const blob = await response.blob();
            const arrayBuffer = await blob.arrayBuffer();
            return Array.from(new Uint8Array(arrayBuffer));
        }, imageSrc);

        return Buffer.from(imageResponse);

    } catch (error) {
        // const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        // throw new Error(`Failed to get Gmail profile picture: ${errorMessage}`);
        return null;
    } finally {
        if (page) {
            await page.close().catch(() => { }); // Safely close the page
        }
    }
}

export default getGmailProfilePicture;