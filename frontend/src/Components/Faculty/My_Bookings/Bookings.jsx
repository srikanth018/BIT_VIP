import React, { useEffect, useState } from "react";
import BookingPopup from "./BookingPopup"; // Import the popup component

function Bookings() {
  const facultyID = "CS124";
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    fetchAllBookings();
  }, [facultyID]);

  const fetchAllBookings = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/bookingsByID/${facultyID}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      const data = await response.json();
      setBookings(data);
      setSelectedDate(""); // Reset the date filter
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (booking) => {
    setSelectedBooking(booking);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowPopup(false);
      setIsClosing(false);
      setSelectedBooking(null);
    }, 300);
  };

  const handleDateChange = async (e) => {
    setSelectedDate(e.target.value);
    const response = await fetch(
      `http://localhost:8000/api/bookingsByDate/${facultyID}?date=${e.target.value}`
    );
    if (response.ok) {
      const data = await response.json();
      setBookings(data);
    }
  };

  const handleRemoveFilter = async () => {
    setSelectedDate(""); // Reset the date filter
    fetchAllBookings(); // Fetch all bookings
  };

  if (isLoading) {
    return <p className="text-center mt-6">Loading...</p>;
  }

  if (error) {
    return <p className="text-center mt-6 text-red-600">Error: {error}</p>;
  }

  const convertTo12HrFormat = (time) => {
    const [hour, minute] = time.split(":");
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute} ${period}`;
  };

  return (
    <main className="px-6 pt-3 min-h-screen">
      <div className="flex items-center mb-4 justify-between">
        <h1 className="text-xl font-bold">Bookings</h1>
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className={`p-2 border-2 text-lg text-sky-500 font-semibold placeholder:text-sky-500 border-sky-500 rounded-lg w-56 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:shadow-sm focus:shadow-sky-300 focus:placeholder-sky-500 focus:placeholder:font-semibold focus:text-sky-600 focus:border`}
          />
          {selectedDate && (
            <button
              onClick={handleRemoveFilter}
              className="px-4 py-2 bg-sky-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Remove Filter
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-6 bg-white p-6 rounded-lg shadow-lg">
        {bookings.length > 0 ? (
          bookings.map((booking, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(booking)}
              className={`p-3 rounded-lg w-[calc(20%-16px)] min-w-[200px] shadow-md border border-gray-300 cursor-pointer ${
                booking.Status === "Approved"
                  ? "bg-green-100 border-green-400 text-green-700"
                  : booking.Status === "Rejected"
                  ? "bg-red-100 border-red-400 text-red-600"
                  : "bg-sky-100 border-sky-400 text-sky-700"
              }`}
            >
              <p className="text-center font-bold text-lg">{booking.RoomID}</p>
              <div className="text-base font-medium mt-2">
                <p>{booking.Purpose}</p>
                <p className="mt-1">{booking.Date.slice(0, 10)}</p>
                <p>
                  {convertTo12HrFormat(booking.FromTime)} -{" "}
                  {convertTo12HrFormat(booking.ToTime)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sky-600 text-center w-full text-lg font-semibold">No bookings found.</p>
        )}
      </div>

      {/* Popup */}
      {showPopup && selectedBooking && (
        <BookingPopup
          booking={selectedBooking}
          onClose={handleClosePopup}
          isClosing={isClosing}
        />
      )}
    </main>
  );
}

export default Bookings;