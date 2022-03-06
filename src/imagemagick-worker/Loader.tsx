import React, { useEffect, useState } from "react";
import { useWorkerStatus, useWorkerRefContext } from "./state";
import { importWorker } from "./importWorker";
import { Transition } from '@headlessui/react'
import { ProgressBar } from "$/components/ProgressBar";
import { atom, useAtom } from "jotai";

// This is so even if the Loader is rerendered, the state remains the same
const imagemagickProgressAtom = atom(0);
const progressDeterminateAtom = atom(false);
const displayAtom = atom(true);

function useBroadcast<T = any>(channel: string) {
  const [broadcastMessage, setBroadcastMessage] = useState<T | undefined>(undefined);
  useEffect(() => {
    navigator.serviceWorker.addEventListener("message", (event: MessageEvent<{channel: string; payload: T}>) => {
      if (event.data && event.data.channel === channel) {
        setBroadcastMessage(event.data.payload);
      }
    })
  }, [])
  return broadcastMessage
}


export const Loader: React.FC<{className?: string}> = ({ className }) => {
  const [status, setStatus] = useWorkerStatus();
  const [imagemagickProgress, setImagemagickProgress] = useAtom(imagemagickProgressAtom);
  const [progressDeterminate, setProgressDeterminate] = useAtom(progressDeterminateAtom);
  const [display, setDisplay] = useAtom(displayAtom);
  const workerRef = useWorkerRefContext();

  const imagemagickOnReady = useBroadcast<boolean>("imagemagick-onready");
  const imagemagickLoadingMethod = useBroadcast<"cache" | "download">("imagemagick-loadingmethod");
  const imagemagickDownloadProgress = useBroadcast<{
    bytesDownloadedTotal: number;
    bytesJustDownloaded: number;
    percent?: number;
  }>("imagemagick-progress");

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

  useEffect(() => {
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
  }, []);

  // When the service worker gets activated (if it is not already), load the worker
  useEffect(() => {
    if(imagemagickOnReady) loadWorker()
  }, [imagemagickOnReady])

  // On `imagemagickLoadingMethod` change
  useEffect(() => {
    if(imagemagickLoadingMethod == "download") {
      setProgressDeterminate(true)
      setStatus("downloading")
    }
    else if(imagemagickLoadingMethod == "cache") setStatus("fetching-from-cache")
  }, [imagemagickLoadingMethod])

  // On `imagemagickDownloadProgress` change
  useEffect(() => {
    if(!imagemagickDownloadProgress) return;

    // 90% of the progress bar is for the download. Remaining 10% is for parsing/loading
    let _progress = (imagemagickDownloadProgress.percent ?? Infinity) * 0.9;

    // Somewhat of a hack, maybe use better method in the future
    // If the build has finished downloading, set status to "parsing"
    if(_progress === 90) {
      setStatus("parsing")
    }

    setImagemagickProgress(_progress);
  }, [imagemagickDownloadProgress])

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
