import makeCircularImage from './makeCircularImage';
import { svgTextGenerator } from './svgTextGen';
import { promises as fs } from 'fs';
import bindImageAllTogether, { OverlayConfig } from './bindImageAllTogether';
import path from 'path';
import { z } from 'zod';
import { ImoAppSchema } from "@/app/imo/(server)/utils/ImoAppSchema";
type FormField = z.infer<typeof ImoAppSchema>;


async function editImo(Imo: FormField) {


    const profilePicBuffer = Imo.ImoProfilePic
        ? await (async (pic) => {
            const arrayBuffer = await pic.arrayBuffer();
            const rawBuffer = Buffer.from(arrayBuffer);
            return makeCircularImage(rawBuffer, 127);
        })(Imo.ImoProfilePic)
        : undefined;

    const IdBuffer = Imo.ImoId
        ? svgTextGenerator({
            text: `imo ID: imoid_${Imo.ImoId}`,
            color: "#788187",
            fontSize: 27
        })
        : undefined;

    try {
        const [nameBuffer, numberBuffer, timeBuffer] = await Promise.all([
            svgTextGenerator({
            text: Imo.ImoName,
            color: "#ffffff",
            fontSize: 39
            }),

            svgTextGenerator({
            text: `Phone:${Imo.ImoNumber.substring(1)}`,
            color: "#788187",
            fontSize: 27
            }),
            svgTextGenerator({
            text: Imo.time,
            color: "#ffffff",
            fontSize: 29
            })
        ]);
        const basePathProfile = path.join(process.cwd(), 'src/app/imo/(server)/assets/profile.png');
        const baseBufferProfile = await fs.readFile(basePathProfile);
        const overlays: OverlayConfig[] = [];
        if (profilePicBuffer) {
            overlays.push({
                imageBuffer: profilePicBuffer,
                top: 207,
                left: 31,
                blend: 'over'
            });
        }
        overlays.push({
            imageBuffer: nameBuffer,
            top: 210,
            left: 188,
            blend: 'over'
        });
        overlays.push({
            imageBuffer: numberBuffer,
            top: 302,
            left: 189,
            blend: 'over'
        });
        if (IdBuffer) {
            overlays.push({
                imageBuffer: IdBuffer,
                top: 265,
                left: 190,
                blend: 'over'
            });
        }
        overlays.push({
            imageBuffer: timeBuffer,
            top: 15,
            left: 32,
            blend: 'over'
        });

        const finalBufferProfile = await bindImageAllTogether(baseBufferProfile, overlays);
        return finalBufferProfile;
    } catch (error) {
        console.error(
            'Error compositing images:',
            error instanceof Error ? error.message : error
        );
        throw error;
    }
}

export default editImo;