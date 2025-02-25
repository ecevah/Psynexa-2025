import React from "react";

const ItemBarLine = ({ value, isActive, onClick }) => {
  return (
    <div className="relative" onClick={onClick}>
      <div
        className={`w-[14px] ${
          isActive
            ? "bg-science_blue-600 hover:opacity-80"
            : "bg-aside_menu-menu_list_itemm opacity-10 hover:opacity-40"
        } rounded-full transition-all duration-300 cursor-pointer peer`}
        style={{ height: `${value}px` }}
      />
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 peer-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {value}
      </div>
    </div>
  );
};

export default ItemBarLine;
