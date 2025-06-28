import sharp from 'sharp';



//This function is taking input as image and then what also it's taking an diamerter not this is not this is makeing the image a curcular .this is the wrong function!

export default async function makeCircularImage(inputBuffer: Buffer, diameter: number): Promise<Buffer> {
    try {
        // Create a circular mask using SVG:
        // This SVG draws a white circle (the mask) on a transparent background.
        const svgMask = Buffer.from(
            `<svg width="${diameter}" height="${diameter}">
         <circle cx="${diameter / 2}" cy="${diameter / 2}" r="${diameter / 2}" fill="white"/>
       </svg>`
        );

        // Resize the input image to the desired diameter and composite it with the circular mask.
        // The 'dest-in' blend mode uses the alpha channel of the mask to keep only the circular area.
        const circularImageBuffer = await sharp(inputBuffer)
            .resize(diameter, diameter)
            .composite([{ input: svgMask, blend: 'dest-in' }])
            .png() // Output as PNG to preserve transparency.
            .toBuffer();

        return circularImageBuffer;
    } catch (err) {
        console.error('Error creating circular image:', err);
        throw err;
    }
}
