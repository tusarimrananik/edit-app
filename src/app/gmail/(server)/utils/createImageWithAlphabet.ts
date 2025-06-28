
import sharp from 'sharp';
export const createImageWithAlphabet = async (alphabet: string) => {
    const width = 500;
    const height = 500;
    const svgImage = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#EC407A"/>
            <text x="50%" y="70%" font-size="275px" font-family="Google Sans" font-weight="600" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">
                ${alphabet}
            </text>
        </svg>

    `;
    const buffer = await sharp(Buffer.from(svgImage))
        .png()
        .toBuffer();

    return buffer;
};
