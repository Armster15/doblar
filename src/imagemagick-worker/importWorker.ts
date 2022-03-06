import type { AsyncReturnType } from "type-fest";
import type { BaseWorkerType } from "./worker";
import { wrap, Remote } from "comlink";
import createBaseWorkerProd from "./worker?worker";

export type WorkerType = AsyncReturnType<typeof importWorker>;

export const importWorker = async () => {
  /*
    In development mode, the module workers polyfill is needed.
    Hence we need to be dynamically importing both the polyfill
    and the worker
    */
  let worker: Remote<BaseWorkerType>;

  if (import.meta.env.DEV) {
    // @ts-expect-error
    await import("../../node_modules/module-workers-polyfill/");
    const createBaseWorkerDev = (await import("./worker?worker")).default;
    worker = wrap<BaseWorkerType>(new createBaseWorkerDev());
  } else {

  /*
    In production we use a regular, top level import statement as when we 
    code split it, it creates two worker.[hash].js files. This is undesirable
    as this confuses the regex in the service worker that monitors the download
    for the service worker to track it's progress, as it is a very big file
    */
    worker = wrap<BaseWorkerType>(new createBaseWorkerProd());
  }

  await worker.init();
  return worker;
};
