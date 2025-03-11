import React from "react";

const TextCard = () => {
  return (
    <>
      <div className="w-full flex flex-col items-center mt-[72px] relative">
        <div className="absolute w-[667px] h-[667px] rounded-full bg-[rgba(135,199,248,0.55)] blur-[200px] -bottom-[300px] -left-[330px]"></div>
        <div className="px-[24px] py-[8px] rounded-full bg-[#ffffff1f] text-white text-[17px]">
          Your personal friend
        </div>
        <div className="text-white min-[625px]:text-[62px] font-extrabold text-center min-[1000px]:max-w-[950px] mt-[24px] leading-[75px] mx-[25px] text-[32px] max-[625px]:leading-[40px]">
          A Bridge That Touches Your Mind And Opens To The Future
        </div>
        <div className="text-white text-[17px] text-center min-[800px]:max-w-[750px] mt-[24px] mx-[25px] max-[625px]:text-[16px] max-[625px]:leading-[24px]">
          Journey into the depths of your mind with Psynexa. Meet each day in a
          more balanced and peaceful way with Nexabot's empathetic support and
          special suggestions for you.
        </div>
      </div>
    </>
  );
};

export default TextCard;
