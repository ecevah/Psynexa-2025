import React from "react";
import Image from "next/image";

const ContentsTable = ({ searchQuery = "" }) => {
  const contentsData = [
    {
      meditation: {
        image: "/call-center/user-image.jpeg",
        title: "Morning Meditation",
      },
      clicks: "2.5K",
      time: "15 min",
      tags: "Mindfulness, Relaxation",
    },
    {
      meditation: {
        image: "/call-center/user-image.jpeg",
        title: "Evening Calm",
      },
      clicks: "1.8K",
      time: "20 min",
      tags: "Sleep, Relaxation",
    },
    {
      meditation: {
        image: "/call-center/user-image.jpeg",
        title: "Stress Relief",
      },
      clicks: "3.2K",
      time: "10 min",
      tags: "Stress, Focus",
    },
    {
      meditation: {
        image: "/call-center/user-image.jpeg",
        title: "Deep Breathing",
      },
      clicks: "2.1K",
      time: "12 min",
      tags: "Breathing, Anxiety",
    },
  ];

  const filteredData = contentsData.filter((content) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      content.meditation.title.toLowerCase().includes(searchLower) ||
      content.tags.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="w-full">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#F5F6FA]">
            <th className="py-4 px-4 text-left text-[14px] font-medium text-[#9D9D9D]">
              Meditation
            </th>
            <th className="py-4 px-4 text-left text-[14px] font-medium text-[#9D9D9D]">
              Clicks
            </th>
            <th className="py-4 px-4 text-left text-[14px] font-medium text-[#9D9D9D]">
              Time
            </th>
            <th className="py-4 px-4 text-left text-[14px] font-medium text-[#9D9D9D]">
              Tags
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((content, index) => (
            <tr key={index} className="border-b border-[#F5F6FA]">
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-[40px] h-[40px] rounded-[10px] overflow-hidden relative">
                    <Image
                      src={content.meditation.image}
                      alt={content.meditation.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-[14px] font-medium text-[#0B1215]">
                    {content.meditation.title}
                  </span>
                </div>
              </td>
              <td className="py-4 px-4 text-[14px] font-medium text-[#0B1215]">
                {content.clicks}
              </td>
              <td className="py-4 px-4 text-[14px] font-medium text-[#0B1215]">
                {content.time}
              </td>
              <td className="py-4 px-4">
                <div className="flex flex-wrap gap-2">
                  {content.tags.split(", ").map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 bg-[#F5F6FA] rounded-full text-[12px] font-medium text-[#9D9D9D]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContentsTable;
