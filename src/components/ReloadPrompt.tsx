import React, { useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Transition } from "@headlessui/react";
import { IoCheckmarkCircle, IoClose } from "react-icons/io5";
import sparkles from "$/assets/svg/sparkles.svg";

export const ReloadPrompt: React.FC = () => {
  const [display, setDisplay] = useState(false);
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log("SW Registered: " + r);
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
    onOfflineReady() {
      setDisplay(true);
      setTimeout(() => setDisplay(false), 3000);
    },
    onNeedRefresh() {
      setDisplay(true);
    },
  });


  return (
    <Transition
      show={display}
      leave="transition-opacity duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="toast">
        <div className="flex">
          <div className="flex flex-grow items-center space-x-1 p-3">
            <span className="text-2xl">
              {offlineReady && <IoCheckmarkCircle className="text-green-600" />}
              {needRefresh && (
                <img
                  className="select-none pointer-events-none"
                  width={24}
                  src={sparkles}
                />
              )}
            </span>
            <span className="text-base">
              {offlineReady && "Doblar is ready to work offline!"}
              {needRefresh && "A new update is ready!"}
            </span>
            <div className="flex-grow"></div>
            {needRefresh && (
              <button
                className="font-semibold focus:underline text-blue-600 active:text-blue-800"
                onClick={() => updateServiceWorker(true)}
              >
                Update
              </button>
            )}
          </div>

          {needRefresh && (
            <button
              className="flex border-l-2 border-slate-200 justify-center items-center p-2 active:bg-slate-200 duration-150"
              onClick={() => setDisplay(false)}
            >
              <IoClose />
            </button>
          )}
        </div>
      </div>
    </Transition>
  );
};
