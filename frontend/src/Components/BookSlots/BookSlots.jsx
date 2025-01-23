import React from "react";

function BookSlots() {
  return (
    <>
      <main className="p-8  min-h-screen">
        <div className="w-full mx-auto bg-white shadow-md rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-cambria font-semibold text-gray-800">
              Requirements
            </h1>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter detail 1"
              className="p-3 border-2 text-lg text-sky-500 font-semibold placeholder:text-sky-500 border-sky-500  rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:shadow-sm focus:shadow-sky-300 focus:placeholder-sky-500 focus:placeholder:font-semibold focus:text-sky-600 focus:border"
            />
            <input
              type="text"
              placeholder="Enter detail 2"
              className="p-3 border-2 text-lg text-sky-500 font-semibold placeholder:text-sky-500 border-sky-500  rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:shadow-sm focus:shadow-sky-300 focus:placeholder-sky-500 focus:placeholder:font-semibold focus:text-sky-600 focus:border"
            />
            <input
              type="text"
              placeholder="Enter detail 3"
              className="p-3 border-2 text-lg text-sky-500 font-semibold placeholder:text-sky-500 border-sky-500  rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:shadow-sm focus:shadow-sky-300 focus:placeholder-sky-500 focus:placeholder:font-semibold focus:text-sky-600 focus:border"
            />
            <input
              type="text"
              placeholder="Enter detail 4"
              className="p-3 border-2 text-lg text-sky-500 font-semibold placeholder:text-sky-500 border-sky-500  rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:shadow-sm focus:shadow-sky-300 focus:placeholder-sky-500 focus:placeholder:font-semibold focus:text-sky-600 focus:border"
            />
            <input
              type="text"
              placeholder="Enter detail 4"
              className="p-3 border-2 text-lg text-sky-500 font-semibold placeholder:text-sky-500 border-sky-500  rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:shadow-sm focus:shadow-sky-300 focus:placeholder-sky-500 focus:placeholder:font-semibold focus:text-sky-600 focus:border"
            />
          </div>
        </div>
      </main>
    </>
  );
}

export default BookSlots;
