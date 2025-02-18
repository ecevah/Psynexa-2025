import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";

const HomeDropdown = ({ options, selected = options[0].label, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-aside_menu-menu_list_itemm text-[18px] font-medium leading-[32px] py-[12px] pl-[16px] pr-[36px] min-w-[160px] rounded-full bg-[#F7F7F7] shadow-[0px_1px_2px_rgba(10,13,18,0.05)] text-left relative"
      >
        {selected}
        <Image
          src="/call-center/arrow-down.svg"
          alt="arrow-down"
          width={16}
          height={16}
          className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <ul className="absolute mt-2 w-full rounded-[12px] bg-[#F7F7F7] shadow-[0px_1px_2px_rgba(10,13,18,0.05)] overflow-hidden z-[60]">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => {
                onChange(option.label);
                setIsOpen(false);
              }}
              className="px-4 py-2 hover:bg-[#E1EFFD] cursor-pointer"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomeDropdown;
