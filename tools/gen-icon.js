/* =========================================================================
   Generates build/icon.ico (multi-resolution) and build/icon.png (256px)
   from the title-bar logo, using the already-installed Electron to rasterize
   the canvas in tools/icon-render.html. No extra dependencies required.

   Run with:  npm run icon
   ========================================================================= */
const { app, BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("path");

const SIZES = [16, 24, 32, 48, 64, 128, 256];

/** Pack a set of PNG buffers into a single Windows .ico (PNG-compressed entries). */
function buildIco(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4);

  const dir = Buffer.alloc(16 * count);
  let offset = 6 + 16 * count;
  const blobs = [];

  images.forEach((img, i) => {
    const e = dir.subarray(i * 16, i * 16 + 16);
    e.writeUInt8(img.size >= 256 ? 0 : img.size, 0); // width  (0 => 256)
    e.writeUInt8(img.size >= 256 ? 0 : img.size, 1); // height (0 => 256)
    e.writeUInt8(0, 2);  // palette count
    e.writeUInt8(0, 3);  // reserved
    e.writeUInt16LE(1, 4);  // color planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(img.buf.length, 8); // size of image data
    e.writeUInt32LE(offset, 12);        // offset of image data
    offset += img.buf.length;
    blobs.push(img.buf);
  });

  return Buffer.concat([header, dir, ...blobs]);
}

app.disableHardwareAcceleration();

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    show: false,
    width: 512,
    height: 512,
    webPreferences: { offscreen: false },
  });

  await win.loadFile(path.join(__dirname, "icon-render.html"));

  const images = [];
  for (const s of SIZES) {
    const b64 = await win.webContents.executeJavaScript(`renderIcon(${s})`);
    images.push({ size: s, buf: Buffer.from(b64, "base64") });
  }

  const outDir = path.join(__dirname, "..", "build");
  fs.mkdirSync(outDir, { recursive: true });

  const icoPath = path.join(outDir, "icon.ico");
  const pngPath = path.join(outDir, "icon.png");
  fs.writeFileSync(icoPath, buildIco(images));
  fs.writeFileSync(pngPath, images.find((i) => i.size === 256).buf);

  console.log(
    "ICON_OK ico=" + fs.statSync(icoPath).size +
    "B png=" + fs.statSync(pngPath).size +
    "B sizes=" + SIZES.join(",")
  );

  win.destroy();
  app.quit();
}).catch((e) => {
  console.error("ICON_FAIL", e);
  app.exit(1);
});
