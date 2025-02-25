import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { useTranslations } from "next-intl";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TimeScaleChart = ({ lineData, greenBarData, blueBarData }) => {
  const t = useTranslations("Template");

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: true,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          padding: 10,
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          autoSkipPadding: 10,
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: "#E5E5E5",
        },
        ticks: {
          padding: 10,
          font: {
            size: 11,
          },
        },
        border: {
          dash: [4, 4],
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
          title: (context) => {
            return context[0].label;
          },
          label: (context) => {
            if (context.dataset.type === "line") {
              return null;
            }
            let label = context.dataset.label || "";
            if (label) {
              label = label === "Dataset 1" ? "Completed" : "In Progress";
            }
            return `${label}: ${context.parsed.y}`;
          },
        },
      },
      centerTextPlugin: false,
    },
    layout: {
      padding: {
        left: 5,
        right: 5,
        top: 10,
        bottom: 5,
      },
    },
    barPercentage: 0.8,
    categoryPercentage: 0.7,
  };

  const labels = [
    t("january"),
    t("february"),
    t("march"),
    t("april"),
    t("may"),
    t("june"),
    t("july"),
    t("august"),
    t("september"),
    t("october"),
    t("november"),
    t("december"),
  ];

  const data = {
    labels,
    datasets: [
      {
        type: "line",
        data: lineData,
        borderColor: "#0A6EBD",
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: "#FFFFFF",
        pointBorderColor: "#0A6EBD",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        z: 10,
        showLine: true,
        label: "Trend",
        hoverBorderWidth: 0,
        pointHoverBorderWidth: 0,
      },
      {
        type: "bar",
        label: "Dataset 1",
        data: greenBarData,
        backgroundColor: "#A1DC67",
        borderRadius: {
          topLeft: 10,
          topRight: 10,
        },
        barThickness: 8,
      },
      {
        type: "bar",
        label: "Dataset 2",
        data: blueBarData,
        backgroundColor: "#0A6EBD",
        borderRadius: {
          topLeft: 10,
          topRight: 10,
        },
        barThickness: 8,
      },
    ],
  };

  return (
    <div className="w-full h-full max-h-[270px] min-w-0 overflow-hidden">
      <Chart type="bar" options={options} data={data} />
    </div>
  );
};

export default TimeScaleChart;
