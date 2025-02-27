import React, { useEffect, useState } from "react";

function VenueDetails({
  formValues,
  selectedBlock,
  selectedFloor,
  selectedType,
  capacity,
}) {
  const userTeam = "placement";
  // const userTeam = "others";

  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [facultyName, setFacultyName] = useState("");
  const [facultyID, setFacultyID] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [resourceNeeds, setResourceNeeds] = useState("");
  const [bookedRooms, setBookedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch booked rooms
  const fetchBookedRooms = async () => {
    const params = new URLSearchParams({
      date: formValues.date,
      fromTime: formValues.fromTime,
      toTime: formValues.toTime,
    });

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/getAllBookingIDs?${params}`
      );
      const data = await response.json();
      setBookedRooms(data.length > 0 ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available rooms
  const fetchAvailableRooms = async () => {
    try {
      const params = new URLSearchParams({
        date: formValues.date,
        fromTime: formValues.fromTime,
        toTime: formValues.toTime,
        block: selectedBlock?.value || "",
        floor: selectedFloor?.value || "",
        type: selectedType?.value || "",
        capacity: capacity || "",
        userTeam: userTeam || "",
      });

      const response = await fetch(
        `http://localhost:8000/api/available-rooms?${params}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Failed to fetch rooms.");
        setAvailableRooms([]);
        return;
      }

      const data = await response.json();
      setAvailableRooms(data);
      setErrorMessage("");
      setSelectedRooms([]);
    } catch (error) {
      console.error("Error fetching available rooms:", error);
      setErrorMessage("An error occurred while fetching rooms.");
    }
  };

  useEffect(() => {
    if (formValues.date && formValues.fromTime && formValues.toTime) {
      fetchAvailableRooms();
      fetchBookedRooms();
    }
  }, [formValues, selectedBlock, selectedFloor, selectedType, capacity]);

  // Handle room selection
  const handleRoomSelect = (room) => {
    if (selectedRooms.includes(room)) {
      setSelectedRooms(selectedRooms.filter((r) => r !== room));
    } else {
      setSelectedRooms([...selectedRooms, room]);
    }
  };

  // Handle booking slots
  const handleBookSlots = async () => {
    if (
      !facultyName ||
      !facultyID ||
      !courseCode ||
      !sessionType ||
      !resourceNeeds ||
      !formValues.date ||
      !formValues.fromTime ||
      !formValues.toTime
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (selectedRooms.length === 0) {
      setErrorMessage("Please select at least one room.");
      return;
    }

    try {
      const selectedVenues = selectedRooms.filter(
        (room) => !bookedRooms.includes(room.RoomID)
      );
      const conflictedVenues = selectedRooms.filter((room) =>
        bookedRooms.includes(room.RoomID)
      );

      // Book available rooms
      const bookingRequests = selectedVenues.map((room) => {
        const bookingDetails = {
          FacultyName: facultyName,
          FacultyID: facultyID,
          CourseCode: courseCode,
          Purpose: sessionType,
          ResourceNeeds: resourceNeeds,
          Date: formValues.date,
          FromTime: formValues.fromTime,
          ToTime: formValues.toTime,
          RoomID: room.RoomID,
          Status: "Pending",
        };

        return fetch("http://localhost:8000/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingDetails),
        }).then(async (response) => {
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              `Failed to book room ${room.RoomID}: ${
                errorData.error || "Unknown error"
              }`
            );
          }
          return response.json();
        });
      });

      // Store conflicted rooms
      const conflictRequests = conflictedVenues.map((room) => {
        const conflictDetails = {
          FacultyName: facultyName,
          FacultyID: facultyID,
          CourseCode: courseCode,
          Purpose: sessionType,
          ResourceNeeds: resourceNeeds,
          Date: formValues.date,
          FromTime: formValues.fromTime,
          ToTime: formValues.toTime,
          RoomID: room.RoomID,
          Status: "Conflict",
        };

        return fetch("http://localhost:8000/api/conflicts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(conflictDetails),
        }).then(async (response) => {
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              `Failed to store conflict for room ${room.RoomID}: ${
                errorData.error || "Unknown error"
              }`
            );
          }
          return response.json();
        });
      });

      const results = await Promise.all([...bookingRequests, ...conflictRequests]);
      console.log("Booking and conflict responses:", results);

      setSelectedRooms([]);
      setFacultyName("");
      setFacultyID("");
      setCourseCode("");
      setSessionType("");
      setResourceNeeds("");
      setShowPopup(false);
      setErrorMessage("");
    } catch (error) {
      console.error("Error booking slots or storing conflicts:", error);
      setErrorMessage(error.message || "An error occurred while processing your request.");
    }
  };

    // Group rooms by type and block
    const groupedRooms = availableRooms.reduce((acc, room) => {
      if (!acc[room.Type]) acc[room.Type] = {};
      if (!acc[room.Type][room.Block]) acc[room.Type][room.Block] = [];
      acc[room.Type][room.Block].push(room);
      return acc;
    }, {});

  // Render popup content
  const renderPopupContent = () => {
    const selectedVenues = selectedRooms.filter(
      (room) => !bookedRooms.includes(room.RoomID)
    );
    const conflictedVenues = selectedRooms.filter((room) =>
      bookedRooms.includes(room.RoomID)
    );

    return (
      <div>
        {selectedVenues.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-sky-700 border-b pb-4 font-cambria">
              Selected Venues - {selectedVenues.map((room) => room.RoomID).join(", ")}
            </h2>
            <div className="space-y-4">
                        {/* Faculty Name */}
                        <div className="flex gap-4">
                          <div className="w-1/2">
                            <label className="block text-sm text-gray-600 mb-1">
                              Faculty Name
                            </label>
                            <input
                              type="text"
                              value={facultyName}
                              onChange={(e) => setFacultyName(e.target.value)}
                              placeholder="Enter Faculty Name"
                              className="p-2 border-2 text-lg text-sky-500 font-semibold placeholder:text-gray-400 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                          </div>

                          {/* Faculty ID */}
                          <div className="w-1/2">
                            <label className="block text-sm text-gray-600 mb-1">
                              Faculty ID
                            </label>
                            <input
                              type="text"
                              value={facultyID}
                              onChange={(e) => setFacultyID(e.target.value)}
                              placeholder="Enter Faculty ID"
                              className="p-2 border-2 text-lg text-sky-500 font-semibold placeholder:text-gray-400 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                          </div>
                        </div>

                        {/* Course Code */}
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            Course Code
                          </label>
                          <input
                            type="text"
                            value={courseCode}
                            onChange={(e) => setCourseCode(e.target.value)}
                            placeholder="Enter Course Code"
                            className="p-2 border-2 text-lg text-sky-500 font-semibold placeholder:text-gray-400 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                          />
                        </div>

                        {/* Session Type */}
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            Purpose of Booking
                          </label>
                          <input
                            type="text"
                            value={sessionType}
                            onChange={(e) => setSessionType(e.target.value)}
                            placeholder="Enter the purpose of booking (e.g., Workshop, Lab slot, Academic session, etc.)"
                            className="p-2 border-2 text-lg text-sky-500 font-semibold placeholder:text-gray-400 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                          />
                        </div>

                        {/* Equipment/Resource Needs */}
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            Resource Needs
                          </label>
                          <textarea
                            rows="3"
                            value={resourceNeeds}
                            onChange={(e) => setResourceNeeds(e.target.value)}
                            placeholder="Enter any equipment or resource requirements (e.g., projectors, lab kits)"
                            className="p-2 border-2 text-lg text-sky-500 font-semibold placeholder:text-gray-400 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                          ></textarea>
                        </div>
                      </div>
          </div>
        )}

        {conflictedVenues.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 mt-4 text-sky-700 border-b pb-4 font-cambria">
              Conflicted Venues - {conflictedVenues.map((room) => room.RoomID).join(", ")}
            </h2>
            <p className="text-red-500">These rooms are already booked and will be marked as conflicts.</p>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-4">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition"
            onClick={() => setShowPopup(false)}
          >
            Cancel
          </button>
          <button
            className="bg-sky-500 font-semibold text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition"
            onClick={handleBookSlots}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-5">
      {error && <div>Error: {error}</div>}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-sky-600">Available Venues</h2>
        {selectedRooms.length > 0 && (
          <button
            className="bg-sky-500 font-semibold text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition"
            onClick={() => setShowPopup(true)}
          >
            Review and Book Slots
          </button>
        )}
      </div>

      {errorMessage ? (
        <p className="mt-2 text-red-500">{errorMessage}</p>
      ) : Object.keys(groupedRooms).length > 0 ? (
        <div className="mt-2">
          {Object.entries(groupedRooms).map(([type, blocks]) => (
            <div key={type} className="mt-4 bg-white rounded-lg shadow-md p-4 pb-6">
              <h4 className="text-lg font-bold text-gray-700">{type}</h4>
              {Object.entries(blocks).map(([block, rooms]) => (
                <div key={block} className="mt-3 ml-4">
                  <h5 className="text-base font-semibold text-gray-600">{block}</h5>
                  <ul className="mt-1 ml-4 grid grid-cols-9 gap-4 pt-3">
                    {rooms.map((room) => (
                      <li key={room.RoomID} className="text-sky-700 text-center font-semibold space-y-2">
                        <div
                          className={`p-4 rounded cursor-pointer ${
                            selectedRooms.includes(room)
                              ? "bg-green-100 text-green-700"
                              : bookedRooms.includes(room.RoomID)
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-sky-200"
                          }`}
                          onClick={() => handleRoomSelect(room)}
                        >
                          {room.RoomID} <br />
                          <small>Capacity: {room.Capacity}</small>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-gray-500">No rooms available.</p>
      )}

      {showPopup && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="bg-white p-8 rounded-lg shadow-xl w-1/3 max-w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            {renderPopupContent()}
          </div>
        </div>
      )}
    </div>
  );
}

export default VenueDetails;