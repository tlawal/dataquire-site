import sharp from "sharp";
await sharp("public/og-dataquire.svg").resize(1200,630).png().toFile("public/og-dataquire.png");
console.log("Created original 1200 × 630 Open Graph image.");
