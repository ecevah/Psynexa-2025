import React from "react";
import HeaderCircleIconButton from "../../header/circle-icon-button/header-circle-icon-button";
import { useSelector } from "react-redux";
import { selectFeedbackData } from "@/store/features/feedbacksSlice";

const MonthFeedbackTable = () => {
  const feedbackData = useSelector(selectFeedbackData);

  return (
    <div className="w-full">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#F5F6FA]">
            <th className="py-4 px-4 text-left text-[14px] font-medium text-[#9D9D9D]">
              Message Content
            </th>
            <th className="py-4 px-4 text-left text-[14px] font-medium text-[#9D9D9D]">
              Situation
            </th>
            <th className="py-4 px-4 text-left text-[14px] font-medium text-[#9D9D9D]">
              Date / Time
            </th>
            <th className="py-4 px-4 text-[14px] font-medium text-[#9D9D9D] text-center">
              History
            </th>
          </tr>
        </thead>
        <tbody>
          {feedbackData.map((feedback) => (
            <tr key={feedback.id} className="border-b border-[#F5F6FA]">
              <td className="py-4 px-4 text-[14px] font-medium text-[#0B1215]">
                {feedback.content}
              </td>
              <td className="py-4 px-4">
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium ${
                    feedback.situation === "positive"
                      ? "bg-[#E8F5E9] text-[#45B369]"
                      : "bg-[#FFF3F0] text-[#EF4A00]"
                  }`}
                >
                  {feedback.situation === "positive" ? "Positive" : "Negative"}
                </div>
              </td>
              <td className="py-4 px-4 text-[14px] font-medium text-[#0B1215]">
                {feedback.dateTime}
              </td>
              <td className="py-4 px-4">
                <HeaderCircleIconButton
                  icon="/call-center/arrow-icon.svg"
                  text="View History"
                  func={() => {}}
                  style={{ backgroundColor: "#E0F1FE" }}
                  labelIsVisible={false}
                  isBig={false}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonthFeedbackTable;
