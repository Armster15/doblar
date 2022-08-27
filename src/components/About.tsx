import React from "react";
import { useWindowSize } from "react-use";
import { Card } from "./Card";
import { MobileBox } from "./MobileBox";
import { IoLockClosedOutline, IoLogoGithub } from "react-icons/io5";
import { MdOutlineWifiOff } from "react-icons/md";

export const About = () => {
  const { width } = useWindowSize();
  const isTablet = width >= 850;
  const TopLevelComponent = 
    isTablet 
      ? ({ children }: {children: React.ReactNode}) => <div className="bg-white rounded py-8 px-8">{children}</div> 
      : ({ children }: {children: React.ReactNode}) => <MobileBox title="About">{children}</MobileBox>;
    
  return (
    <TopLevelComponent>
      <h2 className="font-bold text-2xl">Why Doblar?</h2>
      <p className="my-5">
        Doblar is not an ordinary image converter. All the conversion happens
        right in your browser. In other words, nothing is uploaded to a server,
        it is purely local!
      </p>

      <div className={isTablet ? "grid grid-cols-3 gap-6" : "space-y-10"}>
        <Card
          icon={IoLockClosedOutline}
          title="Secure"
          description={
            <>
              Since the file conversion is local, nothing leaves your device.
              This means you can safely use sensitive files without having to
              worry about someone else being able to access them, because we
              can't. Doblar is purely client side - there isn't even a server
              involved!
            </>
          }
        />

        <Card
          icon={MdOutlineWifiOff}
          title="Works Offline"
          tag="Beta"
          description={
            <>
              If you aren't connected to the Internet, you can still use Doblar!
              Try it out yourself: turn off your WiFi, refresh the page and try
              converting an image! The only catch is you need to make sure
              ImageMagick has been fully downloaded before you go offline, but
              once it's downloaded, Doblar works offline!
            </>
          }
        />

        <Card
          icon={IoLogoGithub}
          title="Open Source"
          description={
            <>
              Doblar is fully open source. Doblar uses open source software as
              well, so you can truly see Doblar is 100% local.
              <br />
              <br />
              <a
                className="link"
                href="https://github.com/Armster15/doblar"
                target="_blank"
              >
                GitHub Repository
              </a>
            </>
          }
        />
      </div>
    </TopLevelComponent>
  );
};
