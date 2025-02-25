import React from "react";
import { useTranslations } from "next-intl";

const JudicialExpressionsTable = ({ searchQuery }) => {
  const t = useTranslations("NexabotAnalysis");

  const expressions = [
    {
      sentence: t("sentences.overwhelmed"),
      expression: t("expressions.workStress"),
    },
    {
      sentence: t("sentences.pointless"),
      expression: t("expressions.depression"),
    },
    {
      sentence: t("sentences.cantFocus"),
      expression: t("expressions.attention"),
    },
    {
      sentence: t("sentences.topOfWorld"),
      expression: t("expressions.elevated"),
    },
  ];

  const filteredExpressions = searchQuery
    ? expressions.filter(
        (item) =>
          item.sentence.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.expression.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : expressions;

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#F5F6FA]">
            <th className="py-4 px-6 text-left text-[14px] font-medium text-[#9D9D9D] w-1/2">
              {t("columns.sentences")}
            </th>
            <th className="py-4 px-6 text-left text-[14px] font-medium text-[#9D9D9D] w-1/2">
              {t("columns.expressions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredExpressions.map((item, index) => (
            <tr key={index} className="border-b border-[#F5F6FA]">
              <td className="py-4 px-6 text-[14px] font-medium text-[#0B1215]">
                {item.sentence}
              </td>
              <td className="py-4 px-6 text-[14px] text-[#0B1215]">
                {item.expression}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JudicialExpressionsTable;
