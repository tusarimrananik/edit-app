import { Page, ElementHandle } from "puppeteer";
export default async function setDataTakeSS(scrapedData: Record<string, any>, page: Page, time: string) {
    await page.evaluate(async (scrapedData, time) => {
        const {
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
        } = scrapedData;
        const timeDisplayEl = document.getElementById('timeDisplayEl') as HTMLElement;
        const displayNameEl = document.getElementById('displayNameEl') as HTMLElement;
        const profileNameEl = document.getElementById('profileNameEl') as HTMLElement;
        const coverPictureEl = document.getElementById('coverPictureEl') as HTMLImageElement;
        const profilePictureEl = document.getElementById('profilePictureEl') as HTMLImageElement;

        const connectionFirstCountEl = document.getElementById('connectionFirstCountEl') as HTMLElement;
        const connectionFirstTypeEl = document.getElementById('connectionFirstTypeEl') as HTMLElement;

        const connectionSecondCountEl = document.getElementById('connectionSecondCountEl') as HTMLElement;
        const connectionSecondTypeEl = document.getElementById('connectionSecondTypeEl') as HTMLElement;

        const followersPicEl = document.getElementById('followersPicEl') as HTMLElement;
        const bioEl = document.getElementById('bioEl') as HTMLElement;
        const isLockedEl = document.getElementById('isLockedEl') as HTMLElement;
        const aboutEl = document.getElementById('aboutEl') as HTMLElement;
        const friendsGridCountEl = document.getElementById('friendsGridCountEl') as HTMLElement;
        const friendsGridEl = document.getElementById('friendsGridEl') as HTMLElement;
        const statusPicEl = document.getElementById('statusPicEl') as HTMLImageElement;

        const pageTypeEls = document.querySelectorAll('.page') as NodeListOf<HTMLElement>;
        const profileTypeEls = document.querySelectorAll('.profile') as NodeListOf<HTMLElement>;


        try {
            if (connectionSecond == null) {
                if (Array.isArray(connectionFirst) && connectionFirst.length == 2) {
                    connectionFirstCountEl.innerText = connectionFirst[0];
                    connectionFirstTypeEl.innerText = connectionFirst[1];
                }
                if (friendsGrid && friendsGridEl) {
                    friendsGridEl.style.display = "grid";
                    friendsGridEl.innerHTML = friendsGrid;
                    friendsGridCountEl.innerText = actualFriendsNumber;
                    await waitForElementVisibility(friendsGridEl);
                    const gridImages = friendsGridEl.querySelectorAll('img');
                    await Promise.all(Array.from(gridImages).map(img =>
                        new Promise<void>((resolve) => {
                            if (img.complete) {
                                resolve();
                            } else {
                                img.onload = () => resolve();
                                img.onerror = () => resolve();
                            }
                        })
                    ));
                }

                pageTypeEls.forEach(el => {
                    el.style.display = "none";
                });
            } else {
                if (Array.isArray(connectionFirst) && connectionFirst.length == 2) {
                    connectionFirstCountEl.innerText = connectionFirst[0];
                    connectionFirstTypeEl.innerText = connectionFirst[1];
                }
                if (Array.isArray(connectionSecond) && connectionSecond.length == 2) {
                    connectionSecondCountEl.innerText = connectionSecond[0];
                    connectionSecondTypeEl.innerText = connectionSecond[1];
                    profileTypeEls.forEach(el => {
                        el.style.display = "none";
                    });
                } else {
                    pageTypeEls.forEach(el => {
                        el.style.display = "none";
                    });
                }
            }



            //HELPER FUNCTIONS
            async function waitForElementVisibility(element: HTMLElement, timeout = 5000): Promise<void> {
                const pollInterval = 100;
                let elapsed = 0;
                while (elapsed < timeout) {
                    if (element.offsetWidth > 0 && element.offsetHeight > 0) {
                        return;
                    }
                    await new Promise(resolve => setTimeout(resolve, pollInterval));
                    elapsed += pollInterval;
                }
                console.warn("Element did not become visible within timeout", element);
            }
            const setImageWithLoadCheck = (element: HTMLImageElement | null, src: string): Promise<void> => {
                return new Promise((resolve, reject) => {
                    if (!element) {
                        return reject(new Error('Element not found'));
                    }
                    element.src = src;
                    element.onload = () => resolve();
                    element.onerror = () => reject(new Error('Image failed to load'));
                });
            };


            //SET STATUS BAR TIME
            if (time && timeDisplayEl) {
                timeDisplayEl.innerText = time;
                await waitForElementVisibility(timeDisplayEl);
            }


            //SET PROFILE NAME
            // Verified SVG icon as an HTML string

            const verifiedSVG = `
<svg viewBox="0 0 12 13" width="16" height="16" fill="#0866ff" xmlns="http://www.w3.org/2000/svg" style="margin-left: 4px; vertical-align: middle;">
  <title>Verified account</title>
  <g fill-rule="evenodd" transform="translate(-98 -917)">
    <path d="m106.853 922.354-3.5 3.5a.499.499 0 0 1-.706 0l-1.5-1.5a.5.5 0 1 1 .706-.708l1.147 1.147 3.147-3.147a.5.5 0 1 1 .706.708m3.078 2.295-.589-1.149.588-1.15a.633.633 0 0 0-.219-.82l-1.085-.7-.065-1.287a.627.627 0 0 0-.6-.603l-1.29-.066-.703-1.087a.636.636 0 0 0-.82-.217l-1.148.588-1.15-.588a.631.631 0 0 0-.82.22l-.701 1.085-1.289.065a.626.626 0 0 0-.6.6l-.066 1.29-1.088.702a.634.634 0 0 0-.216.82l.588 1.149-.588 1.15a.632.632 0 0 0 .219.819l1.085.701.065 1.286c.014.33.274.59.6.604l1.29.065.703 1.088c.177.27.53.362.82.216l1.148-.588 1.15.589a.629.629 0 0 0 .82-.22l.701-1.085 1.286-.064a.627.627 0 0 0 .604-.601l.065-1.29 1.088-.703a.633.633 0 0 0 .216-.819"/>
  </g>
</svg>
`;

            // SET PROFILE NAME
            if (profileName) {
                // Check and clean 'Verified account'
                const hasVerified = profileName.toLowerCase().includes('verified account');
                const cleanName = profileName.replace(/verified account/i, '').trim();

                if (displayNameEl) {
                    const shortName = cleanName
                        .replace(/\(.*?\)/, '')
                        .trim()
                        .split(' ')
                        .slice(0, 3)
                        .join(' ');
                    // Set name and add verified badge

                    displayNameEl.innerHTML = shortName;

                    await waitForElementVisibility(displayNameEl);
                }

                if (profileNameEl) {
                    profileNameEl.innerHTML = hasVerified ? `${cleanName}${verifiedSVG}` : cleanName;
                    await waitForElementVisibility(profileNameEl);
                }
            }




            //SET COVER PICTURE
            if (coverPicture) {
                try {
                    await setImageWithLoadCheck(coverPictureEl, coverPicture);
                } catch (error) {
                    console.error('Cover photo failed to load:', error);
                }
                if (coverPictureEl) await waitForElementVisibility(coverPictureEl);
            }


            //SET PROFILE PICTURE
            if (profilePicture) {
                try {
                    await Promise.all([
                        setImageWithLoadCheck(profilePictureEl, profilePicture),
                        setImageWithLoadCheck(statusPicEl, profilePicture)
                    ]);
                } catch (error) {
                    console.error('Profile picture failed to load:', error);
                }
                if (profilePictureEl) await waitForElementVisibility(profilePictureEl);
            }


            //SET HAS STORY OR NOT
            if (profilePictureEl) {
                profilePictureEl.classList.toggle('story-ring', Boolean(hasStory));
            }


            //HERE SET FOLLOWERS PICS
            // if (followerPics && Array.isArray(followerPics)) {
            //     followersPicEl.innerHTML = followerPics
            //         .map(
            //             (pic) => `<img src="${pic}" />`
            //         )
            //         .join('');
            // }


            if (followerPics && Array.isArray(followerPics)) {
                followersPicEl.innerHTML = followerPics
                    .map((pic, index) => {
                        // If it's the last image, wrap it with overlay
                        if (index === followerPics.length - 1) {
                            return `
                    <div class="last-img-wrapper">
                        <img src="${pic}" />
                        <div class="overlay">
                            <span>&#8226;&#8226;&#8226;</span>
                        </div>
                    </div>
                `;
                        }
                        // Regular images
                        return `<img src="${pic}" />`;
                    })
                    .join('');
            }



            //SET BIO
            if (bioEl) {
                if (bio) {
                    bioEl.innerHTML = bio;
                    await waitForElementVisibility(bioEl);
                } else {
                    bioEl.classList.add('hidden');
                }
            }


            //SET IF LOCKED OR NOT
            if (isLockedEl) {
                if (isLocked) {
                    isLockedEl.classList.remove('hidden');
                    await waitForElementVisibility(isLockedEl);
                } else {
                    isLockedEl.classList.add('hidden');
                }
            }


            //SET ABOUT/WORKLIST
            if (about && aboutEl) {
                await waitForElementVisibility(aboutEl);
                aboutEl.insertAdjacentHTML('afterbegin', about);
                const images = aboutEl.querySelectorAll('img');
                await Promise.all(Array.from(images).map(img => {
                    return new Promise<void>((resolve, reject) => {
                        if (img.complete && img.naturalHeight !== 0) {
                            waitForElementVisibility(img as HTMLElement)
                                .then(resolve)
                                .catch(reject);
                        } else {
                            img.addEventListener('load', () => {
                                waitForElementVisibility(img as HTMLElement)
                                    .then(resolve)
                                    .catch(reject);
                            });
                            img.addEventListener('error', () => {
                                reject(new Error('Image in about section failed to load'));
                            });
                        }
                    });
                }));
            }
        } catch (error) {
            console.log(error)
        }
    }, scrapedData, time);
    const screenshotBuffer = await takeScreenshot(page);
    return screenshotBuffer;
}
async function takeScreenshot(page: Page): Promise<Buffer> {
    try {
        await page.evaluate(() => {
            const rootBody = document.querySelector('.screenshot-content') as HTMLElement | null;
            if (rootBody) {
                rootBody.style.transform = 'scale(5)';
                rootBody.style.transformOrigin = 'top left';
            } else {
                throw new Error("Element with class 'rootBody' not found in the DOM.");
            }
        });
        const element: ElementHandle<Element> | null = await page.$('.screenshot-content');
        if (!element) {
            throw new Error("Element with class 'rootBody' not found.");
        }
        return Buffer.from(await element.screenshot());
    } catch (error) {
        console.error('Error taking screenshot:', error);
        throw error;
    }
}