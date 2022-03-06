import React from "react";
import { IoSync, IoClose, IoDownloadOutline, IoReload } from "react-icons/io5";
import ReactSelect from "react-select";
import { Toolbar, ToolbarButton, ToolbarAnchor } from "$/components/Toolbar";
import { useAtom } from "jotai";
import cn from "classnames";
import { useWorkerRefContext } from "$/imagemagick-worker";
import { LoadingIcon } from "$/components/LoadingIcon";
import { FileStatus, imageFileTypes } from "$/constants";
import type { PrimitiveAtom } from "jotai";
import { convertFile } from "$/utils/convertFile";

export const statusBoxRendering: {
  [key in FileStatus["status"]]: {
    className: string;
    displayName: string;
    icon?: React.ReactNode;
  };
} = {
  "in-progress": {
    displayName: "Converting",
    className: "bg-orange-400",
    icon: <LoadingIcon />,
  },
  "not-started": {
    displayName: "Ready",
    className: "border-2 !text-black border-green-300 bg-green-100",
  },
  failed: {
    displayName: "Failed",
    className: "bg-red-400",
  },
  success: {
    displayName: "Finished",
    className: "bg-green-400",
  },
};

interface State {
  fileAtom: PrimitiveAtom<FileStatus>;
}

interface ActionButtonsProps extends State {
  removeFileToConvertAtom: (update: PrimitiveAtom<FileStatus>) => void
}

export const FileName: React.FC<State> = ({ fileAtom }) => {
  const [file, setFile] = useAtom(fileAtom)

  return (
  <p
    className="text-lg whitespace-nowrap overflow-x-auto scrollbar"
    style={{ scrollbarWidth: "thin" }}
  >
    {file.file.name}
  </p>
)};

export const Select: React.FC<State> = ({ fileAtom }) => {
  const [file, setFile] = useAtom(fileAtom)

  return (
  <ReactSelect
    className="w-full"
    menuPortalTarget={document.body}
    isDisabled={file.status === "in-progress" || file.status === "success"}
    onChange={(e) => setFile({...file, "convertTo": e?.value})}
    options={imageFileTypes.map((v) => ({
      value: v,
      label: v,
    }))}
  />
)};

export const StatusTag: React.FC<State> = ({ fileAtom }) => {
  const [file, setFile] = useAtom(fileAtom)

  return (
  <span
    title={file.statusTooltip}
    className={cn(
      "inline-flex items-center px-2 rounded py-1 text-white uppercase text-sm ",
      statusBoxRendering[file.status].className
    )}
  >
    {statusBoxRendering[file.status].icon}
    {statusBoxRendering[file.status].displayName}
  </span>
)};

export const ActionButtons: React.FC<ActionButtonsProps> = ({ fileAtom, removeFileToConvertAtom }) => {
  const ref = useWorkerRefContext();
  const [file, setFile] = useAtom(fileAtom);

  const deleteElement = (arr: any[], index: number) => arr.filter(s => s.length <= index);

  return (
    <Toolbar className="flex space-x-2">
      {/* Convert button */}
      {file.status === "not-started" && (
        <ToolbarButton
          title="Convert this file"
          aria-label="Convert this file"
          disabled={!(file.convertTo && ref?.current)}
          onClick={() => {
            setFile({ ...file, status: "in-progress" })     
            convertFile(file, ref!.current!).then((newFile) => setFile(newFile));
          }}
          className={cn(
            "p-2 rounded text-white",
            "bg-blue-500 not-disabled:hover:shadow-md duration-150 not-disabled:active:bg-blue-600",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
        >
          <IoSync className="inline" />
        </ToolbarButton>
      )}

      {/* Download button */}
      {file.status === "success" && (
        <ToolbarAnchor
          title="Download this file"
          aria-label="Download this file"
          href={file.successData?.url}
          download={file.file.name
            .replace(/\.[^/.]+$/, "")
            .concat(".", file.convertTo as string)}
          className={cn(
            "p-2 rounded text-white",
            "bg-green-500 not-disabled:hover:shadow-md duration-150 not-disabled:active:bg-green-600",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
        >
          <IoDownloadOutline className="inline" />
        </ToolbarAnchor>
      )}

      {/* Retry Button */}
      {file.status === "failed" && (
        <ToolbarButton
          title="Retry conversion"
          aria-label="Retry conversion"
          disabled={!ref?.current}
          onClick={() => {
            setFile({ ...file, status: "in-progress" })      
            convertFile(file, ref!.current!).then((newFile) => setFile(newFile))
          }}
          className={cn(
            "p-2 rounded text-white",
            "bg-orange-500 not-disabled:hover:shadow-md duration-150 not-disabled:active:bg-orange-600",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
        >
          <IoReload className="inline" />
        </ToolbarButton>
      )}

      <ToolbarButton
        title="Remove this file"
        aria-label="Remove this file"
        onClick={() => removeFileToConvertAtom(fileAtom)}
        className={cn(
          "p-2 rounded text-white",
          "bg-red-500 not-disabled:hover:shadow-md duration-150 not-disabled:active:bg-red-600",
          "disabled:opacity-40 disabled:cursor-not-allowed"
        )}
      >
        <IoClose className="inline" />
      </ToolbarButton>
    </Toolbar>
  );
};
