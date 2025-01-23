import React from "react";
import { MdNotifications, MdPerson, MdSettings } from "react-icons/md";
import { useLocation } from "react-router-dom";

const Header = ({ userRole }) => {
  const location = useLocation();
  const path = location.pathname;

  // Function to determine the active class for header items
  const getActiveClass = (name) => {
    return path.startsWith(`/${name}`)
      ? "text-sky-500 font-bold"
      : "text-gray-600";
  };

  return (
    <div className="w-full h-20 bg-white shadow-[0_2px_2px_-1px_rgba(0,0,0,0.1)] flex items-center justify-between px-6">
      <div className="text-sky-600 text-2xl font-bold">
        BIT - Venue Information Portal
      </div>
      <div className="flex space-x-6 text-xl">
        {/* Header items for general navigation */}
        <a
          href="/profile"
          className={`flex items-center text-3xl ${getActiveClass("profile")}`}
        >
          <MdPerson className="mr-2" />
        </a>
        <a
          href="/notifications"
          className={`flex items-center text-3xl ${getActiveClass(
            "notifications"
          )}`}
        >
          <MdNotifications className="mr-2" />
        </a>

        {/* Logout */}
        <a href="/logout" className="flex items-center text-red-500">
          <MdSettings className="mr-2 text-3xl" />
          Logout
        </a>
      </div>
    </div>
  );
};

export default Header;
