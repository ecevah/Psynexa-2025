"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import SidebarMenuButton from "./sidebar-menu-button";
import { useTranslations } from "next-intl";
import { useSelector, useDispatch } from "react-redux";
import { setNotification } from "@/store/features/notificationSlice";
import { usePathname, useParams } from "next/navigation";
import { useRouter } from "next/navigation";

const SidebarMenu = () => {
  const t = useTranslations("SidebarMenu");
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const notifications = useSelector((state) => state.notifications);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    dispatch(setNotification({ key: "dashboard", value: 3 }));
    dispatch(setNotification({ key: "clients", value: 5 }));
    dispatch(setNotification({ key: "bottom_support", value: 1 }));
  }, [dispatch]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const renderMenuContent = (isMobile = false) => (
    <>
      <div
        className={`${!isMobile ? "relative w-full flex justify-center" : ""}`}
      >
        <Image
          src={
            isCollapsed && !isMobile
              ? "/call-center/mini-sidebar-logo.svg"
              : "/call-center/full-sidebar-logo.svg"
          }
          alt="Psynexa"
          width={isCollapsed && !isMobile ? 30 : 147}
          height={isCollapsed && !isMobile ? 30 : 57}
          className={`transition-all duration-300 mb-[48px] ${
            isCollapsed && !isMobile ? "w-[30px]" : "w-[147px]"
          } ${isMobile ? "hidden" : ""}`}
        />
      </div>

      {Object.entries(t.raw("items")).map(([key, item]) => (
        <SidebarMenuButton
          key={key}
          icon={item.icon}
          text={item.text}
          isActive={pathname.includes(item.link)}
          func={() => {
            if (isMobileMenuOpen) setIsMobileMenuOpen(false);
            router.push(`/${params.locale}${item.link}`);
          }}
          notification={notifications[key]}
          isCollapsed={isCollapsed && !isMobile}
        />
      ))}

      <div className="mt-auto">
        {Object.entries(t.raw("bottom-items")).map(([key, item]) => (
          <SidebarMenuButton
            key={key}
            icon={item.icon}
            text={item.text}
            isActive={pathname.includes(item.link)}
            func={() => {
              if (isMobileMenuOpen) setIsMobileMenuOpen(false);
              router.push(`/${params.locale}${item.link}`);
            }}
            notification={notifications[`bottom_${key}`]}
            isCollapsed={isCollapsed && !isMobile}
          />
        ))}
      </div>
    </>
  );

  return (
    <>
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 rounded-lg"
        >
          <Image
            src="/call-center/mini-sidebar-logo.svg"
            alt="Menu"
            width={30}
            height={30}
          />
        </button>
      </div>

      <div
        onClick={() => setIsMobileMenuOpen(false)}
        className={`lg:hidden fixed inset-0 bg-black/50 transition-opacity duration-300 z-[100] ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`fixed inset-y-0 left-0 w-[280px] bg-white p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out z-[101] ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <Image
              src="/call-center/full-sidebar-logo.svg"
              alt="Psynexa"
              width={147}
              height={57}
            />
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
              <Image
                src="/call-center/clarity_close-line.svg"
                alt="Close"
                width={24}
                height={24}
              />
            </button>
          </div>
          {renderMenuContent(true)}
        </div>
      </div>

      <div
        className={`hidden fixed lg:flex flex-col h-[calc(100vh-48px)] py-[24px] px-[12px] rounded-[20px] bg-white transition-all duration-300 ease-in-out overflow-hidden ${
          isCollapsed ? "w-[80px]" : "w-[260px]"
        }`}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
      >
        {renderMenuContent(false)}
      </div>
      <div
        className={`hidden lg:block h-full transition-all duration-300 ease-in-out mr-[32px] ${
          !isCollapsed ? "w-[322px]" : "w-[80px]"
        }`}
      ></div>
    </>
  );
};

export default SidebarMenu;
