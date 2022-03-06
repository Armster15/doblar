import { atom, useAtom } from "jotai";
import { splitAtom } from "jotai/utils";
import { FileStatus } from "./constants";

export const filesToConvertAtom = atom<FileStatus[]>([])
const filesToConvertAtomsAtom = splitAtom(filesToConvertAtom);
export const useFilesToConvert = () => useAtom(filesToConvertAtom)
export const useFilesToConvertAtoms = () => useAtom(filesToConvertAtomsAtom)
