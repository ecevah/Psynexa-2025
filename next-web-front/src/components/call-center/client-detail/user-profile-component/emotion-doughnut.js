import React from "react";
import { useSelector } from "react-redux";
import { Chart as ChartJS, ArcElement, Legend } from "chart.js";
import { Chart } from "react-chartjs-2";
import { useTranslations } from "next-intl";
import { selectEmotionData } from "@/store/features/emotionDoughnutSlice";

// Emotion chart için özel plugin
const emotionTextPlugin = {
  id: "emotionTextPlugin",
  afterDraw: (chart, args, options) => {
    const { ctx } = chart;
    const dataset = chart.data.datasets[0];
    const meta = chart.getDatasetMeta(0);

    meta.data.forEach((arc, index) => {
      const midAngle = (arc.startAngle + arc.endAngle) / 2;
      const radius = arc.outerRadius * 0.85;

      const x = arc.x + radius * Math.cos(midAngle);
      const y = arc.y + radius * Math.sin(midAngle);

      ctx.save();

      // Rotasyonu kaldırdık
      ctx.fillStyle = "#FFF"; // Yazı rengini beyaz yaptık
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const text = dataset.data[index] + "%";
      ctx.fillText(text, x, y);
      ctx.restore();
    });
  },
};

ChartJS.register(ArcElement, Legend, emotionTextPlugin);

const EmotionDoughnut = () => {
  const t = useTranslations("EmotionTracking.emotions");
  const emotions = useSelector(selectEmotionData);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      emotionTextPlugin: true,
      centerTextPlugin: false,
    },
    animation: {
      animateScale: false,
      animateRotate: true,
    },
    hover: {
      mode: null,
      intersect: false,
      animationDuration: 0,
    },
    elements: {
      arc: {
        hover: {
          borderWidth: 0,
          offset: 0,
        },
      },
    },
  };

  const emotionLabels = ["angry", "happy", "depressed", "sad", "overenjoyed"];
  const emotionColors = ["#FE7575", "#FEE278", "#C179FF", "#64C6EA", "#A1DC67"];

  const data = {
    labels: emotionLabels.map((emotion) => t(emotion)),
    datasets: [
      {
        data: emotionLabels.map((emotion) => emotions[emotion]),
        backgroundColor: emotionColors,
        borderWidth: 0,
        borderRadius: 5,
        spacing: 10,
        hoverOffset: 0,
        hoverBorderWidth: 0,
      },
    ],
  };

  return (
    <div className="w-fit flex flex-col items-center gap-8">
      <div className="w-[250px] h-[250px] relative">
        <Chart type="doughnut" options={options} data={data} />
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        {data.labels.map((label, index) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: data.datasets[0].backgroundColor[index],
              }}
            />
            <span className="text-[13px] font-medium leading-[24px] font-urbanist">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmotionDoughnut;
