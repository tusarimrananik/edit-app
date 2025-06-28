import makeCircularImage from './makeCircularImage';
import { svgTextGenerator } from './svgTextGen';
import { promises as fs } from 'fs';
import bindImageAllTogether, { OverlayConfig } from './bindImageAllTogether';
import path from 'path';
import { z } from 'zod';
import { whatsAppSchema } from './whatsAppSchema';
import formatBangladeshPhoneNumber from "./formatBangladeshPhoneNumber"
type FormField = z.infer<typeof whatsAppSchema>;
async function editWhatsApp(whatsApp: FormField) {



    const defaultProfilePic = path.join(process.cwd(), 'src/app/whatsapp/(server)/assets/defaultProfilePic.png');
    const defaultProfilePicBuffer = await fs.readFile(defaultProfilePic);

    const profilePicBuffer = whatsApp.whatsAppProfilePic
        ? await (async (pic) => {
            const arrayBuffer = await pic.arrayBuffer();
            const rawBuffer = Buffer.from(arrayBuffer);
            return makeCircularImage(rawBuffer, 320);
        })(whatsApp.whatsAppProfilePic)
        : await makeCircularImage(defaultProfilePicBuffer, 320)


    const profilePicSettingsBuffer = whatsApp.whatsAppProfilePic
        ? await (async (pic) => {
            const arrayBuffer = await pic.arrayBuffer();
            const rawBuffer = Buffer.from(arrayBuffer);
            return makeCircularImage(rawBuffer, 127);
        })(whatsApp.whatsAppProfilePic)
        : undefined;

    const aboutBuffer = whatsApp.whatsAppAbout
        ? svgTextGenerator({
            text: whatsApp.whatsAppAbout,
            color: "#8696A0",
            fontSize: 29
        })
        : undefined;


    const nameSettingsBuffer = svgTextGenerator({
        text: whatsApp.whatsAppName,
        color: "#ffffff",
        fontSize: 39
    })

    try {
        const [nameBuffer, numberBuffer, timeBuffer] = await Promise.all([
            svgTextGenerator({
                text: whatsApp.whatsAppName,
                color: "#8696A0",
                fontSize: 29
            }),
            svgTextGenerator({
                text: formatBangladeshPhoneNumber(whatsApp.whatsAppNumber),
                color: "#8696A0",
                fontSize: 29
            }),
            svgTextGenerator({
                text: whatsApp.time,
                color: "#ffffff",
                fontSize: 29
            })
        ]);
        const basePathProfile = path.join(process.cwd(), 'src/app/whatsapp/(server)/assets/profile.png');
        const basePathSettings = path.join(process.cwd(), 'src/app/whatsapp/(server)/assets/settings.png');
        const cameraIcon = path.join(process.cwd(), 'src/app/whatsapp/(server)/assets/camera-icon.png');




        const baseBufferProfile = await fs.readFile(basePathProfile);
        const baseBufferSettings = await fs.readFile(basePathSettings);
        const cameraIconBuffer = await fs.readFile(cameraIcon);
        const overlays: OverlayConfig[] = [];
        const overlaysSettings: OverlayConfig[] = [];


        //These are the overlay config for the profile
        if (profilePicBuffer) {
            overlays.push({
                imageBuffer: profilePicBuffer,
                top: 223,
                left: 200,
                blend: 'over'
            });
        }
        overlays.push({
            imageBuffer: nameBuffer,
            top: 655,
            left: 144,
            blend: 'over'
        });
        overlays.push({
            imageBuffer: numberBuffer,
            top: 947,
            left: 142,
            blend: 'over'
        });
        if (aboutBuffer) {
            overlays.push({
                imageBuffer: aboutBuffer,
                top: 802,
                left: 144,
                blend: 'over'
            });
        }
        overlays.push({
            imageBuffer: timeBuffer,
            top: 15,
            left: 32,
            blend: 'over'
        });
        overlays.push({
            imageBuffer: cameraIconBuffer,
            top: 450,
            left: 423,
            blend: 'over'
        });

        //These are the overlay config for settings


        //That's it it works!
        if (profilePicSettingsBuffer) {
            overlaysSettings.push({
                imageBuffer: profilePicSettingsBuffer,
                top: 210,
                left: 34,
                blend: 'over'
            });
        }


        //That's it it works!
        overlaysSettings.push({
            imageBuffer: nameSettingsBuffer,
            top: 225,
            left: 190,
            blend: 'over'
        });


        //That's it it works!
        if (aboutBuffer) {
            overlaysSettings.push({
                imageBuffer: aboutBuffer,
                top: 285,
                left: 190,
                blend: 'over'
            });
        }

        //It's already works
        overlaysSettings.push({
            imageBuffer: timeBuffer,
            top: 15,
            left: 32,
            blend: 'over'
        });


        const finalBufferProfile = await bindImageAllTogether(baseBufferProfile, overlays);
        const finalBufferSettings = await bindImageAllTogether(baseBufferSettings, overlaysSettings);
        return { finalBufferProfile, finalBufferSettings };
    } catch (error) {
        console.error(
            'Error compositing images:',
            error instanceof Error ? error.message : error
        );
        throw error;
    }
}
export default editWhatsApp;



/*
whatsapp font family: Roboto
ANIK color : #E9EDEF
Secondary text color (e.g. labels): #8696A0
*/


