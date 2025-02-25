import React from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

const FilterPopup = ({ isOpen, onClose }) => {
  const t = useTranslations("AppStatistics.filterPopup");
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-start justify-end">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      <div className="relative mt-[80px] mr-[24px] w-[300px] bg-white rounded-[20px] shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-[#F5F6FA]">
          <h3 className="text-[16px] font-semibold text-[#0B1215]">
            {t("title")}
          </h3>
          <button onClick={onClose}>
            <Image
              src="/call-center/clarity_close-line.svg"
              alt="Close"
              width={16}
              height={16}
            />
          </button>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-[14px] font-medium text-[#0B1215] mb-2">
                {t("category")}
              </h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded text-primary_color_font_palette-600"
                  />
                  <span className="text-[14px] text-[#0B1215]">
                    {t("meditation")}
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded text-primary_color_font_palette-600"
                  />
                  <span className="text-[14px] text-[#0B1215]">
                    {t("breathing")}
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded text-primary_color_font_palette-600"
                  />
                  <span className="text-[14px] text-[#0B1215]">
                    {t("focus")}
                  </span>
                </label>
              </div>
            </div>
            <div>
              <h4 className="text-[14px] font-medium text-[#0B1215] mb-2">
                {t("duration")}
              </h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded text-primary_color_font_palette-600"
                  />
                  <span className="text-[14px] text-[#0B1215]">
                    0-15 {t("min")}
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded text-primary_color_font_palette-600"
                  />
                  <span className="text-[14px] text-[#0B1215]">
                    15-30 {t("min")}
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded text-primary_color_font_palette-600"
                  />
                  <span className="text-[14px] text-[#0B1215]">
                    30+ {t("min")}
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 rounded-full border border-[#E0E0E0] text-[14px] font-medium text-[#9D9D9D] hover:bg-[#F5F6FA]"
            >
              {t("reset")}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 rounded-full bg-primary_color_font_palette-600 text-white text-[14px] font-medium hover:bg-primary_color_font_palette-700"
            >
              {t("apply")}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default FilterPopup;
