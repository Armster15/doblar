import React from "react";
import { useFilesToConvertAtoms } from "$/state";
import { FileName, Select, ActionButtons, StatusTag } from "./Shared";


export const Desktop = () => {
  const [filesToConvertAtoms, removeFileToConvertAtom] = useFilesToConvertAtoms();

  return (
    <div className="bg-white rounded pb-8 overflow-y-scroll scrollbar">
      <div className="sticky top-0 bg-white border-b-2 pt-8 z-10 shadow-sm">
        <h2 className="font-bold text-3xl pb-5 px-5 ">Files</h2>
      </div>
      {filesToConvertAtoms.length === 0 ? (
        <p className="px-5 py-5 text-gray-700">No files... yet</p>
      ) : (
        <div className="flex flex-col-reverse"> {/* Render the list in a reverse order with CSS instead of JS :) */}
          {filesToConvertAtoms.map((fileAtom) => {   
            return (
              <div
                key={fileAtom.toString()}
                className="grid grid-cols-6 px-5 gap-3 odd:bg-slate-100 border-b-2 border-slate-100 py-2"
              >
                <div className="flex col-span-2 items-center">
                  <FileName fileAtom={fileAtom} />
                </div>
                <div className="col-span-2">
                  <div className="flex">
                    <Select fileAtom={fileAtom} />
                  </div>
                </div>
                <div className="flex">
                  <div className="flex justify-end items-center flex-1">
                    <StatusTag fileAtom={fileAtom} />
                  </div>
                </div>
                <div className="flex">
                  <div className="flex justify-end items-center flex-1">
                    <ActionButtons fileAtom={fileAtom} removeFileToConvertAtom={removeFileToConvertAtom} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
