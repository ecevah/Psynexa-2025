import React from "react";

const TextCard = ({ circle, title, description, isHero = false }) => {
  return (
    <>
      <div className="w-full flex flex-col items-center mt-[72px] relative z-20">
        {isHero && (
          <div className="absolute w-[667px] h-[667px] rounded-full bg-[rgba(135,199,248,0.55)] blur-[200px] -bottom-[300px] -left-[330px]"></div>
        )}
        <div className="px-[24px] py-[8px] rounded-full bg-[#ffffff1f] text-white text-[17px] ">
          {circle}
        </div>
        <div className="text-white min-[625px]:text-[62px] font-extrabold text-center min-[1000px]:max-w-[950px] mt-[24px] leading-[75px] mx-[25px] text-[32px] max-[625px]:leading-[40px] z-10">
          {title}
        </div>
        <div className="text-white text-[17px] text-center min-[800px]:max-w-[750px] mt-[24px] mx-[25px] max-[625px]:text-[16px] max-[625px]:leading-[24px] z-10">
          {description}
        </div>
      </div>
    </>
  );
};

export default TextCard;
