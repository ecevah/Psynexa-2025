import React, { useState } from "react";

const FAQItem = ({
  number,
  title,
  content,
  isExpanded,
  onToggle,
  isFirst,
  isLast,
}) => {
  return (
    <div className="w-full">
      <div
        className={`w-full flex justify-between items-center py-3 sm:py-4 md:py-5 px-4 sm:px-6 md:px-8 cursor-pointer border-b border-white border-opacity-50 ${
          isExpanded ? "bg-[rgba(203,203,203,0.10)] border-b-0" : ""
        } ${
          isFirst
            ? "rounded-t-[16px] sm:rounded-t-[20px] md:rounded-t-[24px]"
            : ""
        } ${
          isLast && !isExpanded
            ? "rounded-b-[16px] sm:rounded-b-[20px] md:rounded-b-[24px]"
            : ""
        }`}
        onClick={onToggle}
      >
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 flex-1 overflow-hidden">
          <div className="text-white font-urbanist text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-medium shrink-0">
            {number < 10 ? `0${number}` : number}
          </div>
          <div className="text-white font-urbanist text-[16px] sm:text-[20px] md:text-[24px] lg:text-[28px] xl:text-[32px] font-medium leading-tight">
            {title}
          </div>
        </div>
        <div
          className={`w-[35px] h-[35px] sm:w-[40px] sm:h-[40px] md:w-[45px] md:h-[45px] flex-shrink-0 flex items-center justify-center transition-transform duration-300 bg-[#1A4B72] rounded-full border border-solid border-white ${
            isExpanded ? "rotate-180" : ""
          }`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div
        className={`w-full bg-[rgba(203,203,203,0.10)] transition-all duration-300 ease-in-out overflow-hidden ${
          isLast
            ? "rounded-b-[16px] sm:rounded-b-[20px] md:rounded-b-[24px]"
            : ""
        } ${
          isExpanded
            ? "max-h-[1000px] opacity-100 p-4 sm:p-6 md:p-8"
            : "max-h-0 opacity-0 p-0 border-opacity-0"
        }`}
      >
        <div className="text-white font-urbanist text-[14px] sm:text-[16px] md:text-[18px] leading-[1.5] sm:leading-[1.6] md:leading-[1.7]">
          {content}
        </div>
      </div>
    </div>
  );
};

const Faq = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqData = [
    {
      title: "Psynexa nedir ve nasıl çalışır?",
      content:
        "Psynexa, ruh sağlığı desteği sunan yapay zeka destekli bir uygulamadır. Kullanıcıların duygusal durumlarını analiz eder, kişiselleştirilmiş tavsiyeler sunar ve meditasyon, nefes egzersizleri gibi farklı tekniklerle zihinsel sağlığınızı destekler. Kullanıcı dostu arayüzü sayesinde günlük ruh halinizi takip edebilir, düzenli uygulamalarla zihinsel dayanıklılığınızı artırabilirsiniz.",
    },
    {
      title: "Psynexa ücretli mi?",
      content:
        "Psynexa'nın hem ücretsiz hem de premium özellikleri bulunmaktadır. Temel özellikler ücretsiz olarak sunulurken, daha gelişmiş özellikler ve kişiselleştirilmiş içerikler premium abonelik planımızla erişilebilir durumdadır.",
    },
    {
      title: "Verilerim güvende mi?",
      content:
        "Kullanıcı gizliliği ve veri güvenliği bizim için en büyük önceliktir. Tüm verileriniz şifrelenir ve güvenli sunucularda saklanır. Kişisel bilgilerinizi kesinlikle üçüncü taraflarla paylaşmıyoruz ve en son güvenlik protokollerini uyguluyoruz.",
    },
    {
      title: "Psynexa'yı kimler kullanabilir?",
      content:
        "Psynexa, zihinsel sağlığını iyileştirmek veya korumak isteyen herkes için tasarlanmıştır. Yaş sınırı olmaksızın, stres yönetimi, anksiyete azaltma veya genel zihinsel refah için destek arayan herkes tarafından kullanılabilir.",
    },
    {
      title: "Nasıl başlayabilirim?",
      content:
        "Başlamak için Psynexa uygulamasını indirmeniz ve bir hesap oluşturmanız yeterlidir. Daha sonra kişiselleştirilmiş deneyiminiz için kısa bir değerlendirme yapılacak ve uygulama size özel öneriler sunmaya başlayacaktır.",
    },
  ];

  const handleToggle = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
      <h2 className="text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] font-bold text-white text-center mb-6 sm:mb-10 md:mb-16">
        Sıkça Sorulan Sorular
      </h2>

      <div className="w-full border border-white border-opacity-50 rounded-[16px] sm:rounded-[20px] md:rounded-[24px] overflow-hidden">
        {faqData.map((faq, index) => (
          <FAQItem
            key={index}
            number={index + 1}
            title={faq.title}
            content={faq.content}
            isExpanded={expandedIndex === index}
            onToggle={() => handleToggle(index)}
            isFirst={index === 0}
            isLast={index === faqData.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default Faq;
