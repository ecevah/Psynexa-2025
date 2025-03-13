import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

const GridCard = () => {
  const t = useTranslations("HomePage.grid-card");
  return (
    <div className="px-3 xs:px-4 sm:px-[25px] md:px-[35px] lg:px-[50px] my-[30px] xs:my-[40px] sm:my-[60px] lg:my-[80px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 max-w-[1550px] mx-auto">
        {/* Card 1 */}
        <div
          className="bg-[rgba(7,57,95,0.40)] border-[0.3px] border-solid border-[#064476] rounded-[12px] xs:rounded-[16px] sm:rounded-[24px] col-span-1 overflow-hidden h-full flex flex-col"
          data-aos="fade-right"
          style={{
            background: `linear-gradient(rgba(0,84,133,0.30), rgba(7,57,95,0.40)), url('/landing/faq-shape.png')`,
            backgroundSize: "contain",
            backgroundPosition: "center",
          }}
        >
          <div className="text-white text-[18px] xs:text-[20px] sm:text-[24px] lg:text-[28px] font-bold leading-tight xs:leading-normal sm:leading-[39px] mx-3 xs:mx-[16px] sm:mx-[24px] mt-[30px] xs:mt-[40px] sm:mt-[70px] mb-[5px] xs:mb-[7px]">
            {t("grid-1-title")}
          </div>
          <div className="text-white text-[14px] xs:text-[16px] sm:text-[18px] leading-[18px] xs:leading-[20px] sm:leading-[25px] mx-3 xs:mx-[16px] sm:mx-[24px]">
            {t("grid-1-description")}
          </div>
          <div className="relative h-[90px] xs:h-[120px] sm:h-[150px] xs:mt-[30px] sm:mt-[50px] overflow-hidden mt-auto">
            <Image
              src="/landing/lock.svg"
              width={960}
              height={150}
              alt="lock"
              className="w-full absolute left-1/2 transform -translate-x-1/2 bottom-0 object-contain max-w-none"
              style={{ width: "calc(100% + 100px)" }}
              priority
            />
          </div>
        </div>

        {/* Card 2 */}
        <div
          className="bg-[rgba(7,57,95,0.40)] border-[0.3px] border-solid border-[#064476] rounded-[12px] xs:rounded-[16px] sm:rounded-[24px] col-span-1 lg:col-span-2 p-[15px] xs:p-[20px] sm:pl-[40px] sm:pt-[70px] sm:pr-[20px] sm:pb-[20px] relative overflow-hidden min-h-[280px] xs:min-h-[300px] sm:min-h-[400px] max-h-[500px] lg:max-h-[530px] h-full"
          style={{
            background: `linear-gradient(rgba(0,84,133,0.30), rgba(7,57,95,0.40)), url('/landing/faq-shape.png')`,
            backgroundSize: "contain",
            backgroundPosition: "center",
          }}
          data-aos="fade-left"
        >
          <div className="flex flex-col gap-[6px] xs:gap-[8px] sm:gap-[16px] w-full xs:w-[60%] sm:w-[335px] z-10 relative">
            <div className="text-white text-[18px] xs:text-[20px] sm:text-[24px] lg:text-[28px] font-bold leading-tight xs:leading-normal sm:leading-[39px]">
              {t("grid-2-title")}
            </div>
            <div className="text-white text-[14px] xs:text-[16px] sm:text-[18px] leading-[18px] xs:leading-[20px] sm:leading-[25px]">
              {t("grid-2-description")}
            </div>
          </div>
          <div className="relative w-full h-[200px] xs:h-[250px] sm:h-[300px] lg:h-[400px] mt-3 xs:mt-4 sm:mt-0">
            <div className="absolute inset-0">
              <Image
                src="/landing/tests.png"
                width={280}
                height={620}
                alt="tests"
                className="absolute right-0 top-0 xs:right-[3%] sm:right-[5%] sm:top-0 md:-top-[30px] lg:-top-[50px] xl:-top-[150px] w-[40%] xs:w-[35%] sm:w-auto h-auto sm:max-h-[280px] md:max-h-[320px] lg:max-h-[400px] xl:max-h-[620px] object-contain z-20"
                priority
              />
              <Image
                src="/landing/jane-mark.png"
                width={280}
                height={620}
                alt="jane mark"
                className="absolute right-[25%] xs:right-[28%] top-[10px] xs:top-[20px] sm:right-[25%] sm:top-[20px] md:-top-[50px] lg:-top-[90px] xl:-top-[210px] w-[40%] xs:w-[35%] sm:w-auto h-auto sm:max-h-[280px] md:max-h-[320px] lg:max-h-[400px] xl:max-h-[620px] object-contain z-10"
                priority
              />
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div
          className="bg-[rgba(7,57,95,0.40)] border-[0.3px] border-solid border-[#064476] rounded-[12px] xs:rounded-[16px] sm:rounded-[24px] col-span-1 sm:col-span-2 relative p-[15px] xs:p-[20px] sm:p-[30px] min-h-[280px] xs:min-h-[300px] sm:min-h-[415px] overflow-hidden h-full"
          style={{
            background: `linear-gradient(rgba(0,84,133,0.30), rgba(7,57,95,0.40)), url('/landing/faq-shape.png')`,
            backgroundSize: "contain",
            backgroundPosition: "center",
          }}
          data-aos="fade-right"
        >
          <div className="flex flex-col w-full xs:w-[70%] sm:w-[60%] md:w-[50%] lg:w-[396px] text-white text-left sm:text-right sm:ml-auto relative z-10">
            <div className="text-[18px] xs:text-[20px] sm:text-[24px] lg:text-[28px] font-bold leading-tight xs:leading-normal sm:leading-[39px] mb-2 sm:mb-0">
              {t("grid-3-title")}
            </div>
            <div className="text-[14px] xs:text-[16px] sm:text-[18px] leading-[18px] xs:leading-[20px] sm:leading-[25px]">
              {t("grid-3-description")}
            </div>
          </div>
          <div className="relative w-full h-[180px] xs:h-[200px] sm:h-[300px] mt-3 xs:mt-4 sm:mt-0">
            <div className="absolute inset-0 overflow-visible">
              <Image
                src="/landing/mood-treacker.png"
                width={870}
                height={712}
                alt="mood tracker"
                className="absolute -bottom-[30px] -left-[30px] xs:-bottom-[50px] xs:-left-[50px] sm:-bottom-[150px] sm:-left-[80px] md:-bottom-[180px] md:-left-[90px] lg:-bottom-[250px] lg:-left-[100px] xl:-bottom-[300px] w-[120%] xs:w-[115%] sm:w-[110%] md:w-[105%] lg:w-[100%] h-auto object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div
          className="bg-[rgba(7,57,95,0.40)] border-[0.3px] border-solid border-[#064476] rounded-[12px] xs:rounded-[16px] sm:rounded-[24px] col-span-1 px-[15px] xs:px-[20px] sm:px-[30px] py-[15px] xs:py-[20px] flex flex-col relative overflow-hidden min-h-[280px] xs:min-h-[300px] sm:min-h-[415px] h-full"
          style={{
            background: `linear-gradient(rgba(0,84,133,0.30), rgba(7,57,95,0.40)), url('/landing/faq-shape.png')`,
            backgroundSize: "contain",
            backgroundPosition: "center",
          }}
          data-aos="fade-left"
        >
          <div className="text-white text-[18px] xs:text-[20px] sm:text-[24px] lg:text-[28px] font-bold leading-tight xs:leading-normal sm:leading-[39px] mb-[6px] xs:mb-[8px] sm:mb-[16px] relative z-10">
            {t("grid-4-title")}
          </div>
          <div className="text-white text-[14px] xs:text-[16px] sm:text-[18px] leading-[18px] xs:leading-[20px] sm:leading-[25px] relative z-10">
            {t("grid-4-description")}
          </div>
          <div className="relative w-full h-[180px] xs:h-[200px] sm:h-[250px] md:h-[280px] mt-auto">
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src="/landing/breathing-tech.png"
                width={525}
                height={465}
                alt="breathing"
                className="absolute -bottom-[30px] -left-[10px] xs:-bottom-[40px] xs:left-[0] sm:-bottom-[80px] md:-bottom-[100px] lg:-bottom-[120px] xl:-bottom-[150px] w-[100%] h-auto object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridCard;
