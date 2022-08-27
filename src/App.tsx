import React, { useRef } from "react";
import cn from "classnames";
import { useWindowSize } from "react-use";
import { DragDropFile } from "$/components/DragDropFile";
import { uuid4 } from "./utils/uuid";
import {
  Loader,
  WorkerType,
  useWorkerStatus,
  WorkerRefContext,
} from "./imagemagick-worker";
import { ReloadPrompt } from "./components/ReloadPrompt";
import { FileBox } from "./components/FileBox";
import { About } from "./components/About";
import { FileStatus } from "./constants";
import { Portal } from "react-portal";
import { useFilesToConvert } from "./state";
import logo from "./assets/svg/doblar.svg";


export const App = () => {
  const { width } = useWindowSize();
  const workerRef = useRef<WorkerType | undefined>(undefined);
  const isDesktop = width >= 1090;
  const isTablet = width >= 850;
  const [filesToConvert, setFilesToConvert] = useFilesToConvert();
  useWorkerStatus(); // to trigger re-renders

  return (
    <WorkerRefContext.Provider value={workerRef}>
      <div className="bg-gray-200 min-h-screen px-6 py-7 pb-16 space-y-6">
        <header>
          <h1 className="sr-only">doblar</h1>
          <img className="w-44 mb-7" src={logo} alt="doblar" aria-hidden={true} />
        </header>

        <Portal>
          <div className={cn(
            "fixed z-20 space-y-4 w-full tablet:w-[50%] desktop:w-[30%] px-10 tablet:p-0",
            isTablet ? "right-6 top-3" : "grid grid-cols-1 bottom-6"
          )}>
            <Loader />
            <ReloadPrompt />
          </div>
        </Portal>

        {/* DragDropFile & Files Box and Loader for Mobile */}
        <div
          className={cn(
            isDesktop
              ? "h-[50vh] gap-6 grid grid-cols-2"
              : "children:w-full space-y-6"
          )}
        >
          <DragDropFile
            text="Drag a file or click to select one"
            className="text-sm leading-8 bg-blue-400"
            handleFiles={(files) => {
              const fileStatuses: FileStatus[] = files.map((file) => ({
                file: file,
                status: "not-started",
                id: uuid4(),
              }));

              setFilesToConvert([...filesToConvert, ...fileStatuses]);
            }}
          />

          <FileBox />
        </div>
          
        <About />
      </div>
    </WorkerRefContext.Provider>
  );
};
