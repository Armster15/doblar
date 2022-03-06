// @ts-check

const { build } = require('esbuild');
const fg = require('fast-glob');
const fs = require("fs");
const fsPromises = fs.promises;

(async() => {
  const workerPath = await fg("./dist/assets/worker.*.js");
  const workerStats = await fsPromises.stat(workerPath[0]);
  const workerSize = workerStats.size;

  const options = {
      entryPoints: ['./src/imagemagick-worker/sw.ts'],
      inject: ["./public/broadcastchannel-polyfill.js"],
      outfile: './public/imagemagick_sw.js',
      define: {
        'process.env.NODE_ENV': '"production"',
        'process.env.WORKER_SIZE': workerSize.toString(),
      },
      minify: true,
    }

  try {
    await build(options);
    await fsPromises.copyFile("./public/imagemagick_sw.js", "./dist/imagemagick_sw.js");

    console.log("Built Service Worker")
  }
  catch (e) {
    process.exit(1)
  }
})()