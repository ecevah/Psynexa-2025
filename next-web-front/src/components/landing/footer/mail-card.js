import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const MailCard = () => {
  const t = useTranslations("HomePage.footer-card.mail-card");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setMessage({ text: "", type: "" });

    // Validate email
    if (!email.trim()) {
      setMessage({ text: "Please enter an email address", type: "error" });
      return;
    }

    if (!isValidEmail(email)) {
      setMessage({ text: "Please enter a valid email address", type: "error" });
      return;
    }

    // Submit the email
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/save-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: "Thank you for subscribing!", type: "success" });
        setEmail("");
      } else {
        setMessage({
          text: data.error || "Failed to subscribe. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error submitting email:", error);
      setMessage({
        text: "An error occurred. Please try again later.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="contact-section"
      className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 pt-[50px] sm:pt-[60px] md:pt-[80px] pb-[80px] sm:pb-[100px] md:pb-[120px] relative"
    >
      <h2
        className="text-white text-[24px] sm:text-[28px] md:text-[32px] font-semibold leading-tight sm:leading-[26px] mb-[8px] sm:mb-[12px] text-center"
        data-aos="fade-down"
      >
        {t("title")}
      </h2>
      <p
        className="text-white text-[12px] sm:text-[14px] leading-[22px] sm:leading-[26px] mb-[24px] md:mb-[30px] text-center"
        data-aos="fade-down"
      >
        {t("description")}
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[500px] relative"
        data-aos="fade-down"
      >
        <div className="flex flex-col items-center relative">
          <div className="w-full relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("email")}
              className="w-full h-[50px] sm:h-[56px] pl-[16px] pr-[60px] py-[12px] rounded-[32px] bg-[#F5F5F7] text-[#0B1215] font-urbanist text-[15px] sm:text-[17px] font-medium leading-[26px] outline-none"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="absolute right-[8px] top-[8px] flex items-center justify-center w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-full bg-[#0B1215] hover:bg-[#1a2328] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center w-full h-full">
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Image
                    src="/landing/right-arrow-icon.svg"
                    alt="Send"
                    width={16}
                    height={16}
                    className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] transform -rotate-45"
                  />
                )}
              </div>
            </button>
          </div>

          {message.text && (
            <div
              className={`mt-2 text-sm ${
                message.type === "error" ? "text-red-500" : "text-green-500"
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default MailCard;
