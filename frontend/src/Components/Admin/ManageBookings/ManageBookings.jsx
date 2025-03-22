import React, { useEffect, useState } from "react";

function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filters, setFilters] = useState({ date: "", room: "", status: "" });

  const FacultyId = JSON.parse(localStorage.getItem("user")).id;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/allBookings");
      if (!response.ok) {
        console.log(response);
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      setBookings(data);
      setFilteredBookings(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  useEffect(() => {
    let filtered = bookings;
    if (filters.date)
      filtered = filtered.filter((b) => b.Date.startsWith(filters.date));
    if (filters.room)
      filtered = filtered.filter((b) => b.RoomID.toLowerCase().includes(filters.room));
    if (filters.status)
      filtered = filtered.filter((b) => b.Status === filters.status);
    setFilteredBookings(filtered);
  }, [filters, bookings]);

  const handleApproval = async (id, status) => {
    try {
      await fetch(`http://localhost:8000/api/updateBooking/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Status: status,FacultyId:FacultyId }),
      });
      fetchBookings();
      handleClosePopup();
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleCardClick = (booking) => {
    setSelectedBooking(booking);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedBooking(null);
  };

  const convertTo12HrFormat = (time) => {
    const [hour, minute] = time.split(":");
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute} ${period}`;
  };

  return (
    <main className="px-6 pt-3 min-h-screen">
      <div className="flex items-center mb-4 justify-between">
        <h1 className="text-xl font-bold">Manage Bookings</h1>
        <div className="flex items-center gap-4">
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="p-2 border-2 text-lg text-sky-500 font-semibold placeholder:text-sky-500 border-sky-500 rounded-lg w-56 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:shadow-sm focus:shadow-sky-300 focus:placeholder-sky-500 focus:placeholder:font-semibold focus:text-sky-600 focus:border"
          />
          <input
            type="text"
            name="room"
            placeholder="Filter by Room"
            value={filters.room}
            onChange={handleFilterChange}
            className="p-2 border-2 text-lg text-sky-500 font-semibold placeholder:text-sky-500 border-sky-500 rounded-lg w-56 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:shadow-sm focus:shadow-sky-300 focus:placeholder-sky-500 focus:placeholder:font-semibold focus:text-sky-600 focus:border"
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="p-2 border-2 text-lg text-sky-500 font-semibold placeholder:text-sky-500 border-sky-500 rounded-lg w-56 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:shadow-sm focus:shadow-sky-300 focus:placeholder-sky-500 focus:placeholder:font-semibold focus:text-sky-600 focus:border"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-4 bg-white p-6 rounded-lg shadow-lg">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <div
              key={booking.BookingID}
              onClick={() => handleCardClick(booking)}
              className={`p-3 rounded-lg shadow-md border border-gray-300 cursor-pointer ${
                booking.Status === "Approved"
                  ? "bg-green-100 border-green-400 text-green-700"
                  : booking.Status === "Rejected"
                  ? "bg-red-100 border-red-400 text-red-600"
                  : "bg-sky-100 border-sky-400 text-sky-700"
              }`}
            >
              <p className="text-center font-bold text-lg">{booking.RoomID}</p>
              <div className="text-base font-medium mt-2">
                <p className="mt-1">{booking.FacultyName}</p>
                <p>{booking.Purpose}</p>
                <p >{booking.Date.slice(0, 10)}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sky-600 text-center w-full text-lg font-semibold">
            No bookings found.
          </p>
        )}
      </div>

      {/* Popup */}
      {showPopup && selectedBooking && (
        <div
          className={`fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50 `}
        >
          <div
            className={`bg-white p-4 rounded-lg shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ease-in-out`}
          >
            <div
              className={`border-2 p-6 rounded-lg ${
                selectedBooking.Status === "Approved"
                  ? "border-green-500"
                  : selectedBooking.Status === "Rejected"
                  ? "border-red-500"
                  : "border-sky-500"
              }`}
            >
              <h2
                className={`font-semibold py-2 ${
                  `${selectedBooking.Status}` === "Approved"
                    ? "text-green-500"
                    : `${selectedBooking.Status}` === "Rejected"
                    ? "text-red-500"
                    : "text-sky-500"
                } text-2xl text-center font-bold mb-6`}
              >
                {selectedBooking.RoomID}
              </h2>
              <table className="w-full text-gray-700">
                <tbody>
                  <tr>
                    <td className="font-semibold py-2">Faculty Name:</td>
                    <td className="py-2">{selectedBooking.FacultyName}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold py-2">Course Code:</td>
                    <td className="py-2">{selectedBooking.CourseCode}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold py-2">Date:</td>
                    <td className="py-2">
                      {selectedBooking.Date.slice(0, 10)}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold py-2">Time:</td>
                    <td className="py-2">
                      {convertTo12HrFormat(selectedBooking.FromTime)} -{" "}
                      {convertTo12HrFormat(selectedBooking.ToTime)}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold py-2">Purpose:</td>
                    <td className="py-2">{selectedBooking.Purpose}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold py-2">Resource Needs:</td>
                    <td className="py-2">{selectedBooking.ResourceNeeds}</td>
                  </tr>
                  {(selectedBooking.Status === 'Approved' || selectedBooking.Status === 'Rejected') && <tr>
                    <td className="font-semibold py-2">Status Updated By</td>
                    <td className="py-2">{selectedBooking.UpdatedBy}</td>
                  </tr>}
                  <tr>
                    <td className="font-semibold py-2">Status:</td>
                    <td
                      className={`font-semibold py-2 ${
                        `${selectedBooking.Status}` === "Approved"
                          ? "text-green-500"
                          : `${selectedBooking.Status}` === "Rejected"
                          ? "text-red-500"
                          : "text-sky-500"
                      }`}
                    >
                      {selectedBooking.Status}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-between mt-6">
              {selectedBooking.Status === "Pending" && (
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() =>
                      handleApproval(selectedBooking.BookingID, "Approved")
                    }
                    className=" px-6 py-2 bg-green-200 border border-green-500 font-semibold  text-green-600 rounded-lg hover:bg-green-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      handleApproval(selectedBooking.BookingID, "Rejected")
                    }
                    className="px-6 py-2 bg-red-200 border border-red-500 font-semibold  text-red-600 rounded-lg hover:bg-red-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Reject
                  </button>
                </div>
              )}
              <button
                onClick={handleClosePopup}
                className=" mt-6 px-6 py-2 bg-sky-200 border border-sky-500 font-semibold  text-sky-600 rounded-lg hover:bg-sky-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              >
                Close
              </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default ManageBookings;