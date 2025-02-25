import React from "react";
import { useTranslations } from "next-intl";
import { Chart as ChartJS, ArcElement, Legend } from "chart.js";
import { Chart } from "react-chartjs-2";

// Basit bir önbellek mekanizması ile ikonları hafızada tutuyoruz.
const imagesCache = {};

// Yalnızca EmotionDoughnut için bağımsız ikon plugin'i.
const independentEmotionIconsPlugin = {
  id: "independentEmotionIconsPlugin",
  afterDraw: (chart, args, options) => {
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);
    const activeElements = chart.getActiveElements();

    meta.data.forEach((arc, index) => {
      const midAngle = (arc.startAngle + arc.endAngle) / 2;

      // İkonlar için sabit radius - hover/seçili durumdan etkilenmeyecek
      const fixedRadius = arc.outerRadius * 0.85;

      // İkonun sabit pozisyonu
      const centerX = arc.x + fixedRadius * Math.cos(midAngle);
      const centerY = arc.y + fixedRadius * Math.sin(midAngle);

      // Hover veya seçili durumu kontrol et
      let isActive = false;
      let isSelected = options.selectedIndex === index;
      if (activeElements && activeElements.length > 0) {
        activeElements.forEach((active) => {
          if (active.index === index) {
            isActive = true;
          }
        });
      }

      // Sadece dilimi dışarı çıkar
      if (isActive || isSelected) {
        arc.outerRadius += options.hoverOffset || 15;
      }

      let iconSrc = options.icons?.[index];
      if (!iconSrc) return;

      if (!imagesCache[iconSrc]) {
        const img = new Image();
        img.src = iconSrc;
        img.onerror = () => {
          console.error("Error loading image: " + iconSrc);
          imagesCache[iconSrc] = "error";
          chart.draw();
        };
        imagesCache[iconSrc] = img;
      }

      const img = imagesCache[iconSrc];
      if (img === "error" || !img.complete || !img.naturalWidth) return;

      const iconSize = options.iconSize || 24;
      ctx.save();

      // İkon arka planı
      if (options.showIconBackground) {
        const bgRadius = options.iconBackgroundRadius || iconSize / 2 + 4;
        ctx.beginPath();
        ctx.arc(centerX, centerY, bgRadius, 0, 2 * Math.PI);
        ctx.fillStyle = options.iconBackgroundColor || "#FFF";
        ctx.fill();
      }

      // İkonu çiz - scale efekti kaldırıldı
      try {
        ctx.drawImage(
          img,
          centerX - iconSize / 2,
          centerY - iconSize / 2,
          iconSize,
          iconSize
        );
      } catch (error) {
        console.error("Failed to draw image: ", iconSrc, error);
      }
      ctx.restore();

      // Dilimin orijinal boyutunu geri yükle
      if (isActive || isSelected) {
        arc.outerRadius -= options.hoverOffset || 15;
      }
    });
  },
};

// Yalnızca emotion-doughnut bileşeni için gerekli olan pluginleri kaydediyoruz.
ChartJS.register(ArcElement, Legend, independentEmotionIconsPlugin);

const EmotionDoughnut = ({ selectedEmotion, onEmotionSelect }) => {
  const t = useTranslations("NexabotAnalysis");

  const emotionData = {
    Angry: {
      color: "#FE7575",
      icon: "/call-center/angry.svg",
      parameters: ["Frustration", "Irritation", "Rage", "Annoyance"],
    },
    Happy: {
      color: "#FEE278",
      icon: "/call-center/happy.svg",
      parameters: ["Joy", "Contentment", "Satisfaction", "Pleasure"],
    },
    Depressed: {
      color: "#C179FF",
      icon: "/call-center/depressed.svg",
      parameters: ["Sadness", "Hopelessness", "Emptiness", "Despair"],
    },
    Sad: {
      color: "#64C6EA",
      icon: "/call-center/sad.svg",
      parameters: ["Grief", "Melancholy", "Sorrow", "Loneliness"],
    },
    Overjoyed: {
      color: "#AFF06E",
      icon: "/call-center/overenjoyed.svg",
      parameters: ["Elation", "Euphoria", "Delight", "Excitement"],
    },
  };

  const data = {
    labels: Object.keys(emotionData).map((emotion) =>
      t(`emotions.${emotion.toLowerCase()}`)
    ),
    datasets: [
      {
        data: [20, 25, 15, 25, 15],
        backgroundColor: Object.values(emotionData).map((e) => e.color),
        hoverBackgroundColor: Object.values(emotionData).map((e) => e.color),
        borderWidth: 0,
        borderRadius: 5,
        spacing: 10,
        hoverOffset: 15,
      },
    ],
  };

  const handleClick = (event, elements) => {
    if (elements.length > 0) {
      const clickedIndex = elements[0].index;
      const emotion = Object.keys(emotionData)[clickedIndex];
      onEmotionSelect(selectedEmotion === emotion ? null : emotion);
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    layout: {
      padding: 20,
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      centerTextPlugin: false,
      emotionTextPlugin: false,
      independentEmotionIconsPlugin: {
        icons: Object.values(emotionData).map((e) => e.icon),
        iconSize: 24,
        hoverOffset: 15,
        showIconBackground: false,
        iconBackgroundRadius: 18,
        iconBackgroundColor: "#FFF",
        selectedIndex: selectedEmotion
          ? Object.keys(emotionData).indexOf(selectedEmotion)
          : null,
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
    onClick: handleClick,
    hover: {
      mode: "nearest",
      intersect: true,
      animationDuration: 150,
    },
  };

  return (
    <div className="flex flex-col gap-4 w-fit">
      <h2 className="text-[20px] font-semibold text-aside_menu-menu_list_itemm">
        {t("emotionAnalysis")}
      </h2>
      <div className="relative w-full max-w-[250px] mx-auto">
        <div className="aspect-square w-full">
          <Chart type="doughnut" data={data} options={options} />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center items-center mt-4">
        {Object.keys(emotionData).map((emotion, index) => (
          <button
            key={emotion}
            onClick={() =>
              onEmotionSelect(selectedEmotion === emotion ? null : emotion)
            }
            className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-200 ${
              selectedEmotion === emotion ? "bg-gray-100" : "hover:bg-gray-50"
            }`}
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{
                backgroundColor: emotionData[emotion].color,
              }}
            />
            <span className="text-sm font-medium">
              {t(`emotions.${emotion.toLowerCase()}`)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmotionDoughnut;
