import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

const FooterCard = () => {
  const t = useTranslations("HomePage.footer-card.footer-card");

  // Function to scroll to a specific section by ID
  const scrollToSection = (sectionId, e) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer
      className="w-full  py-10 md:py-16 px-6 sm:px-8 md:px-10 lg:px-20 relative overflow-hidden h-fit"
      id="contact-section"
    >
      <div className="absolute w-[1890px] h-[1890px] rounded-full bg-[rgba(135,199,248,0.25)] blur-[200px] -bottom-[1860px] -translate-x-1/4"></div>

      <div className="max-w-[1400px] mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-[154px]">
          {/* Column 1 - Logo & Description */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Image
              src="/landing/header-logo.svg"
              alt="Psynexa Logo"
              width={217.28}
              height={56}
              className="w-[180px] md:w-[217.28px] h-auto"
              data-aos="fade-up"
            />
            <p
              className="text-white font-urbanist text-[14px] font-normal leading-[26px] mt-[12px] opacity-80 max-w-[350px]"
              data-aos="fade-up"
            >
              {t("description")}
            </p>
          </div>

          {/* Column 2 - Menu */}
          <div className="flex flex-col">
            <h3
              className="text-white font-urbanist text-[18px] sm:text-[20px] font-light leading-[26px] mb-4"
              data-aos="fade-up"
            >
              {t("menu.title")}
            </h3>
            <ul className="flex flex-col gap-2 sm:gap-3">
              <li data-aos="fade-up">
                <Link
                  href="/"
                  onClick={(e) => scrollToSection("hero-section", e)}
                  className="text-white font-urbanist text-[16px] sm:text-[17px] font-medium leading-[26px] hover:opacity-70 transition-opacity cursor-pointer"
                >
                  {t("menu.home")}
                </Link>
              </li>
              <li data-aos="fade-up">
                <Link
                  href="/"
                  onClick={(e) => scrollToSection("about-section", e)}
                  className="text-white font-urbanist text-[16px] sm:text-[17px] font-medium leading-[26px] hover:opacity-70 transition-opacity cursor-pointer"
                >
                  {t("menu.about")}
                </Link>
              </li>
              <li data-aos="fade-up">
                <Link
                  href="/"
                  onClick={(e) => scrollToSection("solutions-section", e)}
                  className="text-white font-urbanist text-[16px] sm:text-[17px] font-medium leading-[26px] hover:opacity-70 transition-opacity cursor-pointer"
                >
                  {t("menu.solutions")}
                </Link>
              </li>
              <li data-aos="fade-up">
                <Link
                  href="/"
                  onClick={(e) => scrollToSection("faq-section", e)}
                  className="text-white font-urbanist text-[16px] sm:text-[17px] font-medium leading-[26px] hover:opacity-70 transition-opacity cursor-pointer"
                >
                  {t("menu.faq")}
                </Link>
              </li>
              <li data-aos="fade-up">
                <Link
                  href="/"
                  onClick={(e) => scrollToSection("contact-section", e)}
                  className="text-white font-urbanist text-[16px] sm:text-[17px] font-medium leading-[26px] hover:opacity-70 transition-opacity cursor-pointer"
                >
                  {t("menu.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Information */}
          <div className="flex flex-col">
            <h3
              className="text-white font-urbanist text-[18px] sm:text-[20px] font-light leading-[26px] mb-4"
              data-aos="fade-up"
            >
              {t("info.title")}
            </h3>
            <ul className="flex flex-col gap-2 sm:gap-3">
              <li data-aos="fade-up">
                <Link
                  href="/help"
                  className="text-white font-urbanist text-[16px] sm:text-[17px] font-medium leading-[26px] hover:opacity-70 transition-opacity"
                >
                  {t("info.help")}
                </Link>
              </li>
              <li data-aos="fade-up">
                <Link
                  href="/blog"
                  className="text-white font-urbanist text-[16px] sm:text-[17px] font-medium leading-[26px] hover:opacity-70 transition-opacity"
                >
                  {t("info.blog")}
                </Link>
              </li>
              <li data-aos="fade-up">
                <Link
                  href="/terms"
                  className="text-white font-urbanist text-[16px] sm:text-[17px] font-medium leading-[26px] hover:opacity-70 transition-opacity"
                >
                  {t("info.terms")}
                </Link>
              </li>
              <li data-aos="fade-up">
                <Link
                  href="/privacy"
                  className="text-white font-urbanist text-[16px] sm:text-[17px] font-medium leading-[26px] hover:opacity-70 transition-opacity"
                >
                  {t("info.privacy")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Get the App */}
          <div className="flex flex-col">
            <h3
              className="text-white font-urbanist text-[18px] sm:text-[20px] font-normal leading-[26px] mb-4"
              data-aos="fade-up"
            >
              {t("app-card.title")}
            </h3>
            <div className="flex flex-col gap-3 w-[187px]" data-aos="fade-up">
              {/* Apple Store Button */}
              <Link
                href="#"
                className="inline-flex px-4 sm:px-5 py-2 sm:py-3 items-center gap-2 sm:gap-3 rounded-[20px] border-2 border-white hover:bg-white/10 transition-colors"
              >
                <Image
                  src="/landing/apple-icon.svg"
                  alt="Apple Icon"
                  width={24}
                  height={24}
                  className="w-[18px] sm:w-[20px] h-[18px] sm:h-[20px]"
                />
                <Image
                  src="/landing/apple-text.svg"
                  alt="App Store"
                  width={100}
                  height={32}
                  className="h-[16px] min-h-[32px] sm:h-[18px] w-auto"
                />
              </Link>

              {/* Google Play Button */}
              <Link
                href="#"
                className="inline-flex px-4 sm:px-5 py-2 sm:py-3 items-center gap-2 sm:gap-3 rounded-[20px] border-2 border-white hover:bg-white/10 transition-colors"
              >
                <Image
                  src="/landing/google-white.svg"
                  alt="Google Icon"
                  width={24}
                  height={24}
                  className="w-[18px] sm:w-[20px] h-[18px] sm:h-[20px]"
                />
                <Image
                  src="/landing/google-text.svg"
                  alt="Google Play"
                  width={100}
                  height={32}
                  className="h-[32px] min-h-[32px] sm:h-[18px] w-auto"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright & Social Media Icons */}
        <div className="w-full mt-10 pt-6 flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-4">
          {/* Copyright Text - Left Side */}
          <p className="text-white/70 font-urbanist text-[17px] leading-[26px]">
            {t("copyright")}
          </p>

          {/* Social Media Icons - Right Side */}
          <div className="flex items-center gap-4">
            <Link
              href="https://x.com/psynexa"
              aria-label="X (Twitter)"
              target="_blank"
            >
              <Image
                src="/landing/x.svg"
                alt="X"
                width={24}
                height={24}
                className=""
              />
            </Link>
            <Link
              href="https://www.instagram.com/psynexa.us"
              aria-label="Instagram"
              target="_blank"
            >
              <Image
                src="/landing/instagram.svg"
                alt="Instagram"
                width={24}
                height={24}
                className=""
              />
            </Link>
            <Link
              href="https://www.linkedin.com/company/psynexa"
              aria-label="LinkedIn"
              target="_blank"
            >
              <Image
                src="/landing/linkedin.svg"
                alt="LinkedIn"
                width={24}
                height={24}
                className=""
              />
            </Link>
            <Link
              href="https://www.tiktok.com/@psynexa_tr"
              aria-label="TikTok"
              target="_blank"
            >
              <Image
                src="/landing/tiktok.svg"
                alt="TikTok"
                width={24}
                height={24}
                className=""
              />
            </Link>
            <Link
              href="https://www.youtube.com/@Psynexa"
              aria-label="YouTube"
              target="_blank"
            >
              <Image
                src="/landing/youtube.svg"
                alt="YouTube"
                width={24}
                height={24}
                className=""
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterCard;
