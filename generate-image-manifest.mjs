import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imageDir = path.join(__dirname, "img");
const manifestPath = path.join(imageDir, "manifest.json");
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

async function generateManifest() {
  const dirEntries = await fs.readdir(imageDir, { withFileTypes: true });

  const images = dirEntries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) => allowedExtensions.has(path.extname(fileName).toLowerCase()))
    .sort((left, right) => left.localeCompare(right, "es"))
    .map((fileName, index) => ({
      src: `img/${fileName}`,
      alt: `Imagen ${index + 1}`
    }));

  await fs.writeFile(
    manifestPath,
    JSON.stringify({ images }, null, 2) + "\n",
    "utf8"
  );

  console.log(`Manifest generado con ${images.length} imagen(es).`);
}

generateManifest().catch((error) => {
  console.error("No se pudo generar el manifest de imagenes.");
  console.error(error);
  process.exitCode = 1;
});
