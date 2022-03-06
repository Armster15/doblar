import React, { useState, useRef } from "react";
import classNames from "classnames";
import styles from "./DragDropFile.module.css";
import { IconType } from "react-icons";
import { useButton, mergeProps } from "react-aria";
import { DivProps } from "react-html-props";

interface DragDropFileProps {
  text: string;
  handleFiles: (files: File[]) => void;
  icon?: IconType;
  style?: React.CSSProperties;
  acceptableFileTypes?: string;
  className?: string;
}

export const DragDropFile: React.FC<DragDropFileProps> = (props) => {
  const ref = useRef<HTMLElement | null>(null);
  const { buttonProps } = useButton(props, ref);
  const [fileCurrentlyHovered, setFileCurrentlyHovered] = useState(false);
  const Icon = props.icon;

  // This is required to make the drop event listener work
  const handleDragOver: React.DragEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
  };

  // When a file is dragged into the drag area
  const handleDragEnter: React.DragEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    setFileCurrentlyHovered(true);
  };

  // When a file leaves the drag area
  const handleDragLeave: React.DragEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    setFileCurrentlyHovered(false);
  };

  // When a file is dropped
  const handleDrop: React.DragEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    setFileCurrentlyHovered(false);

    const files = Array.from(event.dataTransfer.files);
    props.handleFiles(files);
  };

  // When user clicks the area to select a file
  const handleOnClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();

    let input: HTMLInputElement = document.createElement("input");

    input.setAttribute("type", "file");
    input.setAttribute("multiple", "");
    input.style.display = "none";
    
    if (props.acceptableFileTypes) {
      input.setAttribute("accept", props.acceptableFileTypes);
    }

    /*
    This is a really weird hack for which basically 
    gets run when the the file dialog is either cancelled 
    or a file is "uploaded"
    See https://stackoverflow.com/a/22900815/5721784
    */
    input.onclick = () => {
      document.body.onfocus = () => {
        setTimeout(() => {
          if(input.isConnected) {
            document.body.removeChild(input)
          }
        }, 100);
      };
    }

    input.addEventListener("change", () => {
      const files = Array.from(input.files!);
      props.handleFiles(files);
    });

    document.body.appendChild(input);
    input.click();
  };

  return (
    <button
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleOnClick}
      style={props.style}
      className={classNames(props.className, styles.DragDropFile, {
        [styles.fileCurrentlyHovered]: fileCurrentlyHovered,
      })}
    >
      {Icon !== undefined && (
        <span className={styles["icon-wrapper"]}>
          <Icon size="7em" />
        </span>
      )}
      <p className={styles.text}>{props.text}</p>
    </button>
  );
};
