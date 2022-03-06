import React from "react";
import cn from "classnames";
import styles from "./ProgressBar.module.css";

export interface ProgressBarProps {
  minValue?: number;
  maxValue?: number;
  value?: number;
  determinate?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  minValue = 0,
  maxValue = 100,
  value,
  determinate,
}) => {
  if(value === undefined && determinate === undefined) {
    determinate = false;
  }
  else if(determinate === true && value === undefined) {
    throw Error("You must pass in a value if you want the progress bar to be determinate")
  }
  else if (determinate == undefined) {
    determinate = true;
  }
  
  return (
    <div
      className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 relative overflow-hidden"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={minValue}
      aria-valuemax={maxValue}
    >
      {determinate && (
        <div
          className={cn(
            "h-2.5 rounded-full",
            value! >= 100 ? "bg-green-600" : "bg-blue-600",
          )}
          style={{width: `${value}%`}}
        />
      )}

      {!determinate && (
        <div
          className={cn("h-2.5 rounded-full bg-blue-600 absolute left-[-50%] w-[35%]", styles.indeterminate_progressbar)}
        />
      )}
    </div>
  );
};
