import makeCircularImage from './makeCircularImage';
import { svgTextGenerator } from './svgTextGen';
import { promises as fs } from 'fs';
import bindImageAllTogether, { OverlayConfig } from './bindImageAllTogether';
import path from 'path';
import { z } from 'zod';
import { gmailSchema } from './gmailSchema';
import sharp from 'sharp';
import { createImageWithAlphabet } from "./createImageWithAlphabet"
import getGmailProfilePicture from "./gmailPicPuppeteer"


type FormField = z.infer<typeof gmailSchema>;
async function editGmail(gmail: FormField) {
    const BASE_DESKTOP = await fs.readFile(path.join(process.cwd(), 'src/app/gmail/(server)/assets/base-image.png'));
    const BASE_MOBILE = await fs.readFile(path.join(process.cwd(), 'src/app/gmail/(server)/assets/gmailWithName.png'))
    const gmailProfilePicBufferPuppeteer = await getGmailProfilePicture(gmail.gmailAddress)
    const overlayConfigGmailDesktop = async (): Promise<OverlayConfig[]> => {
        const overlaysDesktop: OverlayConfig[] = [];
        let imageBuffer;
        if (gmailProfilePicBufferPuppeteer) {
            imageBuffer = gmailProfilePicBufferPuppeteer;
        } else if (gmail.gmailProfilePic) {
            const bufferArray = await gmail.gmailProfilePic.arrayBuffer();
            imageBuffer = Buffer.from(bufferArray);
        } else {
            const alphabet = gmail.gmailAddress?.trim().charAt(0).toUpperCase();
            imageBuffer = await createImageWithAlphabet(alphabet);
        }

        // Define the overlay configurations for different image sizes
        const overlayConfigs = [
            { size: 110, top: 270, left: 605 },
            { size: 44, top: 139, left: 870 },
            { size: 25, top: 50, left: 882 },
        ];

        // Generate the circular images and push them into overlaysDesktop
        for (const { size, top, left } of overlayConfigs) {
            const circularImage = await makeCircularImage(imageBuffer, size);
            overlaysDesktop.push({
                imageBuffer: circularImage,
                top,
                left,
                blend: 'over'
            });
        }

        if (gmail.gmailAddress) {
            const gmailAddressBuffer = svgTextGenerator({
                text: gmail.gmailAddress,
                color: "#1f1f1f",
                textAlign: "middle"
            });
            const gmailAddressBufferMetadata = await sharp(gmailAddressBuffer).metadata();
            const BASE_MOBILE_METADATA = await sharp(BASE_MOBILE).metadata();
            const gmailAddressLeft = Math.round(((BASE_MOBILE_METADATA.width ?? 0) -
                (gmailAddressBufferMetadata.width ?? 0)) / 2);
            overlaysDesktop.push({
                imageBuffer: gmailAddressBuffer,
                top: 230,
                left: gmailAddressLeft + 300,
                blend: 'over'
            });
        }
        return overlaysDesktop;
    };



    const overlayConfigGmailMobile = async () => {
        const overlaysMobile: OverlayConfig[] = [];



        //I'm currently editing here....
        let imageBuffer;
        if (gmailProfilePicBufferPuppeteer) {
            imageBuffer = gmailProfilePicBufferPuppeteer;
        } else if (gmail.gmailProfilePic) {
            const bufferArray = await gmail.gmailProfilePic.arrayBuffer();
            imageBuffer = Buffer.from(bufferArray);
        } else {
            const alphabet = gmail.gmailAddress?.trim().charAt(0).toUpperCase();
            imageBuffer = await createImageWithAlphabet(alphabet);
        }
        const circularImage = await makeCircularImage(imageBuffer, 160);
        overlaysMobile.push({
            imageBuffer: circularImage,
            top: 205,
            left: 280,
            blend: 'over'
        });

        if (gmail.gmailName) {
            const gmailNameBuffer = svgTextGenerator({
                text: gmail.gmailName,
                color: "#ffffff",
                fontSize: 55,
                textAlign: "middle",
            });
            const gmailNameBufferMetadata = await sharp(gmailNameBuffer).metadata();
            const BASE_MOBILE_METADATA = await sharp(BASE_MOBILE).metadata();
            const gmailNameLeft = Math.round(((BASE_MOBILE_METADATA.width ?? 0) - (gmailNameBufferMetadata.width ?? 0)) / 2);
            overlaysMobile.push({
                imageBuffer: gmailNameBuffer,
                top: 380,
                left: gmailNameLeft,
                blend: 'over'
            });
        }
        if (gmail.gmailAddress) {
            const gmailAddressBuffer = svgTextGenerator({
                text: gmail.gmailAddress,
                fontSize: 33,
                color: "#ffffff"
            });
            //This is for middle aligning the gmailAddress into the base image.
            const gmailAddressBufferMetadata = await sharp(gmailAddressBuffer).metadata();
            const BASE_MOBILE_METADATA = await sharp(BASE_MOBILE).metadata();
            const gmailAddressLeft = Math.round(((BASE_MOBILE_METADATA.width ?? 0) - (gmailAddressBufferMetadata.width ?? 0)) / 2);
            overlaysMobile.push({
                imageBuffer: gmailAddressBuffer,
                top: 462,
                left: gmailAddressLeft,
                blend: 'over'
            });
        }
        if (gmail.time) {
            const gmailTimeBuffer = svgTextGenerator({
                text: gmail.time,
                color: "#ffffff",
                fontSize: 29,
                textAlign: "left"
            });
            overlaysMobile.push({
                imageBuffer: gmailTimeBuffer,
                top: 15,
                left: 32,
                blend: 'over'
            });
        }
        return overlaysMobile;
    };
    try {
        const finalBufferDesktop = await bindImageAllTogether(BASE_DESKTOP, await overlayConfigGmailDesktop());
        const finalBufferMobile = await bindImageAllTogether(BASE_MOBILE, await overlayConfigGmailMobile());
        return { finalBufferDesktop, finalBufferMobile };
    } catch (error) {
        console.error(
            'Error compositing images:',
            error instanceof Error ? error.message : error
        );
        throw error;
    }
}
export default editGmail;
