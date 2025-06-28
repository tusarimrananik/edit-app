import { Page } from 'puppeteer';
import { fbProfileSelectors } from './selectors';
export const scrapeFacebook = async (page: Page): Promise<Record<string, unknown>> => {
    try {
        const waitResults = await Promise.allSettled(
            Object.values(fbProfileSelectors).map(selector =>
                page.waitForSelector(selector, { timeout: 5000, visible: true })
            )
        );
        Object.entries(fbProfileSelectors).forEach(([key, selector], idx) => {
            if (waitResults[idx].status === 'rejected') {
                console.warn(`Selector "${key}" did not load`);
            }
        });
        const scrapedData = await page.evaluate(async (selectors: Record<string, string>) => {
            const getText = (sel: string): string => {
                const el = document.querySelector(sel);
                return el ? (el.textContent || '').trim() : '';
            };

            const profileName = getText(selectors.profileName);

            const profilePictureNodes = document.querySelectorAll(selectors.profilePicture);
            const profilePicture = profilePictureNodes.length > 1
                ? (profilePictureNodes[1] as HTMLImageElement).getAttributeNS('http://www.w3.org/1999/xlink', 'href')
                : null;

            const coverPictureEl = document.querySelector(selectors.coverPicture) as HTMLImageElement | null;
            const coverPicture = coverPictureEl ? coverPictureEl.src : null;

            const bioEl = document.querySelector(selectors.bio);
            const bio = bioEl ? bioEl.innerHTML : null;

            let connectionFirst: string[] | null = null;
            const connectionFirstEl = document.querySelectorAll(selectors.friends)[0];
            if (connectionFirstEl instanceof HTMLElement) {
                connectionFirst = connectionFirstEl.innerText.trim().split(/\s+/);
            }
            let connectionSecond: string[] | null = null;
            const connectionSecoundEl = document.querySelectorAll(selectors.friends)[1];
            if (connectionSecoundEl instanceof HTMLElement) {
                connectionSecond = connectionSecoundEl.innerText.trim().split(/\s+/);

                if (connectionSecond[1] != "following" && connectionSecond[1] != "followers") {
                    connectionSecond = null;
                }
            }


            let followerPics: string[] = [];
            const followerPicsEl = document.querySelectorAll(selectors.followersPic);
            if (followerPicsEl) {
                for (let i = 0; i < Math.min(followerPicsEl.length, 8); i++) {
                    const pic = (followerPicsEl[i] as SVGElement).getAttributeNS('http://www.w3.org/1999/xlink', 'href');
                    if (pic) {
                        followerPics.push(pic);
                    }
                }
            }

            let actualFriendsNumber;
            let friendsGrid: string | null = null;
            if (connectionFirstEl) {
                const maxScrollAttempts = 5;
                const scrollIncrement = 500;
                let attempts = 0;
                let collectedItems: string[] = [];
                while (attempts < maxScrollAttempts && collectedItems.length < 6) {
                    window.scrollBy(0, scrollIncrement);
                    await new Promise(resolve => setTimeout(resolve, 1500));

                    if (!actualFriendsNumber) {
                        actualFriendsNumber = document.querySelector(selectors.actualFriendsCount)?.innerHTML;
                    }

                    const elements = Array.from(document.querySelectorAll(selectors.friendsGrid));
                    const newItems = elements
                        .slice(collectedItems.length, 6)
                        .map(el => el.outerHTML);

                    if (newItems.length > 0) {
                        collectedItems = [...collectedItems, ...newItems];
                    }

                    attempts++;
                    if (collectedItems.length >= 6) break;
                }

                friendsGrid = collectedItems.length > 0 ? collectedItems.join('') : null;
            }

            const isLocked = !!document.querySelector(selectors.isLocked);
            const hasStory = !!document.querySelector(selectors.hasStory);

            let about = null;
            const aboutNodes = document.querySelectorAll(selectors.about);
            if (aboutNodes.length > 1) {
                const aboutEl = aboutNodes[1] as HTMLElement;
                if (aboutEl.querySelector('img')) {
                    about = aboutEl.innerHTML;
                }
            }

            return {
                profileName,
                coverPicture,
                profilePicture,
                hasStory,
                connectionFirst,
                connectionSecond,
                followerPics,
                bio,
                isLocked,
                about,
                actualFriendsNumber,
                friendsGrid,
            };
        }, fbProfileSelectors);

        console.log(scrapedData);
        return scrapedData;
    } finally {
        // Ensure the page is closed regardless of errors
        // await page.close();


        // This is for only testing purpose okey!
        // await fetch(`https://humane-newt-formally.ngrok-free.app/stop`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' }
        // }).catch((err: Error) => {
        //     console.warn(`Failed to stop Chrome:`, err.message);
        // });
    }
};
