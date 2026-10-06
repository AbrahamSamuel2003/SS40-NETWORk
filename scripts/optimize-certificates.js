
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const certDir = path.join(__dirname, "..", "public", "images", "certificates");

const certFiles = [
    {
        input: "mca-certificate-of-incorporation.png",
        outputWebp: "mca-certificate-of-incorporation.webp",
        outputAvif: "mca-certificate-of-incorporation.avif",
    },
    {
        input: "startup-india-recognition.png",
        outputWebp: "startup-india-recognition.webp",
        outputAvif: "startup-india-recognition.avif",
    },
    {
        input: "gst-registration-certificate.png",
        outputWebp: "gst-registration-certificate.webp",
        outputAvif: "gst-registration-certificate.avif",
    },
];

async function optimize() {
    console.log("Starting dual WebP & AVIF certificate image optimization...");
    for (const item of certFiles) {
        const inputPath = path.join(certDir, item.input);
        const outputWebpPath = path.join(certDir, item.outputWebp);
        const outputAvifPath = path.join(certDir, item.outputAvif);

        if (fs.existsSync(inputPath)) {
            const inputStats = fs.statSync(inputPath);
            
            // WebP (82% quality for sharp typography)
            await sharp(inputPath)
                .webp({ quality: 82, effort: 6 })
                .toFile(outputWebpPath);
            const webpStats = fs.statSync(outputWebpPath);

            // AVIF (75% quality for extreme compression with intact vector clarity)
            await sharp(inputPath)
                .avif({ quality: 75, effort: 6 })
                .toFile(outputAvifPath);
            const avifStats = fs.statSync(outputAvifPath);

            console.log(
                `✓ Optimized ${item.input}: Original: ${(inputStats.size / 1024).toFixed(1)} KB | WebP: ${(webpStats.size / 1024).toFixed(1)} KB | AVIF: ${(avifStats.size / 1024).toFixed(1)} KB`
            );
        }
    }
}

optimize().catch(console.error);
