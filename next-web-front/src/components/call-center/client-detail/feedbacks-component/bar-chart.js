import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

const BarChart = ({ data }) => {
  const [mounted, setMounted] = useState(false);
  const [tooltip, setTooltip] = useState({
    show: false,
    x: 0,
    y: 0,
    title: "",
    content: "",
    color: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = useTranslations("EmotionTracking");

  const months = [
    t("months.jan"),
    t("months.feb"),
    t("months.mar"),
    t("months.apr"),
    t("months.may"),
    t("months.jun"),
    t("months.jul"),
    t("months.aug"),
    t("months.sep"),
    t("months.oct"),
    t("months.nov"),
    t("months.dec"),
  ];

  const yAxisLabels = [
    "80-120",
    "40-80",
    "10-40",
    "0-10",
    "0",
    "0-10",
    "10-40",
    "40-80",
    "80-120",
  ];

  const getBarHeight = (value) => {
    const absValue = Math.abs(value);
    const maxValue = 120;
    const height = (absValue / maxValue) * 100;
    return `${height}%`;
  };

  const handleMouseMove = (e, monthData, isPositive, monthIndex) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const chartRect = e.currentTarget
      .closest(".chart-area")
      .getBoundingClientRect();

    // Mouse'un chart içindeki pozisyonu
    const mouseX = e.clientX - chartRect.left;
    const mouseY = e.clientY - chartRect.top;

    const value = isPositive ? monthData.positive : monthData.negative;
    const type = isPositive ? "Positive" : "Negative";
    const color = isPositive ? "#45B369" : "#EF4A00";

    setTooltip({
      show: true,
      x: mouseX + 20, // Mouse'un 20px sağında
      y: mouseY, // Mouse ile aynı yükseklikte
      title: `${months[monthIndex]} 2024`,
      content: `${type}: ${Math.abs(value)}%`,
      color,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, x: 0, y: 0, title: "", content: "", color: "" });
  };

  return (
    <div className="flex relative z-0 p-4 events-container">
      {/* Y-axis labels */}
      <div
        className="flex flex-col justify-between pr-2 text-[12px] text-[#9D9D9D] font-medium"
        style={{ height: "400px" }}
      >
        {yAxisLabels.map((label, index) => (
          <div
            key={index}
            style={{ height: "44px", display: "flex", alignItems: "center" }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Chart area */}
      <div className="flex-1 relative chart-area" style={{ height: "400px" }}>
        {/* Horizontal grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {Array(9)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="border-b border-[#F5F6FA]"
                style={{ height: "44px" }}
              />
            ))}
        </div>

        {/* Bars */}
        <div className="absolute inset-0 flex justify-between items-center ">
          {data.map((monthData, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-center gap-1"
              style={{ height: "100%", width: "16px" }}
            >
              {/* Positive bar */}
              <div className="w-full relative" style={{ height: "43%" }}>
                <div
                  className="absolute bottom-0 w-full rounded-[10px] bg-[#45B369] cursor-pointer"
                  style={{
                    height: mounted ? getBarHeight(monthData.positive) : "0%",
                    transition: "height 1s ease-out",
                  }}
                  onMouseMove={(e) =>
                    handleMouseMove(e, monthData, true, index)
                  }
                  onMouseLeave={handleMouseLeave}
                />
              </div>
              {/* Negative bar */}
              <div className="w-full relative" style={{ height: "44%" }}>
                <div
                  className="absolute top-0 w-full rounded-[10px] bg-[#EF4A00] cursor-pointer"
                  style={{
                    height: mounted ? getBarHeight(monthData.negative) : "0%",
                    transition: "height 1s ease-out",
                  }}
                  onMouseMove={(e) =>
                    handleMouseMove(e, monthData, false, index)
                  }
                  onMouseLeave={handleMouseLeave}
                />
              </div>
            </div>
          ))}
        </div>

        {/* X-axis labels */}
        <div className="absolute bottom-[-24px] left-0 right-0 flex justify-between ">
          {months.map((month, index) => (
            <div key={index} className="text-[12px] text-[#9D9D9D] font-medium">
              {month.substring(0, 3)}
            </div>
          ))}
        </div>

        {/* Custom Tooltip */}
        {tooltip.show && (
          <div
            className="absolute pointer-events-none bg-white px-4 py-3 rounded-[20px] shadow-lg border border-[#E5E5E5] z-50 min-w-[140px]"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
              transform: "translate(0, -50%)", // Sadece dikey eksende ortalama
            }}
          >
            <div className="text-[12px] text-[#666666] mb-1">
              {tooltip.title}
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: tooltip.color }}
              />
              <div className="text-[14px] font-bold text-[#333333]">
                {tooltip.content}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarChart;
