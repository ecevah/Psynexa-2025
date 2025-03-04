import React from "react";
import { useSelector } from "react-redux";
import { Chart as ChartJS, ArcElement, Legend } from "chart.js";
import { Chart } from "react-chartjs-2";
import { useTranslations } from "next-intl";
import { selectSpeechData } from "@/store/features/speechDoughnutSlice";

ChartJS.register(ArcElement, Legend);

const centerTextPlugin = {
  id: "centerTextPlugin",
  afterDraw: (chart, args, options) => {
    const { ctx } = chart;
    const dataset = chart.data.datasets[0];
    const meta = chart.getDatasetMeta(0);

    meta.data.forEach((arc, index) => {
      const circleRadius = options.circleRadius || 25;

      const midAngle = (arc.startAngle + arc.endAngle) / 2;
      const newCenterX =
        arc.x + (arc.outerRadius + circleRadius / 2) * Math.cos(midAngle);
      const newCenterY =
        arc.y + (arc.outerRadius + circleRadius / 2) * Math.sin(midAngle);

      ctx.save();

      ctx.beginPath();
      ctx.arc(newCenterX, newCenterY, circleRadius, 0, 2 * Math.PI);
      ctx.fillStyle = options.circleBackgroundColor || "#FFF";
      ctx.fill();

      if (options.circleBorderWidth && options.circleBorderWidth > 0) {
        ctx.lineWidth = options.circleBorderWidth;
        ctx.strokeStyle = options.circleBorderColor;
        ctx.stroke();
      }

      ctx.fillStyle = options.textColor || "#000";
      ctx.font = options.font || "bold 16px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const text = dataset.data[index] + "%";
      ctx.fillText(text, newCenterX, newCenterY);
      ctx.restore();
    });
  },
};

ChartJS.register(centerTextPlugin);

const SpeechDoughnut = () => {
  const t = useTranslations("Template");
  const { voicePercentage, textPercentage } = useSelector(selectSpeechData);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "75%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      emotionTextPlugin: false,
      centerTextPlugin: {
        circleRadius: 25,
        circleBackgroundColor: "#FFF",
        circleBorderColor: "#F5F6FA",
        circleBorderWidth: 0,
        textColor: "#000",
        font: "bold 16px Arial",
      },
    },
    animation: { animateScale: true, animateRotate: true },
    hover: {
      mode: null,
      intersect: false,
      animationDuration: 0,
    },
  };

  const data = {
    labels: [t("voice"), t("text")],
    datasets: [
      {
        data: [voicePercentage, textPercentage],
        backgroundColor: ["#A1DC67", "#0A6EBD"],
        borderColor: ["#A1DC67", "#0A6EBD"],
        borderWidth: 5,
        hoverOffset: 0,
        hoverBorderWidth: 6,
        borderRadius: 10,
        spacing: 8,
      },
    ],
  };

  return (
    <div className="w-fit p-[24px] mt-[20px]">
      <div className="flex flex-col items-center justify-between gap-6 w-[230px] h-[230px]">
        <div className="w-[230px] h-[230px] max-w-[230px] max-h-[230px] relative">
          <div className="absolute inset-[-20px]">
            <Chart type="doughnut" options={options} data={data} />
          </div>
        </div>
        <div className="flex flex-col mt-[20px] w-[160px]">
          {data.labels.map((label, index) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: data.datasets[0].backgroundColor[index],
                }}
              />
              <span className="text-[16px] text-[#313131]">{label}</span>
              <span className="text-[18px] text-aside_menu-menu_list_itemm font-semibold leading-[32px] ml-auto">
                {data.datasets[0].data[index]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpeechDoughnut;
