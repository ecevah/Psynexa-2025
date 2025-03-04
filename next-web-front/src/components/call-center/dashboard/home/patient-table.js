import Image from "next/image";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { selectPatients } from "@/store/features/dashboardSlice";

const PatientTable = () => {
  const t = useTranslations("DashboardPage");
  const patients = useSelector(selectPatients);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full grid grid-cols-2 min-[460px]:grid-cols-3 min-[700px]:grid-cols-4 min-[900px]:grid-cols-5 min-[1024px]:grid-cols-3 min-[1150px]:grid-cols-4 min-[1380px]:grid-cols-5 gap-4 px-4 py-3 bg-white sticky top-0 z-[50]">
        <div className="text-[#666] text-sm font-medium">
          {t.raw("patientTable.patient")}
        </div>
        <div className="text-[#666] text-sm font-medium hidden min-[700px]:block min-[1024px]:hidden min-[1150px]:block">
          {t.raw("patientTable.recentVisit")}
        </div>
        <div className="text-[#666] text-sm font-medium hidden min-[900px]:block min-[1024px]:hidden min-[1380px]:block">
          {t.raw("patientTable.streak")}
        </div>
        <div className="text-[#666] text-sm font-medium hidden min-[460px]:block min-[1024px]:hidden min-[1150px]:block">
          {t.raw("patientTable.status")}
        </div>
        <div className="text-[#666] text-sm font-medium text-center">
          {t.raw("patientTable.statistics")}
        </div>
      </div>

      <div className="flex-1 px-[10px] w-full overflow-y-auto min-h-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:mr-[5px] [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-[#D0E8FC] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="rounded-[20px] grid grid-cols-2 min-[460px]:grid-cols-3 min-[700px]:grid-cols-4 min-[900px]:grid-cols-5 min-[1024px]:grid-cols-3 min-[1150px]:grid-cols-4 min-[1380px]:grid-cols-5 gap-4 px-4 py-3 hover:bg-[#D0E8FC] transition-colors duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Image
                src={patient.image}
                alt={patient.name}
                width={40}
                height={40}
                className="rounded-full object-cover min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px]"
              />
              <div>
                <div className="text-[#0B1215] text-sm font-medium">
                  {patient.name}
                </div>
                <div className="text-[#666] text-xs">
                  {patient.age} years old
                </div>
              </div>
            </div>

            <div className="flex items-center text-[#0B1215] text-sm hidden min-[700px]:flex min-[1024px]:hidden min-[1150px]:flex">
              {patient.recentVisit}
            </div>

            <div className="flex items-center text-[#0B1215] text-sm hidden min-[900px]:flex min-[1024px]:hidden min-[1380px]:flex">
              {patient.streak}
            </div>

            <div className="flex items-center hidden min-[460px]:flex min-[1024px]:hidden min-[1150px]:flex">
              <div
                className={`px-3 py-1 rounded-full text-xs ${
                  patient.status === "Critical"
                    ? "bg-[#FFE2E5] text-[#FF505F]"
                    : "bg-[#E1EFFD] text-[#0B1215]"
                }`}
              >
                {patient.status}
              </div>
            </div>

            <div className="flex items-center mx-auto w-[48px] h-[48px] rounded-full bg-[#E0F1FE] justify-center hover:bg-white transition-colors duration-200">
              <Image
                src="/call-center/arrow-down.svg"
                alt="View Statistics"
                width={19.2}
                height={19.2}
                className="cursor-pointer -rotate-90 max-w-[19.2px] max-h-[19.2px]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientTable;
