"use client";
import React, { useState, useEffect } from "react";
import TabBar from "./tab-bar";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

const Header = () => {
  const t = useTranslations("HomePage");
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { locale } = params;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Move mobile menu to body when it's open
  useEffect(() => {
    // This effect ensures the mobile menu gets proper stacking context
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const switchLanguage = (newLocale) => {
    // En basit şekilde URL manipülasyonu
    const currentUrl = window.location.pathname;

    if (currentUrl === `/${locale}` || currentUrl === `/${locale}/`) {
      // Ana sayfadayız, sadece dili değiştirelim
      window.location.href = `/${newLocale}`;
    } else {
      // İç sayfadayız, URL'deki dil kodunu değiştirelim
      const newPath = currentUrl.replace(`/${locale}/`, `/${newLocale}/`);
      window.location.href = newPath;
    }
  };

  return (
    <>
      <div
        className="py-[20px] md:py-[32px] px-[20px] md:px-[72px] flex flex-row justify-between items-center relative"
        data-aos="fade-down"
      >
        <Image
          src="/landing/header-logo.svg"
          alt="logo"
          width={217}
          height={56}
          className="w-[150px] md:w-[217px] h-auto max-w-[217px] min-w-[120px]"
        />

        {/* Desktop Navigation */}
        <div className="hidden min-[925px]:block">
          <TabBar />
        </div>

        {/* Desktop Language Switcher */}
        <div className="hidden min-[925px]:block w-[217px] max-w-[217px] min-[1200px]:min-w-[217px]">
          <div className="px-[17.5px] py-[15px] relative group ml-auto rounded-full border-[0.4px] border-solid border-white w-fit cursor-pointer">
            <button
              className="flex items-center space-x-2 text-white hover:text-gray-200"
              aria-label={t("header.language")}
            >
              <span>{locale === "en" ? "EN" : "TR"}</span>
            </button>

            {/* Dropdown menu */}
            <div className="absolute hidden group-hover:block -right-[20px] mt-4 w-24 bg-white rounded-md shadow-lg z-50">
              <div className="py-1">
                <button
                  onClick={() => switchLanguage("en")}
                  className={`w-full px-4 py-2 text-sm text-center ${
                    locale === "en"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => switchLanguage("tr")}
                  className={`w-full px-4 py-2 text-sm text-center ${
                    locale === "tr"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Türkçe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="min-[925px]:hidden flex flex-col justify-center items-center w-8 h-8 rounded-md"
          onClick={toggleMenu}
          aria-label="Menu"
        >
          <span
            className={`block w-6 h-0.5 bg-white mb-1.5 transition-transform duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-white mb-1.5 transition-opacity duration-300 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${
              isMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Fullscreen Mobile Menu - Moved outside the main div for better stacking context */}
      <div
        className={`fixed top-0 left-0 w-full h-full z-[9999] transition-transform duration-300 min-[925px]:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col p-5`}
        style={{
          background:
            "radial-gradient(282.76% 179.3% at -11.35% 2.83%, #0A6EBD 0%, #053357 58%)",
        }}
      >
        {/* Top bar with close button */}
        <div className="flex justify-end w-full">
          <button
            onClick={toggleMenu}
            aria-label="Close Menu"
            className="text-white p-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col h-full">
          {/* Main navigation */}
          <div className="flex flex-col py-8">
            <button
              className="text-left text-white py-4 text-[28px] leading-[40px] hover:text-gray-300"
              onClick={() => {
                toggleMenu();
                const section = document.getElementById("hero-section");
                if (section) section.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {t("header.home")}
            </button>

            <button
              className="text-left text-white py-4 text-[28px] leading-[40px] hover:text-gray-300"
              onClick={() => {
                toggleMenu();
                const section = document.getElementById("about-section");
                if (section) section.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {t("header.about")}
            </button>

            <button
              className="text-left text-white py-4 text-[28px] leading-[40px] hover:text-gray-300"
              onClick={() => {
                toggleMenu();
                const section = document.getElementById("solutions-section");
                if (section) section.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {t("header.solutions")}
            </button>

            <button
              className="text-left text-white py-4 text-[28px] leading-[40px] hover:text-gray-300"
              onClick={() => {
                toggleMenu();
                const section = document.getElementById("faq-section");
                if (section) section.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {t("header.faq")}
            </button>

            <button
              className="text-left text-white py-4 text-[28px] leading-[40px] hover:text-gray-300"
              onClick={() => {
                toggleMenu();
                const section = document.getElementById("contact-section");
                if (section) section.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {t("header.contact")}
            </button>
          </div>

          {/* App store buttons */}
          <div className="flex flex-col space-y-4 w-fit">
            <button className=" text-white border border-white rounded-[20px] px-4 py-2 flex items-center">
              <Image
                src="/landing/apple-icon.svg"
                alt="Apple Icon"
                width={24}
                height={24}
                className="w-[20px] h-[20px] mr-2"
              />
              <Image
                src="/landing/apple-text.svg"
                alt="App Store"
                width={100}
                height={32}
                className="h-[18px] w-auto"
              />
            </button>
            <button className=" text-white border border-white rounded-[20px] px-4 py-2 flex items-center">
              <Image
                src="/landing/google-white.svg"
                alt="Google Icon"
                width={24}
                height={24}
                className="w-[20px] h-[20px] mr-2"
              />
              <Image
                src="/landing/google-text.svg"
                alt="Google Play"
                width={100}
                height={32}
                className="h-[18px] w-auto"
              />
            </button>
          </div>

          {/* Bottom bar with social media and language switcher */}
          <div className="mt-auto pt-6 pb-4">
            <div className="flex justify-between items-center ">
              {/* Language switcher */}
              <div className="px-[17.5px] py-[15px] relative group ml-auto rounded-full border-[0.4px] border-solid border-white w-fit cursor-pointer">
                <button
                  className="flex items-center space-x-2 text-white hover:text-gray-200"
                  aria-label={t("header.language")}
                  onClick={() => switchLanguage(locale === "en" ? "tr" : "en")}
                >
                  <span>{locale === "en" ? "EN" : "TR"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
