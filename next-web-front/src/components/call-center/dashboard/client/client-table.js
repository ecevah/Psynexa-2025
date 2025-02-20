import Image from "next/image";
import { useTranslations } from "next-intl";
import HeaderCircleIconButton from "../../header/circle-icon-button/header-circle-icon-button";
import { useState } from "react";

const ClientTable = ({ clients }) => {
  const t = useTranslations("ClientPage");
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full">
        <div className="min-[1000px]:min-w-[840px] grid grid-cols-[1fr_100px] min-[500px]:grid-cols-[1.5fr_1fr_100px] min-[720px]:grid-cols-[1.5fr_1fr_0.8fr_100px] min-[900px]:grid-cols-[1.5fr_1fr_1.2fr_0.8fr_100px] min-[1000px]:grid-cols-[1.5fr_1fr_1fr_1.2fr_0.8fr_150px] lg:grid-cols-[1.5fr_1fr_1fr_1.2fr_0.8fr_200px] gap-6 px-4 py-3 sticky top-0 z-[50]">
          <div className="text-[#666] text-sm font-medium">
            {t.raw("table.patient")}
          </div>
          <div className="text-[#666] text-sm font-medium hidden min-[1000px]:flex">
            {t.raw("table.recentVisit")}
          </div>
          <div className="text-[#666] text-sm font-medium hidden min-[500px]:flex">
            {t.raw("table.phoneNumber")}
          </div>
          <div className="text-[#666] text-sm font-medium hidden min-[900px]:flex">
            {t.raw("table.email")}
          </div>
          <div className="text-[#666] text-sm font-medium hidden min-[720px]:flex">
            {t.raw("table.birthday")}
          </div>
          <div className="text-[#666] text-sm font-medium flex justify-end">
            <div className="flex gap-4 w-[140px] justify-between">
              <span>{t.raw("table.statistics")}</span>
              <span>{t.raw("table.profile")}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full overflow-y-auto min-h-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-[#D0E8FC] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full">
          {clients.map((client) => (
            <div
              key={client.id}
              className="min-[1000px]:min-w-[840px] grid grid-cols-[1fr_100px] min-[500px]:grid-cols-[1.5fr_1fr_100px] min-[720px]:grid-cols-[1.5fr_1fr_0.8fr_100px] min-[900px]:grid-cols-[1.5fr_1fr_1.2fr_0.8fr_100px] min-[1000px]:grid-cols-[1.5fr_1fr_1fr_1.2fr_0.8fr_150px] lg:grid-cols-[1.5fr_1fr_1fr_1.2fr_0.8fr_200px] gap-6 px-4 pt-2 pb-3 h-[76px] max-h-[76px] my-[6px] rounded-[20px] bg-white hover:bg-[#D0E8FC] transition-colors duration-200 cursor-pointer group"
              onMouseEnter={() => setHoveredId(client.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Image
                  src={client.image}
                  alt={client.name}
                  width={40}
                  height={40}
                  className="rounded-full min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px]"
                />
                <div className="min-w-0 overflow-hidden">
                  <div className="text-[#0B1215] text-sm font-medium truncate">
                    {client.name}
                  </div>
                  <div className="text-[#666] text-xs truncate">
                    {client.age} years old
                  </div>
                </div>
              </div>

              <div className="items-center text-[#0B1215] text-sm truncate hidden min-[1000px]:flex">
                {client.recentVisit}
              </div>

              <div className="items-center text-[#0B1215] text-sm truncate hidden min-[500px]:flex">
                {client.phoneNumber}
              </div>

              <div className="items-center text-[#0B1215] text-sm truncate hidden min-[900px]:flex">
                {client.email}
              </div>

              <div className="items-center text-[#0B1215] text-sm truncate hidden min-[720px]:flex">
                {client.birthday}
              </div>

              <div className="flex items-center justify-end">
                <div className="flex gap-4 w-[140px] justify-between">
                  <div className="rounded-full">
                    <HeaderCircleIconButton
                      icon="/call-center/analysis-icon.svg"
                      text="Statistics"
                      style={{
                        backgroundColor:
                          hoveredId === client.id ? "#FFFFFF" : "#E0F1FE",
                        transition: "background-color 0.2s",
                      }}
                      func={() => {
                        // Handle statistics click
                        console.log(
                          "Statistics clicked for client:",
                          client.id
                        );
                      }}
                    />
                  </div>
                  <div className="rounded-full">
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
                        // Handle profile click
                        console.log("Profile clicked for client:", client.id);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientTable;
