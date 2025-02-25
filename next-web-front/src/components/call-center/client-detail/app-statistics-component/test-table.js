import React from "react";
import HeaderCircleIconButton from "../../header/circle-icon-button/header-circle-icon-button";

const TestTable = () => {
  const testData = [
    {
      testName: "Anxiety Test",
      category: "Mental Health",
      situation: "Completed",
      detail: "View Details",
      download: "Download",
    },
    {
      testName: "Anxiety Test",
      category: "Mental Health",
      situation: "Completed",
      detail: "View Details",
      download: "Download",
    },
    {
      testName: "Anxiety Test",
      category: "Mental Health",
      situation: "Completed",
      detail: "View Details",
      download: "Download",
    },
    {
      testName: "Anxiety Test",
      category: "Mental Health",
      situation: "Completed",
      detail: "View Details",
      download: "Download",
    },
    // Add more test data as needed
  ];

  return (
    <div className="w-full">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#F5F6FA]">
            <th className="py-4 px-4 text-left text-[14px] font-medium text-[#9D9D9D]">
              Test Name
            </th>
            <th className="py-4 px-4 text-left text-[14px] font-medium text-[#9D9D9D]">
              Category
            </th>
            <th className="py-4 px-4 text-left text-[14px] font-medium text-[#9D9D9D]">
              Situation
            </th>
            <th className="py-4 px-4 text-left text-[14px] font-medium text-[#9D9D9D]">
              Detail
            </th>
            <th className="py-4 px-4 text-left text-[14px] font-medium text-[#9D9D9D]">
              Download
            </th>
          </tr>
        </thead>
        <tbody>
          {testData.map((test, index) => (
            <tr key={index} className="border-b border-[#F5F6FA]">
              <td className="py-4 px-4 text-[14px] font-medium text-[#0B1215]">
                {test.testName}
              </td>
              <td className="py-4 px-4 text-[14px] font-medium text-[#0B1215]">
                {test.category}
              </td>
              <td className="py-4 px-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#E8F5E9] text-[#43A047] text-[12px] font-medium">
                  {test.situation}
                </div>
              </td>
              <td className="py-4 px-4">
                <HeaderCircleIconButton
                  icon="/call-center/document.svg"
                  text="View Details"
                  func={() => {}}
                  className="!bg-[#E3F2FD] !hover:bg-[#BBDEFB]"
                  style={{ backgroundColor: "#E0F1FE" }}
                />
              </td>
              <td className="py-4 px-4">
                <HeaderCircleIconButton
                  icon="/call-center/download.svg"
                  text="Download"
                  func={() => {}}
                  className="!bg-[#E3F2FD] !hover:bg-[#BBDEFB]"
                  style={{ backgroundColor: "#E0F1FE" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestTable;
