export default function handleImageDownload(imgUrl: string) {
    if (imgUrl) {
        const link = document.createElement('a');
        link.href = imgUrl;
        link.download = 'facebook-screenshot.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};