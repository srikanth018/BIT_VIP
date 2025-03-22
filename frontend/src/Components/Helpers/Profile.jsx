import React from "react";

function Profile() {
  // Retrieve user data from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <main className="flex justify-center items-center h-screen ">
        <div
          className={`bg-white p-8 rounded-lg shadow-2xl max-w-2xl w-full mx-4 transform transition-all duration-300 ease-in-out hover:scale-105`}
        >
          <div className="border-2 p-6 rounded-lg border-sky-500 bg-gradient-to-r from-sky-50 to-blue-50">
            {/* Profile Avatar */}
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* User Data */}
            <div className="mt-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{user?.email}</h2>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{user?.name}</h2>
              <p className="text-gray-600 mt-2 text-lg">
                <span className="font-semibold">ID:</span> {user?.id}
              </p>
              <p className="text-gray-600 mt-2 text-lg">
                <span className="font-semibold">Role:</span> {user?.role}
              </p>
              <p className="text-gray-600 mt-2 text-lg">
                <span className="font-semibold">Team:</span> {user?.team}
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Profile;