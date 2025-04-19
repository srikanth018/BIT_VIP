import React, { useEffect, useState } from "react";
import axios from "axios";

function ConflictResolution() {
  const [conflicts, setConflicts] = useState([]);
  const [filteredConflicts, setFilteredConflicts] = useState([]);
  const [filters, setFilters] = useState({ date: "", room: "", status: "" });
  const [conflictingBookings, setConflictingBookings] = useState([]);
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [editMode, setEditMode] = useState({
    selectedConflict: false,
    conflictingBookingId: null,
  });

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
      const bookingIdList = bookingIds
        .map((booking) =>
          booking.RoomID === conflict.RoomID ? booking.BookingID : null
        )
        .filter((id) => id !== null);

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
    console.log(conflict, "jhgkjj");
    await fetchConflictingBookings(conflict);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedConflict(null);
    setConflictingBookings([]);
  };

  const toggleEditMode = (section, bookingId = null) => {
    setEditMode({
      selectedConflict:
        section === "selectedConflict" ? !editMode.selectedConflict : false,
      conflictingBookingId: section === "conflictingBooking" ? bookingId : null,
    });
  };

  const [editedValues, setEditedValues] = useState({});

  const handleResolveConflict = async (conflictId) => {
    try {
      // Prepare the data to send
      const resolveData = {
        selectedConflict,
        conflictingBookings,
      };

      // Call the resolve endpoint
      const response = await axios.post(
        `http://localhost:8000/api/conflicts/${conflictId}/resolve`,
        resolveData
      );

      if (response.status === 200) {
        alert("Conflict resolved successfully!");
        handleClosePopup(); // Close the popup
      }
    } catch (error) {
      console.error("Error resolving conflict:", error);
      alert("Failed to resolve conflict.");
    }
  };
  const handleSaveSelectedConflict = async () => {
    try {
      // Prepare the updated data
      const updatedConflict = {
        ...selectedConflict,
        ...editedValues.selectedConflict,
      };

      // Call the update endpoint
      const response = await axios.put(
        `http://localhost:8000/api/conflicts/${selectedConflict.id}`,
        updatedConflict
      );

      if (response.status === 200) {
        // Update the local state with the new data
        setSelectedConflict(updatedConflict);
        toggleEditMode("selectedConflict"); // Exit edit mode
        alert("Conflict updated successfully!");
      }
    } catch (error) {
      console.error("Error updating conflict:", error);
      alert("Failed to update conflict.");
    }
  };

  const handleSaveConflictingBooking = async (bookingId) => {
    try {
      // Prepare the updated data
      const updatedBooking = {
        ...conflictingBookings.find((b) => b.BookingID === bookingId),
        ...editedValues.conflictingBookings?.[bookingId],
      };

      // Call the update endpoint
      const response = await axios.put(
        `http://localhost:8000/api/bookings/${bookingId}`,
        updatedBooking
      );

      if (response.status === 200) {
        // Update the local state with the new data
        const updatedBookings = conflictingBookings.map((b) =>
          b.BookingID === bookingId ? updatedBooking : b
        );
        setConflictingBookings(updatedBookings);
        toggleEditMode("conflictingBooking", null); // Exit edit mode
        alert("Booking updated successfully!");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update booking.");
    }
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
          {/* Scrollable container */}
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out">
            <h1 className="text-3xl text-sky-600 font-semibold font-cambria text-center mb-6">
              {selectedConflict.RoomID}
            </h1>

            {/* Flex container for the two sections */}
            <div className="flex gap-8">
              {/* Selected Conflict Section */}
              <div className="w-1/2">
                <div className="flex justify-between items-center">
                  <h2
                    className={`font-semibold py-2 ${
                      selectedConflict.Status === "Resolved"
                        ? "text-green-500"
                        : "text-red-500"
                    } text-2xl text-center font-bold mb-6`}
                  >
                    Selected Conflict
                  </h2>
                </div>
                <div className={`bg-gray-100 p-4 rounded-lg mb-4`}>
                  <button
                    onClick={() => toggleEditMode("selectedConflict")}
                    className="text-gray-500 hover:text-gray-700 float-right"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                  <table className="w-full text-gray-700">
                    <tbody>
                      {Object.entries(selectedConflict).map(([key, value]) => (
                        <tr key={key}>
                          <td className="font-semibold py-2">{key}:</td>
                          <td className="py-2">
                            {editMode.selectedConflict ? (
                              <input
                                type="text"
                                defaultValue={value}
                                className="w-full px-2 py-1 border rounded"
                                onChange={(e) =>
                                  setEditedValues((prev) => ({
                                    ...prev,
                                    selectedConflict: {
                                      ...prev.selectedConflict,
                                      [key]: e.target.value,
                                    },
                                  }))
                                }
                              />
                            ) : (
                              value
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {editMode.selectedConflict && (
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleSaveSelectedConflict}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditedValues({}); // Reset edited values
                        toggleEditMode("selectedConflict");
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Conflicting Bookings Section */}
              <div className="w-1/2">
                <h2 className="font-semibold py-2 text-2xl text-center mb-6 text-sky-500">
                  Conflicting Bookings
                </h2>
                {conflictingBookings.length > 0 ? (
                  conflictingBookings.map((booking) => (
                    <div
                      key={booking.BookingID}
                      className={`bg-gray-100 p-4 rounded-lg mb-4`}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">
                          Booking ID: {booking.BookingID}
                        </h3>
                        <button
                          onClick={() =>
                            toggleEditMode(
                              "conflictingBooking",
                              booking.BookingID
                            )
                          }
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                      </div>
                      <table className="w-full text-gray-700">
                        <tbody>
                          {Object.entries(booking).map(([key, value]) => (
                            <tr key={key}>
                              <td className="font-semibold py-2">{key}:</td>
                              <td className="py-2">
                                {editMode.conflictingBookingId ===
                                booking.BookingID ? (
                                  <input
                                    type="text"
                                    defaultValue={value}
                                    className="w-full px-2 py-1 border rounded"
                                    onChange={(e) =>
                                      setEditedValues((prev) => ({
                                        ...prev,
                                        conflictingBookings: {
                                          ...prev.conflictingBookings,
                                          [booking.BookingID]: {
                                            ...prev.conflictingBookings?.[
                                              booking.BookingID
                                            ],
                                            [key]: e.target.value,
                                          },
                                        },
                                      }))
                                    }
                                  />
                                ) : (
                                  value
                                )}
                              </td>
                            </tr>
                          ))}
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

            {editMode.conflictingBookingId && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={() =>
                    handleSaveConflictingBooking(editMode.conflictingBookingId)
                  }
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditedValues({}); // Reset edited values
                    toggleEditMode("conflictingBooking", null);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                >
                  Cancel
                </button>
              </div>
            )}

            {selectedConflict.Status === "Conflict" && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => handleResolveConflict(selectedConflict.id)}
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
