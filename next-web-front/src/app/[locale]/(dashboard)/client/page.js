"use client";
import Breadcrumb from "@/components/call-center/breadcrumb/breadcrumb";
import HomeDropdown from "@/components/call-center/dropdown/home-dropdown";
import HeaderCircleIconButton from "@/components/call-center/header/circle-icon-button/header-circle-icon-button";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import ClientTable from "@/components/call-center/dashboard/client/client-table";
import ClientGrid from "@/components/call-center/dashboard/client/client-grid";
import Image from "next/image";

const ITEMS_PER_PAGE = 10;

const ClientPage = () => {
  const tTemplate = useTranslations("Template");
  const [selectedOption, setSelectedOption] = useState(tTemplate("allTime"));
  const [currentPage, setCurrentPage] = useState(1);
  const [isGridView, setIsGridView] = useState(false);

  // Örnek veri - Gerçek uygulamada API'den gelecek
  const clients = Array(50)
    .fill()
    .map((_, index) => ({
      id: index + 1,
      image: "/call-center/user-image.jpeg",
      name: `Client ${index + 1}`,
      age: 25 + (index % 20),
      recentVisit: "23 Oct 2024",
      phoneNumber: "+90 213 321 1223",
      email: `client${index + 1}@example.com`,
      birthday: "12 Oct 2024",
    }));

  const totalPages = Math.ceil(clients.length / ITEMS_PER_PAGE);
  const currentClients = clients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <div className="w-full h-[calc(100vh-96px)] flex flex-col">
        <div className="mt-[20px] mb-[16px] w-full flex flex-col items-start justify-between min-[580px]:flex-row min-[580px]:items-center">
          <Breadcrumb />
          <div className="flex flex-row items-center justify-between min-[580px]:justify-center max-[580px]:w-full max-[580px]:mt-[10px]">
            <HomeDropdown
              options={[
                { value: "thisMonth", label: tTemplate("allTime") },
                { value: "lastWeek", label: tTemplate("lastWeek") },
                { value: "lastMonth", label: tTemplate("lastMonth") },
                { value: "lastYear", label: tTemplate("lastYear") },
              ]}
              selected={selectedOption}
              onChange={(value) => setSelectedOption(value)}
              style={{ backgroundColor: "white" }}
            />
            <div className="flex flex-row">
              <HeaderCircleIconButton
                icon="/call-center/filter.svg"
                text="Filter"
                styleContainer={{ marginLeft: "16px", marginRight: "16px" }}
              />
              <HeaderCircleIconButton
                icon={
                  isGridView
                    ? "/call-center/rows.svg"
                    : "/call-center/aside-icon.svg"
                }
                text="Layout"
                func={() => {
                  setIsGridView(!isGridView);
                  console.log(
                    "Switching to",
                    isGridView ? "table" : "grid",
                    "view"
                  );
                }}
              />
            </div>
          </div>
        </div>

        <div className="overflow-hidden flex flex-col max-h-[calc(100vh-204px)] min-h-0">
          <div className="flex-1 overflow-hidden">
            {isGridView ? (
              <ClientGrid clients={currentClients} />
            ) : (
              <ClientTable clients={currentClients} />
            )}
          </div>

          <div className="flex justify-center items-center py-2 px-2">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-[32px] h-[32px] flex items-center justify-center rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E0E4E8] transition-colors"
              >
                <Image
                  src="/call-center/arrow-down-grey.svg"
                  alt="Previous"
                  width={16}
                  height={16}
                  className="transform rotate-90"
                />
              </button>

              <div className="flex items-center text-[#B0B0B0] text-[18px] leading-[32px] border-[0.5px] border-[#B0B0B0] border-solid rounded-full px-[12px] py-[4px]">
                <span className="text-[#0B1215]">{currentPage}</span>
                <span className="mx-1">/</span>
                <span>{totalPages}</span>
              </div>

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="w-[32px] h-[32px] flex items-center justify-center rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E0E4E8] transition-colors"
              >
                <Image
                  src="/call-center/arrow-down-grey.svg"
                  alt="Next"
                  width={16}
                  height={16}
                  className="transform -rotate-90"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientPage;
