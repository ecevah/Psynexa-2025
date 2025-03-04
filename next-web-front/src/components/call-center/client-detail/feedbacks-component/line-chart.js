import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { useTranslations } from "next-intl"; // Çeviri desteği eklendi
import { useSelector } from "react-redux";
import { selectChartData } from "@/store/features/feedbacksSlice";

// İlgili ChartJS elementlerini kaydediyoruz.
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ firstLineData, secondLineData, labels }) => {
  // "EmotionTracking" çeviri alanından ay bilgilerini alıyoruz
  const t = useTranslations("EmotionTracking");

  // Eğer labels props'u gelmemişse, çeviri dosyasındaki ay isimlerini kullanıyoruz.
  const defaultLabels = labels || [
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

  const chartData = useSelector(selectChartData);

  const data = {
    labels: defaultLabels,
    datasets: [
      {
        type: "line",
        label: "", // Legend'da gösterilmesin
        data: chartData.map((data) => data.positive),
        borderColor: "#45B369",
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: "#FFF",
        pointBorderColor: "#45B369",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        hoverBorderWidth: 0,
        hoverPointBorderWidth: 0,
      },
      {
        type: "line",
        label: "",
        data: chartData.map((data) => Math.abs(data.negative)),
        borderColor: "#EF4A00",
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: "#FFF",
        pointBorderColor: "#EF4A00",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        hoverBorderWidth: 0,
        hoverPointBorderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: true,
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          padding: 10,
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          autoSkipPadding: 10,
          font: { size: 11 },
          color: "#9D9D9D",
        },
      },
      y: {
        min: 0,
        max: 120,
        position: "left",
        grid: {
          color: "#F5F6FA",
          drawTicks: false,
        },
        border: {
          display: false,
          dash: [4, 4],
        },
        ticks: {
          padding: 15,
          align: "center",
          crossAlign: "far",
          color: "#9D9D9D",
          font: { size: 12, weight: 500 },
          callback: function (value) {
            return value === 0
              ? "0"
              : value === 10
              ? "0-10"
              : value === 40
              ? "10-40"
              : value === 80
              ? "40-80"
              : value === 120
              ? "80-120"
              : "";
          },
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        position: "nearest",
        backgroundColor: "white",
        titleColor: "#666666",
        titleFont: { size: 12 },
        bodyColor: "#333333",
        bodyFont: { size: 14, weight: "bold" },
        padding: 12,
        displayColors: true,
        borderColor: "#E5E5E5",
        borderWidth: 1,
        boxWidth: 8,
        boxHeight: 8,
        boxPadding: 4,
        boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.5)",
        borderRadius: 20,
        usePointStyle: true,
        pointStyle: "circle",
        callbacks: {
          title: (context) => context[0].label,
          label: (context) => {
            let label = context.dataset.label || "";
            if (label) {
              label = context.datasetIndex === 0 ? "Positive" : "Negative";
            }
            return `${label}: ${context.parsed.y}%`;
          },
        },
      },
    },
    layout: { padding: { left: 5, right: 5, top: 10, bottom: 5 } },
  };

  return (
    <div className="flex mt-4 relative z-0">
      <div className="flex-1 relative chart-area" style={{ height: "400px" }}>
        <div className="absolute inset-0 flex flex-col justify-between">
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="border-b border-[#F5F6FA]"
                style={{ height: "80px" }}
              />
            ))}
        </div>
        <div className="absolute inset-0">
          <Chart type="line" data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default LineChart;
