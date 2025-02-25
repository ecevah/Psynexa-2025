import Image from "next/image";
import React from "react";

const LoginPage = () => {
  return (
    <>
      <div className="flex flex-row justify-between w-[100vw] h-[100vh] p-0 m-0">
        <div className="flex flex-col items-center justify-center w-[35%] h-full relative px-[64px]">
          <div className="flex flex-col w-full">
            <Image
              src="/auth/logo-white.svg"
              alt="logo"
              width={143}
              height={38}
            />
            <p className="text-white text-[24px] font-medium"></p>
          </div>
          <Image
            src="/auth/login-bg.svg"
            alt="login-bg"
            fill
            className="object-cover absolute top-0 left-0"
          />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
