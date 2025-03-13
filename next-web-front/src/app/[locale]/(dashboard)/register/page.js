"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslations } from "next-intl";

const RegisterPage = () => {
  const t = useTranslations("Auth");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    // Calculate password strength (0-4)
    let strength = 0;

    if (password.length > 0) strength += 1; // Has characters
    if (password.length >= 8) strength += 1; // Length check
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength += 1; // Has upper and lowercase
    if (/[0-9]/.test(password)) strength += 1; // Has number
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 1; // Has special char

    setPasswordStrength(strength);
  }, [password]);

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
        return "bg-gray-200";
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-orange-500";
      case 3:
        return "bg-yellow-500";
      case 4:
      case 5:
        return "bg-green-500";
      default:
        return "bg-gray-200";
    }
  };

  const getPasswordFeedback = () => {
    switch (passwordStrength) {
      case 0:
        return "";
      case 1:
        return t("password_too_weak");
      case 2:
        return t("password_could_be_stronger");
      case 3:
        return t("password_getting_better");
      case 4:
        return t("password_good");
      case 5:
        return t("password_great");
      default:
        return "";
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
        return "";
      case 1:
        return t("weak");
      case 2:
        return t("fair");
      case 3:
        return t("good");
      case 4:
        return t("strong");
      case 5:
        return t("strong");
      default:
        return "";
    }
  };

  return (
    <>
      <div className="flex flex-row justify-between w-[100vw] h-[100vh] p-0 m-0 bg-white overflow-y-auto">
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
            {t("already_have_account")}{" "}
            <span className="hover:text-blue-600 cursor-pointer">
              {t("sign_in")}
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
          <div className="max-w-[400px] w-full ">
            <h2 className="text-[24px] font-semibold mb-6 text-center">
              {t("signup_to_psynexa")}
            </h2>
            <button className="w-full flex items-center justify-center border border-[#DCDBDD] rounded-[12px] py-[18px] mb-4 hover:bg-gray-100">
              <Image
                src="/auth/google-icon.svg"
                alt="Google"
                width={20}
                height={20}
                className="mr-2"
              />
              {t("signup_with_google")}
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

            <div className="flex space-x-4 mb-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border border-[#DCDBDD] rounded-[12px] py-[22px] px-[14px] outline-none peer text-[14px] text-[#202020] font-medium leading-[14px]"
                />
                <label
                  htmlFor="email"
                  className={`absolute bg-white text-sm text-gray-500 duration-150 transform -translate-y-[25px] scale-75 top-4 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-[25px] peer-focus:scale-75 peer-focus:-translate-y-[25px] px-2 ${
                    firstName ? "scale-75 -translate-y-[25px]" : ""
                  }`}
                >
                  {t("first_name")}
                </label>
              </div>

              <div className="relative flex-1">
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border border-[#DCDBDD] rounded-[12px] py-[22px] px-[14px] outline-none peer text-[14px] text-[#202020] font-medium leading-[14px]"
                />
                <label
                  htmlFor="lastName"
                  className={`absolute bg-white text-sm text-gray-500 duration-150 transform -translate-y-[25px] scale-75 top-4 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-[25px] peer-focus:scale-75 peer-focus:-translate-y-[25px] px-2 ${
                    lastName ? "scale-75 -translate-y-[25px]" : ""
                  }`}
                >
                  {t("last_name")}
                </label>
              </div>
            </div>

            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[#DCDBDD] rounded-[12px] py-[22px] px-[14px] outline-none peer text-[14px] text-[#202020] font-medium leading-[14px]"
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
              {password.length > 0 && (
                <>
                  <div className="mt-2 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-600">
                      {getPasswordFeedback()}
                    </span>
                    <span className="text-xs text-gray-600">
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center mb-4">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="w-4 h-4 border border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <label htmlFor="terms" className="ml-2 text-xs text-gray-700">
                {t("terms_agreement")}{" "}
                <span className="text-science_blue-600">
                  {t("terms_of_use")}
                </span>{" "}
                {t("and")}{" "}
                <span className="text-science_blue-600">
                  {t("privacy_policy")}
                </span>
                .
              </label>
            </div>

            <button className="w-full bg-science_blue-600 text-white rounded-[12px] py-[18px] px-[58px] text-[16px] font-medium mb-6">
              {t("sign_up")}
            </button>

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

export default RegisterPage;
