import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showLanding, setShowLanding] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && chatContainerRef.current) {
      // Scroll the chat container to show the latest messages
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Get current time in HH:MM format
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle sending a new message
  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    // Add user message
    const userMessage = {
      type: "user",
      content: inputValue,
      timestamp: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setShowLanding(false);

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botMessage = {
        type: "bot",
        content: "Thank you for your message! I'll help you with that.",
        timestamp: getCurrentTime(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  // Handle predefined button clicks
  const handleButtonClick = (message) => {
    const userMessage = {
      type: "user",
      content: "selam nexabot",
      timestamp: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setShowLanding(false);

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        type: "bot",
        content: "Merhaba! Size nasıl yardımcı olabilirim?",
        timestamp: getCurrentTime(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle pressing Enter to send
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto p-4 md:p-6 lg:p-[40px] rounded-md md:rounded-xl lg:rounded-[24px] bg-[rgba(0,0,0,0.10)] backdrop-blur-[150px] z-20 relative">
      <div className="w-full rounded-lg md:rounded-xl lg:rounded-[32px] relative overflow-hidden px-4 sm:px-6 md:px-8 lg:px-[40px] py-4 md:py-5 lg:py-[24px] flex flex-col">
        <div className="absolute w-full md:w-[1500px] lg:w-[2200px] h-[1000px] md:h-[1500px] lg:h-[2200px] rounded-full bg-[rgba(135,199,248,0.35)] blur-[150px] md:blur-[200px] lg:blur-[250px] -top-[800px] md:-top-[1500px] lg:-top-[2100px] left-0 md:left-[50px] lg:left-[100px]"></div>
        <div className="absolute w-[400px] md:w-[600px] lg:w-[919px] h-[400px] md:h-[600px] lg:h-[919px] rounded-full bg-[rgba(135,199,248,0.35)] blur-[100px] md:blur-[150px] lg:blur-[200px] -top-[200px] md:-top-[300px] lg:-top-[466px] -left-[200px] md:-left-[250px] lg:-left-[366px]"></div>

        {showLanding ? (
          <div className="flex flex-col lg:flex-row w-full justify-between relative mb-8 md:mb-10 lg:mb-[72px] gap-10 lg:gap-4">
            {/* Left side content */}
            <div className="flex flex-col">
              <p className="capitalize text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-bold leading-tight md:leading-tight lg:leading-[79px] text-white">
                start a conversation <br /> with our{" "}
                <span className="text-[#5DB9FF]">Nexabot</span>
                <br /> Now!
              </p>

              <div className="flex flex-col mt-6 sm:mt-8 md:mt-10 lg:mt-[46px]">
                {/* First row of buttons */}
                <div className="flex flex-col sm:flex-row mb-4 md:mb-[16px] gap-3 sm:gap-4">
                  <div
                    className="rounded-full !border-[0.3px] border-solid border-white bg-[rgba(49,101,142,0.30)] backdrop-blur-[2px] py-2 md:py-[12px] px-3 md:px-[12px] flex flex-row gap-2 md:gap-[8px] items-center cursor-pointer hover:bg-[rgba(49,101,142,0.50)]"
                    onClick={() => handleButtonClick("Talk Nexa")}
                  >
                    <Image
                      src="/landing/close-line.svg"
                      width={24}
                      height={24}
                      className="w-5 h-5 md:w-6 md:h-6 min-w-[20px] min-h-[20px] md:min-w-[24px] md:min-h-[24px]"
                      alt="plus"
                    />
                    <div className="text-white text-base sm:text-lg md:text-xl lg:text-[20px] font-light mr-2 md:mr-[12px]">
                      Talk Nexa
                    </div>
                  </div>

                  <div
                    className="rounded-full !border-[0.3px] border-solid border-white bg-[rgba(49,101,142,0.30)] backdrop-blur-[2px] py-2 md:py-[12px] px-3 md:px-[12px] flex flex-row gap-2 md:gap-[8px] items-center cursor-pointer hover:bg-[rgba(49,101,142,0.50)]"
                    onClick={() => handleButtonClick("Voice Nexa")}
                  >
                    <Image
                      src="/landing/close-line.svg"
                      width={24}
                      height={24}
                      className="w-5 h-5 md:w-6 md:h-6 min-w-[20px] min-h-[20px] md:min-w-[24px] md:min-h-[24px]"
                      alt="plus"
                    />
                    <div className="text-white text-base sm:text-lg md:text-xl lg:text-[20px] font-light mr-2 md:mr-[12px]">
                      Voice Nexa
                    </div>
                  </div>
                </div>

                {/* Second row of buttons */}
                <div className="flex flex-col sm:flex-row sm:ml-6 md:ml-[30px] lg:ml-[58px] gap-3 sm:gap-4">
                  <div
                    className="rounded-full !border-[0.3px] border-solid border-white bg-[rgba(49,101,142,0.30)] backdrop-blur-[2px] py-2 md:py-[12px] px-3 md:px-[12px] flex flex-row gap-2 md:gap-[8px] items-center cursor-pointer hover:bg-[rgba(49,101,142,0.50)]"
                    onClick={() => handleButtonClick("Get Suggestions")}
                  >
                    <Image
                      src="/landing/close-line.svg"
                      width={24}
                      height={24}
                      className="w-5 h-5 md:w-6 md:h-6 min-w-[20px] min-h-[20px] md:min-w-[24px] md:min-h-[24px]"
                      alt="plus"
                    />
                    <div className="text-white text-base sm:text-lg md:text-xl lg:text-[20px] font-light mr-2 md:mr-[12px]">
                      Get Suggestions
                    </div>
                  </div>

                  <div
                    className="rounded-full !border-[0.3px] border-solid border-white bg-[rgba(49,101,142,0.30)] backdrop-blur-[2px] py-2 md:py-[12px] px-3 md:px-[12px] flex flex-row gap-2 md:gap-[8px] items-center cursor-pointer hover:bg-[rgba(49,101,142,0.50)]"
                    onClick={() => handleButtonClick("Be Friend")}
                  >
                    <Image
                      src="/landing/close-line.svg"
                      width={24}
                      height={24}
                      className="w-5 h-5 md:w-6 md:h-6 min-w-[20px] min-h-[20px] md:min-w-[24px] md:min-h-[24px]"
                      alt="plus"
                    />
                    <div className="text-white text-base sm:text-lg md:text-xl lg:text-[20px] font-light mr-2 md:mr-[12px]">
                      Be Friend
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side chat UI */}
            <div className="flex flex-col relative mt-10 lg:mt-0">
              {/* Vector image - hidden on small screens */}
              <Image
                src="/landing/vector-chatbot.svg"
                width={185}
                height={100}
                className="hidden md:block absolute top-[60px] md:top-[90px] lg:top-[120px] left-[-80px] md:left-[-100px] lg:left-[-140px] max-w-[100px] md:max-w-[150px] lg:max-w-[185px] max-h-[60px] md:max-h-[80px] lg:max-h-[100px]"
                alt="vector-chatbot"
              />

              {/* First chat bubble */}
              <div className="px-4 sm:px-5 md:px-[30px] py-3 md:py-[12px] bg-[#053A64] w-full sm:w-[280px] md:w-[310px] flex flex-row items-center gap-3 md:gap-[12px] rounded-xl md:rounded-[24px] ml-0 sm:ml-[10px]">
                <div className="w-[50px] h-[50px] md:w-[68px] md:h-[68px] rounded-full bg-[#0A6EBD] flex items-center justify-center">
                  <Image
                    src="/landing/mini-logo.svg"
                    width={40}
                    height={40}
                    alt="mini-logo"
                    className="w-[35px] h-[35px] md:w-[50px] md:h-[50px]"
                  />
                </div>
                <p className="flex-1 sm:w-[178px] text-white text-[11px] md:text-[12px]">
                  <span className="font-bold">Welcome to Nexabot!</span> How are
                  you! I am Nexabot, your personal friend. Have a specific
                  question to ask me?
                </p>
              </div>

              {/* Second chat bubble */}
              <div className="px-4 sm:px-5 md:px-[30px] py-3 md:py-[12px] bg-[#053A64] w-full sm:w-[280px] md:w-[310px] flex flex-row items-center gap-3 md:gap-[12px] rounded-xl md:rounded-[24px] mt-4 md:mt-[23px] mb-4 md:mb-[47px] self-end sm:ml-[80px] md:ml-[120px]">
                <Image
                  src="/landing/chenese.jpeg"
                  width={68}
                  height={68}
                  alt="mini-logo"
                  className="w-[50px] h-[50px] md:w-[68px] md:h-[68px] rounded-full"
                />
                <p className="flex-1 sm:w-[178px] text-white text-[11px] md:text-[12px]">
                  I'm feeling a bit confused today and could use some help
                  figuring things out.
                </p>
              </div>

              {/* Chat input box */}
              <div className="px-4 sm:px-5 md:px-[30px] pt-3 md:pt-[15px] pb-2 md:pb-[9px] bg-[#053A64] w-full sm:w-[280px] md:w-[310px] flex flex-row gap-3 md:gap-[12px] rounded-xl md:rounded-[24px] h-[100px] md:h-[123px] justify-between">
                <div className="flex flex-col justify-between">
                  <div className="text-white text-[12px] md:text-[14px] font-medium">
                    Write your message....
                  </div>
                  <div className="flex flex-row gap-4 md:gap-[24px] items-center mb-2 md:mb-[15px]">
                    <Image
                      src="/landing/image.svg"
                      width={24}
                      height={24}
                      alt="image"
                      className="w-5 h-5 md:w-6 md:h-6"
                    />
                    <Image
                      src="/landing/voice.svg"
                      width={24}
                      height={24}
                      alt="voice"
                      className="w-5 h-5 md:w-6 md:h-6"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-center w-[45px] h-[45px] md:w-[56px] md:h-[56px] rounded-full bg-[#E0F1FE] mt-auto">
                  <Image
                    src="/landing/send.svg"
                    width={20}
                    height={20}
                    alt="send"
                    className="w-5 h-5 md:w-6 md:h-6"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Chat interface that replaces the landing view
          <div
            ref={chatContainerRef}
            className="flex flex-col h-[300px] md:h-[400px] overflow-y-auto mb-4 md:mb-[24px] pr-2"
            style={{ scrollBehavior: "smooth" }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`my-2 md:my-3 flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.type === "bot" && (
                  <div className="flex flex-col items-start">
                    <div className="flex min-w-[60px] max-w-[298px] p-3 items-start gap-2 rounded-[12px_12px_12px_2px] bg-white">
                      <p className="text-[#0B1215] font-['Urbanist'] text-base font-normal leading-[140%]">
                        {message.content}
                      </p>
                    </div>
                    <span className="text-white font-['Urbanist'] text-sm font-bold leading-[140%] mt-1 ml-2">
                      {message.timestamp}
                    </span>
                  </div>
                )}

                {message.type === "user" && (
                  <div className="flex flex-col items-end">
                    <div className="flex min-w-[60px] max-w-[298px] p-3 items-start gap-2 rounded-[12px_12px_2px_12px] bg-[#E0F1FE]">
                      <p className="text-[#0B1215] font-['Urbanist'] text-base font-normal leading-[140%]">
                        {message.content}
                      </p>
                    </div>
                    <span className="text-white font-['Urbanist'] text-sm font-bold leading-[140%] mt-1 mr-2">
                      {message.timestamp}
                    </span>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Bottom search/input section - always visible */}
        <div className="relative mt-6 md:mt-0">
          <div className="relative">
            <Image
              src="/landing/search.svg"
              alt="search"
              width={20}
              height={20}
              className="w-5 h-5 md:w-[20px] md:h-[20px] absolute top-[16px] sm:top-[20px] md:top-[38px] left-[16px] md:left-[24px]"
            />
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="w-full h-[60px] sm:h-[80px] md:h-[100px] rounded-full bg-[#053A64] placeholder:text-white text-white text-base sm:text-xl md:text-[24px] font-medium px-[24px] py-[12px] md:py-[16px] bg-[rgba(255,255,255,0.10)] backdrop-blur-[100px] pl-[40px] sm:pl-[45px] md:pl-[50px] pr-[120px] sm:pr-[150px] md:pr-[200px]"
              placeholder="Write your message...."
            />
            <div className="flex flex-row gap-2 md:gap-[8px] absolute right-[10px] sm:right-[15px] md:right-[20px] bottom-[5px] sm:bottom-[8px] md:bottom-[10px]">
              {/* Microphone button with tooltip */}
              <div className="relative">
                <div
                  className="w-[50px] h-[50px] sm:w-[65px] sm:h-[65px] md:w-[80px] md:h-[80px] rounded-full flex items-center justify-center bg-secondary_color_palette-100 cursor-not-allowed"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <Image
                    src="/landing/microphone-borderline.svg"
                    alt="microphone"
                    width={24}
                    height={24}
                    className="w-5 h-5 md:w-6 md:h-6"
                  />
                </div>
                {showTooltip && (
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                    Web için kullanılablir değil mobil uygulama edinin
                  </div>
                )}
              </div>

              {/* Send button */}
              <div
                className="w-[50px] h-[50px] sm:w-[65px] sm:h-[65px] md:w-[80px] md:h-[80px] rounded-full flex items-center justify-center bg-secondary_color_palette-100 cursor-pointer hover:bg-[#4d8fbd]"
                onClick={handleSendMessage}
              >
                <Image
                  src="/landing/send-borderline.svg"
                  alt="send"
                  width={24}
                  height={24}
                  className="w-5 h-5 md:w-6 md:h-6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
