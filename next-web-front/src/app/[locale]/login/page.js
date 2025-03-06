"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslations } from "next-intl";

const LoginPage = () => {
  const t = useTranslations("Auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  useEffect(() => {
    // Validate password: must have uppercase, lowercase, number, and special character
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      password
    );

    setIsPasswordValid(
      hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar &&
        password.length >= 8
    );
  }, [password]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="flex flex-row justify-between w-[100vw] h-[100vh] p-0 m-0">
        <div className="min-[775px]:flex hidden flex-col items-center justify-center w-[35%] h-full relative min-[1135px]:px-[64px] px-[50px] py-[27px]">
          <div className="flex flex-col w-full h-full relative z-10 justify-between">
            <div className="flex flex-col w-full">
              <Image
                src="/auth/logo-white.svg"
                alt="logo"
                width={143}
                height={38}
                className="mb-[100px]"
              />
              <p className="text-white min-[1024px]:text-[36px] text-[30px] font-medium leading-[48px]">
                {t("hero_text")}
              </p>
            </div>
            <p className="text-white text-[14px] font-medium mb-[100px]">
              {t("having_troubles")}{" "}
              <span className="underline cursor-pointer">{t("get_help")}</span>
            </p>
          </div>
          <Image
            src="/auth/login-bg.svg"
            alt="background"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            className="absolute"
          />
        </div>
        <div className="w-full h-full flex flex-col items-center justify-around px-[48px] bg-white">
          <p className="text-[#202020] text-[14px] font-medium ml-auto max-[775px]:my-[50px]">
            New user?{" "}
            <span className="hover:text-blue-600 cursor-pointer">
              {t("create_account")}
            </span>
          </p>
          <div className="min-[775px]:hidden flex flex-col">
            <Image
              src="/auth/logo-blue.svg"
              alt="logo"
              width={143}
              height={38}
              className="mb-[50px]"
            />
            <p className="text-science_blue-600 text-[28px] font-medium leading-[32px] mb-[80px]">
              {t("hero_text")}
            </p>
          </div>
          <div className="max-w-[400px] w-full">
            <h2 className="text-[24px] font-semibold mb-6 text-center">
              {t("signin_to_psynexa")}
            </h2>

            <button className="w-full flex items-center justify-center border border-[#DCDBDD] rounded-[12px] py-[18px] mb-4 hover:bg-gray-100">
              <Image
                src="/auth/google-icon.svg"
                alt="Google"
                width={20}
                height={20}
                className="mr-2"
              />
              {t("signin_with_google")}
            </button>

            <div className="flex items-center my-[32px]">
              <div className="flex-grow border-t border-[#DCDBDD]"></div>
              <span className="mx-3 text-[#84818A] text-[14px]">{t("or")}</span>
              <div className="flex-grow border-t border-[#DCDBDD]"></div>
            </div>

            <div className="relative mb-4">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#DCDBDD] rounded-[12px] py-[22px] px-[14px] outline-none peer text-[14px] text-[#202020] font-medium leading-[14px]"
              />
              <label
                htmlFor="email"
                className={`absolute bg-white text-sm text-gray-500 duration-150 transform -translate-y-[25px] scale-75 top-4 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-[25px] peer-focus:scale-75 peer-focus:-translate-y-[25px] px-2 ${
                  email ? "scale-75 -translate-y-[25px]" : ""
                }`}
              >
                {t("email_address")}
              </label>
            </div>

            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full border border-[#DCDBDD] rounded-[12px] py-[22px] px-[14px] outline-none peer text-[14px] text-[#202020] font-medium leading-[14px] ${
                  isPasswordValid
                    ? "border-[#009580]"
                    : password
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <label
                htmlFor="password"
                className={`absolute bg-white text-sm text-gray-500 duration-150 transform -translate-y-[25px] scale-75 top-4 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-[25px] peer-focus:scale-75 peer-focus:-translate-y-[25px] px-2 ${
                  password ? "scale-75 -translate-y-[25px]" : ""
                }`}
              >
                {t("password")}
              </label>
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-6 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-500" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {password && !isPasswordValid && (
                <p className="text-xs text-red-500 mt-1">
                  {t("password_requirements")}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-[#47464A] cursor-pointer">
                {t("forgot_password")}
              </span>
              <button className="bg-science_blue-600 text-white rounded-[12px] py-[18px] px-[58px] text-[16px] font-medium">
                {t("sign_in")}
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-[100px] pb-[15px]">
              {t("protected_by_recaptcha")}{" "}
              <span className="text-science_blue-400">
                {t("privacy_policy")}
              </span>{" "}
              {t("and")}{" "}
              <span className="text-science_blue-400">
                {t("terms_of_service")}
              </span>
              .
            </p>
          </div>
          <div className="h-[1px]"></div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
