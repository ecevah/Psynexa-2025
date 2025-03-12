import Image from "next/image";
import React from "react";

const GridCard = () => {
  return (
    <div className="px-4 sm:px-[25px] lg:px-[50px] my-[40px] sm:my-[60px] lg:my-[80px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-[1550px] mx-auto">
        {/* Card 1 */}
        <div
          className="bg-[rgba(7,57,95,0.40)] border-[0.3px] border-solid border-[#064476] rounded-[16px] sm:rounded-[24px] col-span-1 overflow-hidden"
          style={{
            background: `linear-gradient(rgba(0,84,133,0.30), rgba(7,57,95,0.40)), url('/landing/faq-shape.png')`,
            backgroundSize: "contain",
            backgroundPosition: "center",
          }}
        >
          <div className="text-white text-[20px] sm:text-[24px] lg:text-[28px] font-bold leading-tight sm:leading-[39px] mx-[16px] sm:mx-[24px] mt-[40px] sm:mt-[70px] mb-[7px]">
            Luctus vitae pretium lorem luctus vitae pretium lorem luctus
          </div>
          <div className="text-white text-[16px] sm:text-[18px] leading-[20px] sm:leading-[25px] mx-[16px] sm:mx-[24px]">
            Lorem ipsum dolor sit amet consectetur. Luctus vitae pretium lorem
            tellus sed Lorem ipsum dolor sit amet consectetur. Luctus vitae
            pretium lorem tellus sed
          </div>
          <div className="relative h-[120px] sm:h-[150px] mt-[30px] sm:mt-[50px] overflow-hidden">
            <Image
              src="/landing/lock.svg"
              width={960}
              height={150}
              alt="lock"
              className="w-[960px] h-auto absolute left-1/2 transform -translate-x-1/2"
            />
          </div>
        </div>

        {/* Card 2 */}
        <div
          className="bg-[rgba(7,57,95,0.40)] border-[0.3px] border-solid border-[#064476] rounded-[16px] sm:rounded-[24px] col-span-1 lg:col-span-2 p-[20px] sm:pl-[40px] sm:pt-[70px] relative overflow-hidden min-h-[300px] sm:min-h-[400px] max-h-[530px]"
          style={{
            background: `linear-gradient(rgba(0,84,133,0.30), rgba(7,57,95,0.40)), url('/landing/faq-shape.png')`,
            backgroundSize: "contain",
            backgroundPosition: "center",
          }}
        >
          <div className="flex flex-col gap-[8px] sm:gap-[16px] w-full sm:w-[335px] z-10 relative">
            <div className="text-white text-[20px] sm:text-[24px] lg:text-[28px] font-bold leading-tight sm:leading-[39px]">
              Luctus vitae pretium lorem luctus vitae
            </div>
            <div className="text-white text-[16px] sm:text-[18px] leading-[20px] sm:leading-[25px]">
              Lorem ipsum dolor sit amet consectetur. Luctus vitae pretium lorem
              tellus sed Lorem ipsum
            </div>
          </div>
          <div className="relative w-full h-[250px] sm:h-[300px] lg:h-[400px] mt-4 sm:mt-0">
            <Image
              src="/landing/tests.png"
              width={280}
              height={620}
              alt="tests"
              className="absolute right-0 top-0 sm:right-[5%] sm:top-0 lg:-top-[50px] xl:-top-[150px] xl:right-[5%] w-[40%] sm:w-auto h-auto sm:max-h-[300px] lg:max-h-[400px] xl:max-h-[620px] object-contain"
            />
            <Image
              src="/landing/jane-mark.png"
              width={280}
              height={620}
              alt="jane mark"
              className="absolute right-[30%] top-[30px] sm:right-[25%] sm:top-[20px] lg:-top-[90px] xl:-top-[210px] w-[40%] sm:w-auto h-auto sm:max-h-[300px] lg:max-h-[400px] xl:max-h-[620px] object-contain"
            />
          </div>
        </div>

        {/* Card 3 */}
        <div
          className="bg-[rgba(7,57,95,0.40)] border-[0.3px] border-solid border-[#064476] rounded-[16px] sm:rounded-[24px] col-span-1 sm:col-span-2 relative p-[20px] sm:p-[30px] min-h-[300px] sm:min-h-[415px] overflow-hidden"
          style={{
            background: `linear-gradient(rgba(0,84,133,0.30), rgba(7,57,95,0.40)), url('/landing/faq-shape.png')`,
            backgroundSize: "contain",
            backgroundPosition: "center",
          }}
        >
          <div className="flex flex-col w-full sm:w-[60%] lg:w-[396px] text-white text-left sm:text-right sm:ml-auto relative z-10">
            <div className="text-[20px] sm:text-[24px] lg:text-[28px] font-bold leading-tight sm:leading-[39px] mb-2 sm:mb-0">
              Daily, Weekly, and Monthly Mood Tracking
            </div>
            <div className="text-[16px] sm:text-[18px] leading-[20px] sm:leading-[25px]">
              Track your emotions effortlessly and view insightful trends to
              gain a better perspective on your well-being.
            </div>
          </div>
          <div className="relative w-full h-[200px] sm:h-[300px] mt-4 sm:mt-0">
            <Image
              src="/landing/mood-treacker.png"
              width={870}
              height={712}
              alt="mood tracker"
              className="absolute -bottom-[50px] -left-[50px] sm:-bottom-[200px] sm:-left-[100px] lg:-bottom-[300px] w-[120%] h-auto object-contain"
            />
          </div>
        </div>

        {/* Card 4 */}
        <div
          className="bg-[rgba(7,57,95,0.40)] border-[0.3px] border-solid border-[#064476] rounded-[16px] sm:rounded-[24px] col-span-1 px-[20px] sm:px-[30px] py-[20px] flex flex-col relative overflow-hidden min-h-[300px] sm:min-h-[415px]"
          style={{
            background: `linear-gradient(rgba(0,84,133,0.30), rgba(7,57,95,0.40)), url('/landing/faq-shape.png')`,
            backgroundSize: "contain",
            backgroundPosition: "center",
          }}
        >
          <div className="text-white text-[20px] sm:text-[24px] lg:text-[28px] font-bold leading-tight sm:leading-[39px] mb-[8px] sm:mb-[16px] relative z-10">
            Relaxing Breathing Exercise
          </div>
          <div className="text-white text-[16px] sm:text-[18px] leading-[20px] sm:leading-[25px] relative z-10">
            A dedicated space to practice tailored breathing exercises, helping
            you achieve calm and focus anytime you need.
          </div>
          <div className="relative w-full h-[200px] sm:h-[250px] mt-auto">
            <Image
              src="/landing/breathing-tech.png"
              width={525}
              height={465}
              alt="breathing"
              className="absolute -bottom-[50px] left-0 sm:-bottom-[100px] sm:left-[5px] lg:-bottom-[150px] w-[100%] h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridCard;
