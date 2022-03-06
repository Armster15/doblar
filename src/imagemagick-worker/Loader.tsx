import React, { useEffect } from "react";
import { useWorkerStatus, useWorkerRefContext } from "./state";
import { importWorker } from "./importWorker";
import { Transition } from '@headlessui/react'
import { ProgressBar } from "$/components/ProgressBar";
import { atom, useAtom } from "jotai";

// This is so even if the Loader is rerendered, the state remains the same
const imagemagickProgressAtom = atom(0);
const progressDeterminateAtom = atom(false);
const displayAtom = atom(true);

export const Loader: React.FC<{className?: string}> = ({ className }) => {
  const [status, setStatus] = useWorkerStatus();
  const [imagemagickProgress, setImagemagickProgress] = useAtom(imagemagickProgressAtom);
  const [progressDeterminate, setProgressDeterminate] = useAtom(progressDeterminateAtom);
  const [display, setDisplay] = useAtom(displayAtom);
  const workerRef = useWorkerRefContext();

  useEffect(() => {
    const loadWorker = async () => {
      let _worker = await importWorker();
      workerRef!.current = _worker
      setImagemagickProgress(100);
      setProgressDeterminate(true);
      setStatus("complete");

      // Hide Loader in 3 seconds
      setTimeout(() => {
        setDisplay(false)
      }, 3000)
    }
    const broadcast = new BroadcastChannel("imagemagick-progress");
    const onReadyBroadcast = new BroadcastChannel("imagemagick-onready");
    const loadingMethodBroadcast = new BroadcastChannel("imagemagick-loadingmethod");

    broadcast.onmessage = (
      event: MessageEvent<{
        bytesDownloadedTotal: number;
        bytesJustDownloaded: number;
        percent?: number;
      }>
    ) => {
      // 90% of the progress bar is for the download. Remaining 10% is for parsing/loading
      let _progress = (event.data.percent ?? Infinity) * 0.9;

      // Somewhat of a hack, maybe use better method in the future
      // If the build has finished downloading, set status to "parsing"
      if(_progress === 90) {
        setStatus("parsing")
      }

      setImagemagickProgress((event.data.percent ?? Infinity) * 0.9);
    };

    loadingMethodBroadcast.onmessage = (event: MessageEvent<"cache" | "download">) => {
      if(event.data == "download") {
        setProgressDeterminate(true)
        setImagemagickProgress(0)
        setStatus("downloading")
      }
      else if(event.data == "cache") setStatus("fetching-from-cache")
      else throw Error("invalid value")
    }

    // If Component got re rendered, don't do anything
    if (status !== "not-started") {
      return
    }
    // If service workers are not supported just load the worker but no progress bar :(
    else if (!("serviceWorker" in navigator)) {
      setStatus("downloading");
      loadWorker()
    }
    // If the service worker is loaded go ahead and fetch the worker
    else if(navigator.serviceWorker.controller !== null) {
      loadWorker()
    }
    // Else wait for the worker to load and tell us it is ready
    else {
      onReadyBroadcast.onmessage = async () => loadWorker()
    }
  }, []);

  return (
    <Transition 
      show={display} 
      leave="transition-opacity duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="toast p-3">
        <div className="flex justify-between text-base mb-2 space-x-4">
          <p>
            {
              (status === "not-started" && "Getting started...") || 
              (status === "downloading" && "Downloading ImageMagick...") || 
              (status === "fetching-from-cache" && "Fetching ImageMagick from cache") || 
              (status === "parsing" && "Parsing") || 
              (status === "complete" && "Finished!")
            }
          </p>
          {progressDeterminate &&
            <p className="order-last font-bold">{
              // If decimal, show the 2 digits of decimal, else don't show
              imagemagickProgress % 1 !== 0 ? imagemagickProgress.toFixed(2) : imagemagickProgress.toFixed(0)
            }%</p>
          }
        </div>
        <ProgressBar value={imagemagickProgress} determinate={progressDeterminate} />
      </div>
    </Transition>
  );
};
