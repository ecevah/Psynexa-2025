"use client";
import React, { useState } from "react";
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Menü açıldığında sayfa kaydırmayı engelle
    if (!isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
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
        data-aos="fade-up"
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

        {/* Fullscreen Mobile Menu */}
        <div
          className={`fixed top-0 left-0 w-full h-full bg-[#121212] z-50 transition-transform duration-300 md:hidden ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } flex flex-col p-5`}
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
                className="text-left text-white py-4 text-2xl font-medium hover:text-gray-300"
                onClick={() => {
                  toggleMenu();
                  // Ana sayfa yönlendirmesi
                }}
              >
                {t("header.home")}
              </button>

              <button
                className="text-left text-white py-4 text-2xl font-medium hover:text-gray-300"
                onClick={() => {
                  toggleMenu();
                  // About yönlendirmesi
                }}
              >
                {t("header.about")}
              </button>

              <button
                className="text-left text-white py-4 text-2xl font-medium hover:text-gray-300"
                onClick={() => {
                  toggleMenu();
                  // Solutions yönlendirmesi
                }}
              >
                {t("header.solutions")}
              </button>

              <button
                className="text-left text-white py-4 text-2xl font-medium hover:text-gray-300"
                onClick={() => {
                  toggleMenu();
                  // FAQ yönlendirmesi
                }}
              >
                {t("header.faq")}
              </button>

              <button
                className="text-left text-white py-4 text-2xl font-medium hover:text-gray-300"
                onClick={() => {
                  toggleMenu();
                  // Contact yönlendirmesi
                }}
              >
                {t("header.contact")}
              </button>
            </div>

            {/* Secondary navigation */}
            <div className="flex flex-col py-4 border-t border-gray-700">
              <button
                className="text-left text-white py-3 text-lg font-medium hover:text-gray-300"
                onClick={toggleMenu}
              >
                Help Center
              </button>

              <button
                className="text-left text-white py-3 text-lg font-medium hover:text-gray-300"
                onClick={toggleMenu}
              >
                Terms and Conditions
              </button>

              <button
                className="text-left text-white py-3 text-lg font-medium hover:text-gray-300"
                onClick={toggleMenu}
              >
                Privacy Policy
              </button>
            </div>

            {/* App store buttons */}
            <div className="flex space-x-4 py-6">
              <button className="bg-black text-white border border-white rounded-lg px-4 py-2 flex items-center">
                <svg
                  className="w-6 h-6 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.6 6.4c-1.5 0-2.6.7-3.4 1.8-.7-1.1-1.9-1.8-3.4-1.8-2.1 0-3.8 1.7-3.8 3.8 0 3.2 3.8 6.4 7.2 9.1 3.4-2.7 7.2-5.9 7.2-9.1 0-2.1-1.7-3.8-3.8-3.8z" />
                </svg>
                App Store
              </button>
              <button className="bg-black text-white border border-white rounded-lg px-4 py-2 flex items-center">
                <svg
                  className="w-6 h-6 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3 3v18l18-9L3 3zm11 8.5l-6.8 3.8 6.8-3.8z" />
                </svg>
                Play Store
              </button>
            </div>

            {/* Bottom bar with social media and language switcher */}
            <div className="mt-auto border-t border-gray-700 pt-6 pb-4">
              <div className="flex justify-between items-center">
                {/* Social media icons */}
                <div className="flex space-x-4">
                  <a href="#" className="text-white hover:text-gray-300">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-white hover:text-gray-300">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a href="#" className="text-white hover:text-gray-300">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a href="#" className="text-white hover:text-gray-300">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a href="#" className="text-white hover:text-gray-300">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.02 1.06.05 2.07.15 3.12.11 1.54.39 3.05.92 4.51.54 1.46 1.34 2.79 2.37 3.92.67.71 1.43 1.34 2.25 1.87.27.16.54.29.81.42.04.01.05.02.04.06-.28 1.11-.68 2.21-1.11 3.34-.17-.07-.36-.14-.53-.23-1.71-.97-3.06-2.4-4.11-4.07-.45-.7-.84-1.45-1.16-2.22.01 1.81.01 3.61.01 5.42.01 1.81.01 3.58.02 5.34-1.84 0-3.63-.01-5.42-.01.01-3.81.01-7.63.01-11.44v-9.42c.12-.08.23-.02.34-.03l1.53.01m-5.5 3.47c.11-.24.37-.44.64-.44h1.68c.64 0 1.29-.01 1.99.01.07 5.04 0 10.08.04 15.22-1.9 0-3.68.01-5.42-.01 0-1.83.01-3.588.01-5.34 0-3.15-.01-6.24.01-9.33l.02-.05.03-.06z" />
                    </svg>
                  </a>
                  <a href="#" className="text-white hover:text-gray-300">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                </div>

                {/* Language switcher */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => switchLanguage("tr")}
                    className={`px-3 py-1 rounded-md ${
                      locale === "tr"
                        ? "bg-white text-black"
                        : "text-white border border-white"
                    }`}
                  >
                    TR
                  </button>
                  <button
                    onClick={() => switchLanguage("en")}
                    className={`px-3 py-1 rounded-md ${
                      locale === "en"
                        ? "bg-white text-black"
                        : "text-white border border-white"
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
