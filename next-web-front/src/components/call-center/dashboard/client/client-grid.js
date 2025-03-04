import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import HeaderCircleIconButton from "../../header/circle-icon-button/header-circle-icon-button";
import { useState } from "react";

const ClientGrid = ({ clients }) => {
  const t = useTranslations("ClientPage");
  const [hoveredId, setHoveredId] = useState(null);
  const locale = useLocale();

  return (
    <div className="w-full h-full overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 min-[890px]:grid-cols-3 min-[1300px]:grid-cols-4 min-[1570px]:grid-cols-5 gap-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-[#D0E8FC] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full">
      {clients.map((client) => (
        <div
          key={client.id}
          className="bg-white rounded-[20px] py-[12px] hover:bg-[#D0E8FC] transition-colors duration-200 cursor-pointer"
          onMouseEnter={() => setHoveredId(client.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="flex flex-col items-center mb-4">
            <Image
              src={client.image}
              alt={client.name}
              width={56}
              height={56}
              className="rounded-full min-w-[56px] min-h-[56px] max-w-[56px] max-h-[56px]"
            />
            <div>
              <div className="text-aside_menu-menu_list_itemm text-[24px] font-medium leading-[40px] text-center mt-1">
                {client.name}
              </div>
              <div className="text-aside_menu-menu_list_itemm text-[18px] leading-[14px] font-light text-center opacity-[0.6]">
                {client.age} years old
              </div>
            </div>
          </div>

          <div className="w-full h-[1px] bg-[#F2F2F2] mb-[12px]" />

          <div className="space-y-3 px-[16px]">
            <div className="flex flex-row justify-between items-center">
              <span className="text-[#B0B0B0] text-[14px] leading-[24px]">
                Recent Visit
              </span>
              <span className="text-aside_menu-menu_list_itemm text-[14px] font-medium leading-[24px] ">
                {client.recentVisit}
              </span>
            </div>

            <div className="flex flex-row justify-between items-center">
              <span className="text-[#B0B0B0] text-[14px] leading-[24px]">
                Phone Number
              </span>
              <span className="text-aside_menu-menu_list_itemm text-[14px] font-medium leading-[24px] ">
                {client.phoneNumber}
              </span>
            </div>

            <div className="flex flex-row justify-between items-center">
              <span className="text-[#B0B0B0] text-[14px] leading-[24px]">
                Email
              </span>
              <span className="text-aside_menu-menu_list_itemm text-[14px] font-medium leading-[24px] ">
                {client.email}
              </span>
            </div>

            <div className="flex flex-row justify-between items-center">
              <span className="text-[#B0B0B0] text-[14px] leading-[24px]">
                Birthday
              </span>
              <span className="text-aside_menu-menu_list_itemm text-[14px] font-medium leading-[24px] ">
                {client.birthday}
              </span>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-[40px]">
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-7 text-aside_menu-menu_list_itemm text-[14px] leading-[24px]">
                Statistics
              </div>
              <HeaderCircleIconButton
                icon="/call-center/analysis-icon.svg"
                text="Statistics"
                style={{
                  backgroundColor:
                    hoveredId === client.id ? "#FFFFFF" : "#E0F1FE",
                  transition: "background-color 0.2s",
                }}
                func={() => {
                  window.location.href = `/${locale}/client/${client.id}?tab=appStatistics`;
                }}
                labelIsVisible={false}
                isBig={false}
              />
            </div>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-7 text-aside_menu-menu_list_itemm text-[14px] leading-[24px]">
                Profile
              </div>
              <HeaderCircleIconButton
                icon="/call-center/arrow-down.svg"
                text="Profile"
                style={{
                  backgroundColor:
                    hoveredId === client.id ? "#FFFFFF" : "#E0F1FE",
                  rotate: "-90deg",
                  transition: "background-color 0.2s",
                }}
                func={() => {
                  window.location.href = `/${locale}/client/${client.id}?tab=userProfile`;
                }}
                labelIsVisible={false}
                isBig={false}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientGrid;
