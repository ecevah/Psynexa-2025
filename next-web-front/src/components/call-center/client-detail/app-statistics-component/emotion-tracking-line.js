import React from "react";
import { Line } from "react-chartjs-2";
import { useTranslations } from "next-intl";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const EmotionTrackingLine = () => {
  const t = useTranslations("EmotionTracking");

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#9D9D9D",
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: "#F5F6FA",
        },
        ticks: {
          color: "#9D9D9D",
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        position: "nearest",
        backgroundColor: "white",
        titleColor: "#666666",
        titleFont: {
          size: 12,
        },
        bodyColor: "#333333",
        bodyFont: {
          size: 14,
          weight: "bold",
        },
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
            const emotions = ["Angry", "Happy", "Sad"];
            const colors = ["#FE7575", "#FEE278", "#67C4E5"];
            const index = context.datasetIndex;
            return `${emotions[index]}: ${context.parsed.y}%`;
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0,
        capBezierPoints: true,
        borderJoinStyle: "miter",
      },
      point: {
        radius: 8.287,
        borderWidth: 4,
        backgroundColor: "#FFF",
        hoverRadius: 8.287,
        hoverBorderWidth: 4,
        pointStyle: "circle",
      },
    },
  };

  const labels = [
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

  const data = {
    labels,
    datasets: [
      {
        data: [65, 45, 75, 35, 85, 55, 70, 60, 75, 65, 80, 70],
        borderColor: "#FE7575",
        borderWidth: 4,
        pointBorderColor: "#FE7575",
        pointBackgroundColor: "#FFF",
        fill: false,
        lineTension: 0,
      },
      {
        data: [45, 65, 45, 60, 55, 75, 50, 70, 60, 70, 65, 55],
        borderColor: "#FEE278",
        borderWidth: 4,
        pointBorderColor: "#FEE278",
        pointBackgroundColor: "#FFF",
        fill: false,
        lineTension: 0,
      },
      {
        data: [35, 55, 65, 45, 70, 45, 60, 50, 65, 55, 70, 60],
        borderColor: "#67C4E5",
        borderWidth: 4,
        pointBorderColor: "#67C4E5",
        pointBackgroundColor: "#FFF",
        fill: false,
        lineTension: 0,
      },
    ],
  };

  return (
    <div className="w-full h-full p-[24px] my-auto">
      <Line options={options} data={data} />
    </div>
  );
};

export default EmotionTrackingLine;
