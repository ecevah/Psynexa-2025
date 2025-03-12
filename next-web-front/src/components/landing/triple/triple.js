import Image from "next/image";
import React from "react";

const Triple = () => {
  return (
    <div className="w-full py-[30px] lg:py-[50px] ">
      {/* Mobil görünüm - sadece küçük ekranlarda */}
      <div className="flex flex-col lg:hidden px-4 items-center justify-center gap-8 max-w-[1400px] mx-auto">
        {/* Text content - appears on top in mobile view */}
        <div className="flex flex-col w-full">
          <h2 className="text-[28px] text-white font-extrabold mb-4">
            A Bridge That Touches Your Mind And Opens To The Future
          </h2>
          <p className="text-white text-[15px] mb-[16px]">
            Journey into the depths of your mind with Psynexa. Meet each day in
            a more balanced and peaceful way with Nexabot's empathetic support
            and special suggestions for you.
          </p>
          <p className="text-white text-[15px] mb-[30px]">
            Journey into the depths of your mind with Psynexa. Meet each day in
            a more balanced and peaceful way with Nexabot's empathetic support
            and special suggestions for you.
          </p>
          <div className="flex flex-row gap-[16px] px-[24px] py-[15px] rounded-full bg-black w-fit">
            <div className="text-[16px] font-semibold leading-[26px] text-white">
              Explore The Apps
            </div>
            <Image
              src="/landing/right-arrow-icon.svg"
              width={24}
              height={24}
              alt="Arrow Right"
            />
          </div>
        </div>

        {/* Image for mobile */}
        <div className="w-full flex justify-center mt-6">
          <Image
            src="/landing/triple.png"
            width={600}
            height={540}
            alt="Triple"
            className="w-full max-w-[80vw] h-auto object-contain"
            priority
          />
        </div>
      </div>

      {/* Orijinal web görünümü - sadece orta ve büyük ekranlarda */}
      <div className="hidden lg:flex flex-row justify-center gap-[40px] xl:gap-[83px] px-[20px] xl:px-[83px]">
        <Image
          src="/landing/triple.png"
          width={600}
          height={540}
          alt="Triple"
          className="lg:max-w-[450px] lg:min-w-[350px] xl:max-w-[600px] xl:min-w-[600px] h-auto object-contain lg:max-h-none xl:max-h-[540px] xl:min-h-[540px]"
        />
        <div className="flex flex-col">
          <div className="text-[36px] xl:text-[48px] text-white font-extrabold lg:w-auto xl:w-[670px]">
            A Bridge That Touches Your Mind And Opens To The Future
          </div>
          <div className="lg:max-w-[450px] xl:max-w-[520px] text-white text-[17px] mb-[24px]">
            Journey into the depths of your mind with Psynexa. Meet each day in
            a more balanced and peaceful way with Nexabot's empathetic support
            and special suggestions for you.
          </div>
          <div className="lg:max-w-[450px] xl:max-w-[520px] text-white text-[17px] mb-[30px] xl:mb-[50px]">
            Journey into the depths of your mind with Psynexa. Meet each day in
            a more balanced and peaceful way with Nexabot's empathetic support
            and special suggestions for you.
          </div>
          <div className="flex flex-row gap-[16px] px-[24px] py-[15px] rounded-full bg-black w-fit">
            <div className="text-[18px] xl:text-[20px] font-semibold leading-[26px] text-white">
              Explore The Apps
            </div>
            <Image
              src="/landing/right-arrow-icon.svg"
              width={24}
              height={24}
              alt="Arrow Right"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Triple;
