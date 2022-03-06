import React from "react";
import ReactDOM from "react-dom";
import './index.css'
import { App } from "./App";

/* 
The ImageMagick Service Worker in production is loaded with
vite-plugin-pwa but not in development, so we just load it
manually for development
*/
if ('serviceWorker' in navigator && import.meta.env.DEV) {
  (async () => {
    await navigator.serviceWorker.register("./imagemagick_sw.js")
    console.log("Service worker registered")
  })()
}

/* Import tota11y if in dev mode */
if(import.meta.env.DEV) {
  // @ts-ignore
  await import("@khanacademy/tota11y")
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
