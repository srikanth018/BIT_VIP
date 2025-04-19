import { useEffect, useState } from "react";
import { AiFillBook, AiOutlineGoogle } from "react-icons/ai";
import {
  FaBox,
  FaClipboardList,
  FaRegChartBar,
  FaUsers,
  FaWrench,
} from "react-icons/fa";
import { MdDashboard, MdPerson, MdSettings } from "react-icons/md";
import { useLocation } from "react-router-dom";

const Sidebar = ({ userRole }) => {
  const location = useLocation();
  const [active, setActive] = useState("");
  const [activeSubTask, setActiveSubTask] = useState("");
  

  

  useEffect(() => {
    const path = location.pathname;

    if (path === "/dashboard") {
      setActive("dashboard");
      
    } else if (path.startsWith("/profile")) {
      setActive("profile");
    } else if (path.startsWith("/notifications")) {
      setActive("notifications");
    } else if (path.startsWith("/settings")) {
      setActive("settings");
    } else if (path.startsWith("/manage-bookings")) {
      setActive("manage-bookings");
    } else if (path.startsWith("/manage-rooms")) {
      setActive("manage-rooms");
    } else if (path.startsWith("/conflict-resolution")) {
      setActive("conflict-resolution");
    } else if (path.startsWith("/reports")) {
      setActive("reports");
    } else if (path.startsWith("/user-management")) {
      setActive("user-management");
    } else if (path.startsWith("/book-slot")) {
      setActive("book-slot");
    } else if (path.startsWith("/my-bookings")) {
      setActive("my-bookings");
    } else if (path.startsWith("/resource-requests")) {
      setActive("resource-requests");
    } else if (path.startsWith("/help")) {
      setActive("help");
    } else if (path.startsWith("/logout")) {
      setActive("logout");
    }
  }, [location]);

  // Get active class based on the route
  const getActiveClass = (name) => {
    return active === name ? "bg-sky-100 text-sky-600" : "text-gray-600";
  };

  return (
    <div className="w-80  bg-white text-black ">
      <div className="p-4 my-2 text-center font-bold text-2xl text-sky-600">
        BIT-VIP
      </div>
      <div className="px-4 text-lg font-semibold space-y-4">
        <div className="space-y-4">
          <a
            href="/dashboard"
            className={`block py-2 px-4 rounded ${getActiveClass("dashboard")}`}
          >
            <div className="flex items-center">
              <MdDashboard className="mr-3" />
              Dashboard
            </div>
          </a>
        </div>
        {/* Admin-Specific Components */}
        {userRole === "admin" && (
          <div className="space-y-4">
            <a
              href="/manage-bookings"
              className={`block py-2 px-4 rounded ${getActiveClass(
                "manage-bookings"
              )}`}
            >
              <div className="flex items-center">
                <FaClipboardList className="mr-3" />
                Manage Bookings
              </div>
            </a>
            <a
              href="/manage-rooms"
              className={`block py-2 px-4 rounded ${getActiveClass(
                "manage-rooms"
              )}`}
            >
              <div className="flex items-center">
                <FaBox className="mr-3" />
                Room & Lab Management
              </div>
            </a>
            <a
              href="/conflict-resolution"
              className={`block py-2 px-4 rounded ${getActiveClass(
                "conflict-resolution"
              )}`}
            >
              <div className="flex items-center">
                <FaWrench className="mr-3" />
                Conflict Resolution
              </div>
            </a>
            <a
              href="/reports"
              className={`block py-2 px-4 rounded ${getActiveClass("reports")}`}
            >
              <div className="flex items-center">
                <FaRegChartBar className="mr-3" />
                Reports & Analytics
              </div>
            </a>
            <a
              href="/user-management"
              className={`block py-2 px-4 rounded ${getActiveClass(
                "user-management"
              )}`}
            >
              <div className="flex items-center">
                <FaUsers className="mr-3" />
                User Management
              </div>
            </a>
          </div>
        )}

        {/* Faculty-Specific Components */}
        {userRole === "faculty" && (
          <div className="space-y-4">
            <a
              href="/book-slot"
              className={`block py-2 px-4 rounded ${getActiveClass(
                "book-slot"
              )}`}
            >
              <div className="flex items-center">
                <AiFillBook className="mr-3" />
                Book a Slot
              </div>
            </a>
            <a
              href="/my-bookings"
              className={`block py-2 px-4 rounded ${getActiveClass(
                "my-bookings"
              )}`}
            >
              <div className="flex items-center">
                <FaClipboardList className="mr-3" />
                My Bookings
              </div>
            </a>
            {/* <a
              href="/resource-requests"
              className={`block py-2 px-4 rounded ${getActiveClass(
                "resource-requests"
              )}`}
            >
              <div className="flex items-center">
                <FaWrench className="mr-3" />
                Resource Requests
              </div>
            </a> */}
          </div>
        )}

        {/* General Components */}
        <div className="space-y-4">
          <a
            href="/profile"
            className={`block py-2 px-4 rounded ${getActiveClass("profile")}`}
          >
            <div className="flex items-center">
              <MdPerson className="mr-3" />
              My Profile
            </div>
          </a>
          {/* <a
            href="/notifications"
            className={`block py-2 px-4 rounded ${getActiveClass(
              "notifications"
            )}`}
          >
            <div className="flex items-center">
              <MdNotifications className="mr-3" />
              Notifications
            </div>
          </a> */}
        </div>

        {/* Optional Components moved to the end */}
        <div className="mt-auto space-y-4">
          <a
            href="/help"
            className={`block py-2 px-4 rounded ${getActiveClass("help")}`}
          >
            <div className="flex items-center">
              <AiOutlineGoogle className="mr-3" />
              Help & Support
            </div>
          </a>
          <a
            href="/logout-page"
            className={`block py-2 px-4 rounded ${getActiveClass("logout")}`}
          >
            <div className="flex items-center">
              <MdSettings className="mr-3" />
              Logout
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
