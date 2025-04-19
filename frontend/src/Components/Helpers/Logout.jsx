import React from 'react'
import { useNavigate } from "react-router-dom";


function Logout() {

    const navigate = useNavigate();

    const handleLogout = () => {
      // Clear user data from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
  
      // Redirect to the login page
      navigate("/");
    };
  return (
    <main className="flex justify-center items-center h-screen ">
      <div
        className={`bg-white p-8 rounded-lg shadow-2xl max-w-2xl w-full mx-4 transform transition-all duration-300 ease-in-out hover:scale-105`}
      >
        <div className="border-2 p-6 rounded-lg border-red-500 bg-gradient-to-r from-red-50 to-red-50">
          {/* Profile Avatar */}
         <a
                  href="/logout"
                  className="flex items-center justify-center font-bold text-3xl text-red-500"
                  onClick={handleLogout}
                >
                  Logout
                </a>
        </div>
      </div>
    </main>
  )
}

export default Logout
