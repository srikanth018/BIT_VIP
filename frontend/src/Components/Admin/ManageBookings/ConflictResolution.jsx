import React, { useEffect, useState } from "react";

function ConflictResolution() {
  const [conflicts, setConflicts] = useState([]);
  const [filteredConflicts, setFilteredConflicts] = useState([]);
  const [filters, setFilters] = useState({ date: "", room: "", status: "" });
  const [conflictingBookings, setConflictingBookings] = useState([]);
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchConflicts();
  }, []);

  const fetchConflicts = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/conflicts");
      if (!response.ok) {
        throw new Error("Failed to fetch conflicts");
      }
      const data = await response.json();
      setConflicts(data);
      setFilteredConflicts(data);
    } catch (error) {
      console.error("Error fetching conflicts:", error);
    }
  };

  const fetchConflictingBookings = async (conflict) => {
    try {
      const params = new URLSearchParams({
        date: conflict.Date,
        fromTime: conflict.FromTime,
        toTime: conflict.ToTime,
      });

      const bookingIdsResponse = await fetch(
        `http://localhost:8000/api/getAllBookingIDsForConflict?${params}`
      );
      if (!bookingIdsResponse.ok) {
        throw new Error("Failed to fetch conflicting booking IDs");
      }

      const bookingIds = await bookingIdsResponse.json();
      console.log(bookingIds);

      // Extract only the BookingID values
      const bookingIdList = bookingIds
        .map((booking) =>
          booking.RoomID === conflict.RoomID ? booking.BookingID : null
        )
        .filter((id) => id !== null);
      console.log(bookingIdList);
      const bookingsDetails = [];
      for (const id of bookingIdList) {
        try {
          const response = await fetch(
            `http://localhost:8000/api/getBookingByBookedId/${id}`
          );
          if (response.ok) {
            bookingsDetails.push(await response.json());
          }
        } catch (err) {
          console.error(`Failed to fetch booking details for ID: ${id}`, err);
        }
      }

      setConflictingBookings(bookingsDetails);
    } catch (error) {
      console.error("Error fetching conflicting bookings:", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  useEffect(() => {
    let filtered = conflicts.filter((conflict) => {
      return (
        (!filters.date || conflict.Date.startsWith(filters.date)) &&
        (!filters.room ||
          conflict.RoomID.toLowerCase().includes(filters.room.toLowerCase())) &&
        (!filters.status || conflict.Status === filters.status)
      );
    });
    setFilteredConflicts(filtered);
  }, [filters, conflicts]);

  const handleCardClick = async (conflict) => {
    setSelectedConflict(conflict);
    await fetchConflictingBookings(conflict);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedConflict(null);
    setConflictingBookings([]);
  };

  const convertTo12HrFormat = (time) => {
    const [hour, minute] = time.split(":");
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute} ${period}`;
  };

  const handleResolveConflict = async (conflictId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/conflicts/${conflictId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Status: "Resolved" }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to resolve conflict");
      }

      fetchConflicts();
      handleClosePopup();
    } catch (error) {
      console.error("Error resolving conflict:", error);
    }
  };


  return (
    <main className="px-6 pt-3 min-h-screen">
      <div className="flex items-center mb-4 justify-between">
        <h1 className="text-xl font-bold">Conflict Resolution</h1>
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
            <option value="Conflict">Conflict</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>
      <div className="flex flex-wrap gap-6 bg-white p-6 rounded-lg shadow-lg">
        {filteredConflicts.length > 0 ? (
          filteredConflicts.map((conflict) => (
            <div
              key={conflict.ConflictID}
              onClick={() => handleCardClick(conflict)}
              className={`p-3 rounded-lg w-[calc(20%-16px)] min-w-[200px] shadow-md border border-gray-300 cursor-pointer ${
                conflict.Status === "Resolved"
                  ? "bg-green-100 border-green-400 text-green-700"
                  : "bg-red-100 border-red-400 text-red-600"
              }`}
            >
              <p className="text-center font-bold text-lg">{conflict.RoomID}</p>
              <div className="text-base font-medium mt-2">
                <p className="mt-1">{conflict.FacultyName}</p>
                <p>{conflict.Purpose}</p>
                <p>{conflict.Date.slice(0, 10)}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sky-600 text-center w-full text-lg font-semibold">
            No conflicts found.
          </p>
        )}
      </div>

      {showPopup && selectedConflict && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-4xl w-full mx-4 transform transition-all duration-300 ease-in-out">
            <h1 className="text-3xl text-sky-600 font-semibold font-cambria text-center mb-6">
              {selectedConflict.RoomID}
            </h1>
            <div className="flex gap-8">
              <div className="w-1/2">
                <h2
                  className={`font-semibold py-2 ${
                    selectedConflict.Status === "Resolved"
                      ? "text-green-500"
                      : "text-red-500"
                  } text-2xl text-center font-bold mb-6`}
                >
                  Selected Conflict
                </h2>
                <div
                  className={`bg-gray-100 p-4 rounded-lg mb-4 
                `}
                  
                >
                  <table className="w-full text-gray-700">
                    <tbody>
                      <tr>
                        <td className="font-semibold py-2">Faculty Name:</td>
                        <td className="py-2">{selectedConflict.FacultyName}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold py-2">Room ID</td>
                        <td className="py-2">{selectedConflict.RoomID}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold py-2">Course Code:</td>
                        <td className="py-2">{selectedConflict.CourseCode}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold py-2">Date:</td>
                        <td className="py-2">
                          {selectedConflict.Date.slice(0, 10)}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-semibold py-2">Time:</td>
                        <td className="py-2">
                          {convertTo12HrFormat(selectedConflict.FromTime)} -{" "}
                          {convertTo12HrFormat(selectedConflict.ToTime)}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-semibold py-2">Purpose:</td>
                        <td className="py-2">{selectedConflict.Purpose}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold py-2">Resource Needs:</td>
                        <td className="py-2">
                          {selectedConflict.ResourceNeeds}
                        </td>
                      </tr>
                      {(selectedConflict.Status === 'Approved' || selectedConflict.Status === 'Rejected') && <tr>
                        <td className="font-semibold py-2">
                          Status Updated By
                        </td>
                        <td className="py-2">{selectedConflict.UpdatedBy}</td>
                      </tr>}
                      <tr>
                        <td className="font-semibold py-2">Status:</td>
                        <td
                          className={`font-semibold py-2 ${
                            selectedConflict.Status === "Resolved"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {selectedConflict.Status}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="w-1/2">
                <h2 className="font-semibold py-2 text-2xl text-center mb-6 text-sky-500">
                  Conflicting Bookings
                </h2>
                {conflictingBookings.length > 0 ? (
                  conflictingBookings.map((booking) => (
                    <div
                      key={booking.BookingID}
                      className={`bg-gray-100 p-4 rounded-lg mb-4 
                      
                      `}
                      
                    >
                      <table className="w-full text-gray-700">
                        <tbody>
                          <tr>
                            <td className="font-semibold py-2">
                              Faculty Name:
                            </td>
                            <td className="py-2">{booking.FacultyName}</td>
                          </tr>
                          <tr>
                        <td className="font-semibold py-2">Room ID</td>
                        <td className="py-2">{booking.RoomID}</td>
                      </tr>
                          <tr>
                            <td className="font-semibold py-2">Course Code:</td>
                            <td className="py-2">{booking.CourseCode}</td>
                          </tr>
                          <tr>
                            <td className="font-semibold py-2">Date:</td>
                            <td className="py-2">
                              {booking.Date.slice(0, 10)}
                            </td>
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
                            <td className="font-semibold py-2">
                              Resource Needs:
                            </td>
                            <td className="py-2">{booking.ResourceNeeds}</td>
                          </tr>
                          {(booking.Status === 'Approved' || booking.Status === 'Rejected') && <tr>
                            <td className="font-semibold py-2">
                              Status Updated By
                            </td>
                            <td className="py-2">{booking.UpdatedBy }</td>
                          </tr>}
                          <tr>
                            <td className="font-semibold py-2">Status:</td>
                            <td className="py-2 text-red-500 font-semibold">
                              {booking.Status}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">
                    No conflicting bookings found.
                  </p>
                )}
              </div>
            </div>

            {selectedConflict.Status === "Conflict" && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={() =>
                    handleResolveConflict(selectedConflict.ConflictID)
                  }
                  className="px-6 py-2 bg-green-200 border border-green-500 font-semibold text-green-600 rounded-lg hover:bg-green-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Resolve Conflict
                </button>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={handleClosePopup}
                className="px-6 py-2 bg-sky-200 border border-sky-500 font-semibold text-sky-600 rounded-lg hover:bg-sky-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default ConflictResolution;
