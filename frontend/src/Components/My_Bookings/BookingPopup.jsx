import React from "react";

const BookingPopup = ({ booking, onClose, isClosing }) => {
  const convertTo12HrFormat = (time) => {
    const [hour, minute] = time.split(":");
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute} ${period}`;
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50 ${
        isClosing ? "animate-fadeOut" : "animate-fadeIn"
      }`}
    >
      <div
        className={`bg-white p-4 rounded-lg shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ease-in-out ${
          isClosing ? "animate-slideOut" : "animate-slideIn"
        }`}
      >
        <div
          className={`border-2 p-6 rounded-lg ${
            booking.Status === "Approved"
              ? "border-green-500"
              : booking.Status === "Rejected"
              ? "border-red-500"
              : "border-sky-500"
          }`}
        >
          <h2 className={`font-semibold py-2 ${
                    `${booking.Status}` === "Approved"
                        ? "text-green-500"
                        : `${booking.Status}` === "Rejected"
                        ? "text-red-500"
                        : "text-sky-500"

                } text-2xl text-center font-bold mb-6`}>
            {booking.RoomID}
          </h2>
          <table className="w-full text-gray-700">
            <tbody>
              <tr>
                <td className="font-semibold py-2">Faculty Name:</td>
                <td className="py-2">{booking.FacultyName}</td>
              </tr>
              <tr>
                <td className="font-semibold py-2">Course Code:</td>
                <td className="py-2">{booking.CourseCode}</td>
              </tr>
              <tr>
                <td className="font-semibold py-2">Date:</td>
                <td className="py-2">{booking.Date.slice(0, 10)}</td>
              </tr>
              <tr>
                <td className="font-semibold py-2">Time:</td>
                <td className="py-2">
                  {convertTo12HrFormat(booking.FromTime)} -{" "}
                  {convertTo12HrFormat(booking.ToTime)}
                </td>
              </tr>
              <tr>
                <td className="font-semibold py-2">Purpose:</td>
                <td className="py-2">{booking.Purpose}</td>
              </tr>
              <tr>
                <td className="font-semibold py-2">Resource Needs:</td>
                <td className="py-2">{booking.ResourceNeeds}</td>
              </tr>

              <tr>
                <td className="font-semibold py-2">Status:</td>
                <td className={`font-semibold py-2 ${
                    `${booking.Status}` === "Approved"
                        ? "text-green-500"
                        : `${booking.Status}` === "Rejected"
                        ? "text-red-500"
                        : "text-sky-500"

                }`}>{booking.Status}</td>
              </tr>
            </tbody>
          </table>
          <button
            onClick={onClose}
            className=" mt-6 px-6 py-2 bg-red-200 border border-red-500 font-semibold  text-red-600 rounded-lg hover:bg-red-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPopup;