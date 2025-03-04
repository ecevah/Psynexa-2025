import React from "react";
import { useSelector } from "react-redux";
import { Line } from "react-chartjs-2";
import { selectLineData } from "@/store/features/emotionTrackingSlice";
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
  const data = useSelector(selectLineData);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          padding: 10,
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
      },
    },
    layout: {
      padding: {
        left: 5,
        right: 5,
        top: 10,
        bottom: 5,
      },
    },
  };

  return (
    <div className="w-full h-[270px] min-w-0 overflow-hidden">
      <Line options={options} data={data} />
    </div>
  );
};

export default EmotionTrackingLine;
