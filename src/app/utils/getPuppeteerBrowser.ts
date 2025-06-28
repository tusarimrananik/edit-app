import puppeteer, { Browser, Page, Cookie } from 'puppeteer';
export default async function getPuppeteerBrowser(
    site: string,
    cookie?: Cookie[],
    userAgent?: string,
    browser: string = 'browserless'
) {
    const browserEndpoints: { [key: string]: string } = {
        browserless: `wss://production-sfo.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`,
    };
    if (browser === 'localhost') {
        try {
            const response = await fetch(`https://humane-newt-formally.ngrok-free.app/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(`Failed to start Chrome: ${JSON.stringify(error)}`);
            }
            const { webSocketDebuggerUrl }: { webSocketDebuggerUrl: string } = await response.json();
            browserEndpoints.localhost = webSocketDebuggerUrl;
        } catch (error) {
            throw new Error(`Unable to establish connection with localhost browser: ${error}`);
        }
    }
    const endpoint = browserEndpoints[browser];
    if (!endpoint) {
        throw new Error(`No browser endpoint found for browser type: "${browser}".`);
    }

    let browserInstance: Browser;
    try {
        browserInstance = await puppeteer.connect({ browserWSEndpoint: endpoint });
    } catch (error) {
        throw new Error(`Failed to connect to browser at endpoint "${endpoint}". Error: ${error}`);
    }
    const pages = await browserInstance.pages();
    let page: Page;
    if (pages.length > 0) {
        page = pages[0];
    } else {
        try {
            page = await browserInstance.newPage();
        } catch (error) {
            throw new Error(`Failed to create a new page in the browser instance. Error: ${error}`);
        }
    }
    if (cookie && cookie.length > 0) {
        try {
            await setCookie(page, cookie);
        } catch (error) {
            throw new Error(`Failed to set cookies on the page. Error: ${error}`);
        }
    }
    try {
        await setPageFullDimension(page);
    } catch (error) {
        throw new Error(`Failed to set full page dimensions. Error: ${error}`);
    }
    if (userAgent) {
        try {
            await page.setUserAgent(userAgent);
        } catch (error) {
            throw new Error(`Failed to set user agent. Error: ${error}`);
        }
    }
    try {
        await page.goto(site);
    } catch (error) {
        throw new Error(`Failed to navigate to site "${site}". Error: ${error}`);
    }

    return page;
}
export async function setCookie(page: Page, cookies: Cookie[]) {
    const context = page.browser().defaultBrowserContext();
    await context.setCookie(...cookies);
}
export async function setPageFullDimension(page: Page) {
    const dimensions = await page.evaluate(() => ({
        width: window.screen.width,
        height: window.screen.height,
    }));
    await page.setViewport(dimensions);
}