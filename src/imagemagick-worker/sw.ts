/*
This is a service worker that intercepts the import of ImageMagick.
The points of this are:
  1) We need to intercept the fetch request to track the progress of the download
     of the WASM build. Dynamic imports (from what I could find) do not have a method
     of tracking the progress of the download, so we need to intercept its network request

  2) For manually caching the WASM build. On purpose we made Workbox not handle the WASM 
     build so we could track the progress of the download instead of having it cached 
     immediately
*/

// Dummy import that imports nothing to stop TypeScript from complaining
import type {} from "react";
declare const self: ServiceWorkerGlobalScope;

const broadcastMessage = (channel: string, payload: any) => {
  self.clients.matchAll({
    includeUncontrolled: true,
    type: 'window',
  }).then((clients) => {
    if (clients && clients.length) {
      // Send a response - the clients
      // array is ordered by last focused
      clients[0].postMessage({
        channel: channel,
        payload: payload,
      });
    }
  });
}

/*
When a service worker is initially registered, the onfetch event won't be 
triggered until the page is refreshed. The claim() method causes those pages 
to be controlled immediately. 
*/
self.addEventListener("activate", function (event) {
  self.skipWaiting(); // Kick out the current active worker, if there is one

  event.waitUntil(
    self.clients.claim().then(() => {
      // When claimed, tell the main thread the service worker is ready
      // so the main thread can fetch ImageMagick. We do so because we
      // don't want ImageMagick to be fetched before the service worker
      // is ready!
      broadcastMessage("imagemagick-onready", true);
    })
  );
});

// https://stackoverflow.com/a/35712094/5721784
function consume(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  contentLength: number | undefined
) {
  var totalDownloaded = 0;
  return new Promise<void>((resolve, reject) => {
    function pump() {
      reader
        .read()
        .then(({ done, value }) => {
          if (done) {
            resolve();
            return;
          }
          totalDownloaded += value!.byteLength;
          broadcastMessage("imagemagick-progress", {
            bytesDownloadedTotal: totalDownloaded,
            bytesJustDownloaded: value?.byteLength,
            percent: contentLength
              ? (totalDownloaded / contentLength) * 100
              : undefined,
          });
          pump();
        })
        .catch(reject);
    }
    pump();
  });
}

self.addEventListener("fetch", function (event) {
  // console.log(event.request.url)
  if (
    /\/assets\/worker.*.js$/.test(event.request.url) || // Production Regex
    /\/node_modules\/.vite\/imagemagick-wasm-builds.js/.test(event.request.url) || // Development Regex (imagemagick-wasm-builds)
    /\/node_modules\/.vite\/@imagemagick_magick-wasm.js/.test(event.request.url) // Development Regex (@dlemstra/magick-wasm)
    ) {
    event.respondWith(
      caches.match(event.request).then(function (response) {
        if (response) {
          broadcastMessage("imagemagick-loadingmethod", "cache");
          console.log("Found ImageMagick in cache:", response);
          return response;
        }
        broadcastMessage("imagemagick-loadingmethod", "download");
        console.log(
          "ImageMagick not found in cache. About to fetch from network..."
        );

        return fetch(event.request)
          .then((res) => {
            let res2 = res.clone();

            let contentLength: number | undefined = undefined;
            if (process.env.NODE_ENV === "production") {
              contentLength = Number(process.env.WORKER_SIZE!);
            } else {
              contentLength = Number.isNaN(
                Number(res2.headers.get("content-length"))
              )
                ? undefined
                : Number(res.headers.get("content-length"));
            }

            return consume(res2.body!.getReader(), contentLength).then(() => {
              // Cache ImageMagick WASM
              // (note Workbox is not caching ImageMagick so we can manually cache it for the progress bar)
              caches.open("imagemagick").then((cache) => {
                cache.add(event.request);
              });
              return res;
            });
          })
          .catch(function (error) {
            console.error("Fetching failed:", error);
            throw error;
          });
      })
    );
  }
});
