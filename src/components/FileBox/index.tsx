import React from "react";
import { useWindowSize } from "react-use";
import { Desktop } from "./Desktop";
import { Mobile } from "./Mobile";

export const FileBox = () => {
  const { width } = useWindowSize();
  const isDesktop = width >= 1090;

  return isDesktop ? <Desktop /> : <Mobile />
}