import React, { useContext } from "react";
import { atom, useAtom } from "jotai";
import type { WorkerType } from "./importWorker";

export type WorkerStatus = "not-started" | "downloading" | "fetching-from-cache" | "parsing" | "complete";
export const workerStatusAtom = atom<WorkerStatus>("not-started");
export const useWorkerStatus = () => useAtom(workerStatusAtom);

export const WorkerRefContext = React.createContext<
  React.MutableRefObject<WorkerType | undefined> | undefined
>(undefined);
export const useWorkerRefContext = () => useContext(WorkerRefContext);
