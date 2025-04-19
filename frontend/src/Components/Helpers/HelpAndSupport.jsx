import React from "react";

function HelpAndSupport() {
  return (
    <main className="flex justify-center items-center h-screen ">
      <div
        className={`bg-white p-8 rounded-lg shadow-2xl max-w-2xl w-full mx-4 transform transition-all duration-300 ease-in-out hover:scale-105`}
      >
        <div className="border-2 p-6 rounded-lg border-sky-500 bg-gradient-to-r from-sky-50 to-blue-50">
          {/* Profile Avatar */}
          <div className="">
            <h1 className="text-2xl font-bold text-sky-600 mb-2">Contact : </h1>
            <div className="text-lg font-semibold text-gray-600">
              <p>Infra Team </p>
              <p>Bannari Amman Institute of Technology</p>
              <p>Sathyamangalam</p>
              <p>Erode</p>
              <p>Tamil Nadu</p>
              <p>India</p>
              <p>Pincode: 638401</p>
              <p>Phone: 04295 226 000</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default HelpAndSupport;
