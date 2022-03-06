import React from "react";
import { FocusScope, useFocusManager, mergeProps } from 'react-aria';
import { AProps, ButtonProps, DivProps } from "react-html-props";

export const Toolbar: React.FC<DivProps> = (props) => {
  return (
    <div {...props} role="listbox">
      <FocusScope>
        {props.children}
      </FocusScope>
    </div>
  );
}

export const ToolbarButton: React.FC<ButtonProps> = (props) => {
  let focusManager = useFocusManager();

  let newProps = mergeProps(props, {
    onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => {
      switch (e.key) {
        case 'ArrowRight':
          focusManager.focusNext({wrap: true});
          break;
        case 'ArrowLeft':
          focusManager.focusPrevious({wrap: true});
          break;
      }
    }
  })

  return <button {...newProps} />
}

export const ToolbarAnchor: React.FC<AProps> = (props) => {
  let focusManager = useFocusManager();

  let newProps = mergeProps(props, {
    onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => {
      switch (e.key) {
        case 'ArrowRight':
          focusManager.focusNext({wrap: true});
          break;
        case 'ArrowLeft':
          focusManager.focusPrevious({wrap: true});
          break;
      }
    }
  })

  return <a {...newProps} />
}