const esbuild = require("esbuild");
const path = require("path");

const isWatch = process.argv.includes("--watch");

const common = {
 bundle: true,
 platform: "node",
 target: "node20",
 format: "cjs",
 external: ["electron", "7zip-bin", "node-unrar-js"],
 sourcemap: true,
 logLevel: "info",
};

const targets = [
 { entry: "electron/main.ts", out: "dist/electron/main.js" },
 { entry: "electron/preload.ts", out: "dist/electron/preload.js" },
];

async function main() {
 for (const t of targets) {
 const opts = Object.assign({}, common, {
 entryPoints: [path.join(__dirname, t.entry)],
 outfile: path.join(__dirname, t.out),
 });
 if (isWatch) {
 const ctx = await esbuild.context(opts);
 await ctx.watch();
 } else {
 await esbuild.build(opts);
 }
 }
 console.log(isWatch ? "esbuild watching..." : "esbuild build complete");
}

main().catch((e) => { console.error(e); process.exit(1); });
