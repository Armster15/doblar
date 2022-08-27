import React from "react";
import { useFilesToConvertAtoms } from "$/state";
import { MobileBox } from "$/components/MobileBox";
import { FileName, Select, ActionButtons, StatusTag } from "./Shared";
import cn from "classnames";

export const Mobile = () => {
  const [filesToConvertAtoms, removeFileToConvertAtom] =
    useFilesToConvertAtoms();

  return (
    <div className="bg-white min-h-full rounded">
      <MobileBox title="Files" panelPadding={filesToConvertAtoms.length === 0}>
        {filesToConvertAtoms.length === 0 ? (
          <p className="text-gray-700">No files... yet</p>
        ) : (
          <div className="flex flex-col-reverse">
            {filesToConvertAtoms.map((fileAtom) => {
              return (
                <div
                  className="grid grid-cols-2 px-5 border-t-2 first:border-b-2 py-3"
                  key={fileAtom.toString()}
                >
                  <div className="space-y-1">
                    <FileName fileAtom={fileAtom} />
                    <Select fileAtom={fileAtom} />
                  </div>

                  <div className="grid justify-items-end space-y-1">
                    <StatusTag fileAtom={fileAtom} />
                    <ActionButtons
                      fileAtom={fileAtom}
                      removeFileToConvertAtom={removeFileToConvertAtom}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </MobileBox>
    </div>
  );
};
