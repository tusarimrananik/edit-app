import sharp, { Blend } from 'sharp';
export interface OverlayConfig {
    imageBuffer: Buffer;
    top?: number;
    left?: number;
    blend?: Blend;
}
export default async function bindImageAllTogether(baseBuffer: Buffer, overlays: OverlayConfig[]): Promise<Buffer> {
    const baseImage = sharp(baseBuffer);
    const compositeOptions = overlays.map(overlay => ({
        input: overlay.imageBuffer,
        top: overlay.top || 0,
        left: overlay.left || 0,
        blend: overlay.blend || 'over'
    }));
    return await baseImage.composite(compositeOptions).toBuffer();
}
