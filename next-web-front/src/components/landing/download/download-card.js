import React from "react";
import Image from "next/image";

const DownloadCard = () => {
  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-12 md:py-16 lg:py-20">
      <div
        className="w-full mx-auto rounded-[12px] sm:rounded-[18px] md:rounded-[24px] overflow-hidden"
        style={{
          background:
            "url('/landing/bg-download.jpeg') lightgray 50% / cover no-repeat",
        }}
      >
        <div className="w-full relative flex flex-col lg:flex-row items-center">
          {/* Left content */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4 sm:gap-5 md:gap-6 p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 z-10">
            <h2 className="text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] xl:text-[60px] font-extrabold font-urbanist text-white leading-[1.1]">
              A Bridge That Touches Your Mind And Opens To The Future
            </h2>

            <p className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-urbanist text-white leading-[1.4] opacity-90 max-w-full lg:max-w-[90%]">
              Journey into the depths of your mind with Psynexa. Meet each day
              in a more balanced and peaceful way with Nexabot's empathetic
              support and special suggestions for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 sm:mt-4">
              {/* Google Play button */}
              <a href="#" className="inline-block">
                <div className="rounded-full bg-black flex items-center justify-center gap-[8px] sm:gap-[12px] md:gap-[16px] lg:gap-[24px] py-[10px] px-[16px] sm:py-[12px] sm:px-[20px] md:py-[14px] md:px-[24px] cursor-pointer hover:bg-gray-900 transition-colors">
                  <Image
                    src="/landing/google-icon.svg"
                    alt="Google Play"
                    width={24}
                    height={24}
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                  <Image
                    src="/landing/google-text.svg"
                    alt="Google Play"
                    width={110}
                    height={24}
                    className="h-4 sm:h-5 md:h-6 w-auto"
                  />
                </div>
              </a>

              {/* App Store button */}
              <a href="#" className="inline-block">
                <div className="rounded-full bg-black flex items-center justify-center gap-[8px] sm:gap-[12px] md:gap-[16px] lg:gap-[24px] py-[10px] px-[16px] sm:py-[12px] sm:px-[20px] md:py-[14px] md:px-[24px] cursor-pointer hover:bg-gray-900 transition-colors">
                  <Image
                    src="/landing/apple-icon.svg"
                    alt="App Store"
                    width={24}
                    height={24}
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                  <Image
                    src="/landing/apple-text.svg"
                    alt="App Store"
                    width={90}
                    height={24}
                    className="h-4 sm:h-5 md:h-6 w-auto"
                  />
                </div>
              </a>
            </div>
          </div>

          {/* Right image */}
          <div className="w-full lg:w-1/2 p-6 sm:p-8 flex justify-center lg:justify-end items-center relative z-10">
            <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[480px] xl:max-w-[600px]">
              <Image
                src="/landing/triple.png"
                alt="Psynexa App"
                width={600}
                height={540}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>

          {/* Overlay for better readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,0,0,0.4)] via-[rgba(0,0,0,0.2)] to-[rgba(0,0,0,0.1)] z-0"></div>
        </div>
      </div>
    </div>
  );
};

export default DownloadCard;
