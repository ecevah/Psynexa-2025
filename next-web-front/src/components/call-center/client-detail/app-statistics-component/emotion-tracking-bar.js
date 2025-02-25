import React from "react";
import { Bar } from "react-chartjs-2";
import { useTranslations } from "next-intl";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EmotionTrackingBar = () => {
  const t = useTranslations("EmotionTracking");

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        stacked: true,
        ticks: {
          stepSize: 10,
          color: "#9D9D9D",
          font: {
            size: 12,
          },
        },
        grid: {
          color: "#F5F6FA",
        },
      },
      x: {
        stacked: true,
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
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#FFF",
        titleColor: "#000",
        bodyColor: "#000",
        padding: 12,
        titleFont: {
          size: 14,
          family: "Urbanist",
        },
        bodyFont: {
          size: 13,
          family: "Urbanist",
        },
        borderWidth: 1,
        borderColor: "rgba(157, 157, 157, 0.15)",
        borderRadius: 20,
        boxShadow: "0px 1px 6px 0px rgba(157, 157, 157, 0.15)",
        callbacks: {
          title: function (context) {
            return context[0].label;
          },
          label: function (context) {
            const datasetIndex = context.datasetIndex;
            const value = context.raw;
            const ranges = ["0-25", "26-50", "51-75", "76-100"];
            return `${ranges[datasetIndex]}: ${value}%`;
          },
        },
      },
    },
    onHover: (event, chartElement) => {
      if (event.native) {
        event.native.target.style.cursor = chartElement[0]
          ? "pointer"
          : "default";
      }
    },
  };

  const totalValue = 100;
  const partValue = totalValue / 4; // Her bar 4 parçaya bölünecek

  const data = {
    labels: ["Happy", "Angry", "Sad", "Depressed", "Overenjoyed"],
    datasets: [
      // İlk çeyrek
      {
        data: [partValue, partValue, partValue, partValue, partValue],
        backgroundColor: [
          "#FEE278", // Happy
          "#FE7575", // Angry
          "#64C6EA", // Sad
          "#C179FF", // Depressed
          "#AFF06E", // Overenjoyed
        ],
        borderRadius: 0,
        barPercentage: 0.5,
        categoryPercentage: 0.8,
      },
      // İkinci çeyrek
      {
        data: [partValue, partValue, partValue, partValue, partValue],
        backgroundColor: [
          "#FDBE2A", // Happy
          "#FD5353", // Angry
          "#45B3E0", // Sad
          "#A95FEA", // Depressed
          "#9CDF57", // Overenjoyed
        ],
        borderRadius: 0,
        barPercentage: 0.5,
        categoryPercentage: 0.8,
      },
      // Üçüncü çeyrek
      {
        data: [partValue, partValue, partValue, partValue, partValue],
        backgroundColor: [
          "#FCA311", // Happy
          "#FC3A3A", // Angry
          "#289ECF", // Sad
          "#8F47D4", // Depressed
          "#83C847", // Overenjoyed
        ],
        borderRadius: 0,
        barPercentage: 0.5,
        categoryPercentage: 0.8,
      },
      // Dördüncü çeyrek (en üst)
      {
        data: [partValue, partValue, partValue, partValue, partValue],
        backgroundColor: [
          "#F57C00", // Happy
          "#E82929", // Angry
          "#157EB6", // Sad
          "#7533BF", // Depressed
          "#6AAD36", // Overenjoyed
        ],
        borderRadius: {
          topLeft: 20,
          topRight: 20,
        },
        barPercentage: 0.5,
        categoryPercentage: 0.8,
      },
    ],
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full h-[250px]">
        <Bar options={options} data={data} />
      </div>
      <div className="flex flex-wrap gap-8 justify-center">
        {data.labels.map((label, index) => (
          <div key={label} className="flex flex-col items-center gap-2 ">
            <img
              src={`/call-center/${label.toLowerCase()}.svg`}
              alt={label}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: data.datasets[0].backgroundColor[index],
                }}
              />
              <span className="text-[13px] font-medium leading-[24px] font-urbanist">
                {t(`emotions.${label.toLowerCase()}`)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmotionTrackingBar;
