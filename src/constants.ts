export const imageFileTypes = ["JPG", "PNG", "GIF", "WEBP", "TIFF"] as const;
export type ImageFileTypes = typeof imageFileTypes[number];

export type FileStatus = {
  file: File;
  id: string;
  status: "in-progress" | "not-started" | "failed" | "success";
  convertTo?: ImageFileTypes;
  statusTooltip?: string;
  successData?: {
    data: Uint8Array;
    url: string;
  };
};
