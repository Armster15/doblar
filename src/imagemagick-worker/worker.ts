import { expose } from "comlink";
import { bytesToBase64 } from "byte-base64";
import { ImageMagick, initializeImageMagick } from "imagemagick-wasm-builds";
import { ImageFileTypes } from "$/constants";

interface ConvertFile {
  content: Uint8Array;
  convertTo: ImageFileTypes;
}

export const init = async () => {
  await initializeImageMagick();
  return true
}

export const convertFile = async (data: ConvertFile) => {
  await initializeImageMagick();

  // This monstrosity of promises is for promisifying two functions:
  // One is the ImageMagick.read function, where modifications are applied,
  // and the other being the one where we get the Uint8Array data
  return await new Promise<string>((fulfilled) => {
    ImageMagick.read(data.content, async (image) => {
      // If we are converting to JPG, turn off alpha channel We are doing this
      // explictely because for some reason, ImageMagick corrupts the background
      if (data.convertTo.toLowerCase() === "jpg") {
        // image.alpha(AlphaOption.Remove);
      }

      const newData = await new Promise<Uint8Array>((fulfilled) => {
        // @ts-ignore
        image.write((newData) => fulfilled(newData), data.convertTo);
      });
      
      // We cannot return a Uint8Array from a web worker
      // so we convert the data to a Base64 string and then on 
      // the main thread, we convert it back for downloading
      const stringData = bytesToBase64(newData)
      fulfilled(stringData);
    });
  });
};

const worker = {
  init,
  convertFile
}

export type BaseWorkerType = typeof worker;

expose(worker)