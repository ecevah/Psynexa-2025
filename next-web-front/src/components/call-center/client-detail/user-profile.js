import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import ProfileHeader from "./user-profile-component/profile-header";
import GeneralInfo from "./user-profile-component/general-info";
import ContactInfo from "./user-profile-component/contact-info";
import TimeScaleChart from "./user-profile-component/time-scale-chart";
import SpeechDoughnut from "./user-profile-component/speech-doughnut";
import HomeDropdown from "../dropdown/home-dropdown";
import ItemCardLine from "./user-profile-component/item-card-line";
import EmotionDoughnut from "./user-profile-component/emotion-doughnut";

const UserProfile = () => {
  const tTemplate = useTranslations("Template");
  const t = useTranslations("UserProfile");
  const [selectedOption, setSelectedOption] = useState(tTemplate("allTime"));
  const user = useSelector((state) => state.user);

  const userData = {
    profile: {
      name: `${user.firstName} ${user.lastName}`,
      image: user.imageUrl,
      age: user.age,
    },
    general: {
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      location: user.location,
      language: user.language,
      timezone: user.timezone,
    },
    contact: {
      phone: user.phone,
      email: user.email,
      about: user.about,
    },
  };

  const timeOptions = [
    { value: "thisMonth", label: tTemplate("allTime") },
    { value: "lastWeek", label: tTemplate("lastWeek") },
    { value: "lastMonth", label: tTemplate("lastMonth") },
    { value: "lastYear", label: tTemplate("lastYear") },
  ];

  return (
    <>
      <div className="w-full h-full max-w-full flex flex-col lg:flex-row justify-between gap-[20px] pb-[20px] mb-[20px]">
        {/* Sol sidebar - profil bilgileri */}
        <div className="w-full lg:w-[364px] lg:min-w-[364px] h-full rounded-[24px] shadow-[0px 1px 6px 0px rgba(157, 157, 157, 0.15)] bg-white flex flex-col p-[12px] overflow-y-scroll overflow-x-hidden events-container">
          <ProfileHeader profileData={userData.profile} />
          <GeneralInfo generalData={userData.general} />
          <ContactInfo contactData={userData.contact} />
        </div>

        {/* Sağ taraf - grafikler ve kartlar */}
        <div className="flex flex-col gap-[20px] w-full min-w-0 overflow-y-scroll overflow-x-hidden events-container">
          {/* Üst grafik bölümü */}
          <div className="w-full h-fit flex flex-col gap-[20px] items-start bg-white rounded-[24px] shadow-[0px 1px 6px 0px rgba(157, 157, 157, 0.15)] p-[12px] md:p-[24px]">
            <div className="w-full h-fit flex flex-col">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-[20px] gap-4">
                <div className="text-aside_menu-menu_list_itemm text-[20px] leading-[28px] font-semibold">
                  {t("totalMessage")}
                </div>
                <HomeDropdown
                  options={timeOptions}
                  selected={selectedOption}
                  onChange={(value) => setSelectedOption(value)}
                  style={{ zIndex: 100 }}
                />
              </div>
              <div className="flex flex-col xl:flex-row gap-[20px]">
                <div className="flex-1 min-w-0 h-full">
                  <TimeScaleChart
                    lineData={[28, 48, 40, 19, 86, 27, 90, 28, 48, 40, 19, 86]}
                    greenBarData={[
                      65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56,
                    ]}
                    blueBarData={[
                      45, 55, 65, 45, 70, 45, 60, 45, 55, 65, 45, 70,
                    ]}
                  />
                </div>
                <div className="flex justify-center xl:block">
                  <SpeechDoughnut />
                </div>
              </div>
            </div>
          </div>

          {/* Alt grafik ve kartlar bölümü */}
          <div className="flex flex-col xl:flex-row gap-[20px] w-full">
            {/* Sol kartlar */}
            <div className="flex flex-col gap-[20px] w-full xl:min-w-[364px] xl:w-[364px] min-[1615px]:w-full">
              <ItemCardLine
                title={t("nexabotUsageTime")}
                icon="/call-center/3-User.svg"
                value="100"
                barData={[
                  { value: 30 },
                  { value: 45 },
                  { value: 60 },
                  { value: 80 },
                  { value: 65 },
                  { value: 40 },
                  { value: 25 },
                ]}
              />
              <ItemCardLine
                title={t("appUsageTime")}
                icon="/call-center/notification.svg"
                value="100"
                barData={[
                  { value: 30 },
                  { value: 45 },
                  { value: 60 },
                  { value: 80 },
                  { value: 65 },
                  { value: 40 },
                  { value: 25 },
                ]}
              />
            </div>

            {/* Sağ emotion analizi */}
            <div className="flex flex-col gap-[20px] w-full xl:w-[calc(100%-384px)] min-[1615px]:min-w-[480px] h-full bg-white py-[20px] px-[12px] rounded-[20px] shadow-[0px 1px 6px 0px rgba(157, 157, 157, 0.15)]">
              <div className="w-full h-fit flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-[20px] font-semibold leading-[32px]">
                  {t("emotionAnalysis")}
                </div>
                <HomeDropdown
                  options={timeOptions}
                  selected={selectedOption}
                  onChange={(value) => setSelectedOption(value)}
                  style={{ zIndex: 100 }}
                />
              </div>
              <div className="w-full h-full flex items-center justify-center">
                <EmotionDoughnut />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
