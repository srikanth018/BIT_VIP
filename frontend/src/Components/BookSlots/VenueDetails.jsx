import React, { useEffect, useState } from "react";

function VenueDetails({
  formValues,
  selectedBlock,
  selectedFloor,
  selectedType,
  capacity,
}) {
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
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

    if (formValues.date && formValues.fromTime && formValues.toTime) {
      fetchAvailableRooms();
    }
  }, [formValues, selectedBlock, selectedFloor, selectedType, capacity]);

  // Find room combinations to meet capacity
  const findRoomCombinations = (rooms, requiredCapacity) => {
    const combinations = [];
    let currentCombination = [];
    let currentCapacity = 0;

    for (let room of rooms) {
      currentCombination.push(room);
      currentCapacity += room.Capacity;

      if (currentCapacity >= requiredCapacity) {
        combinations.push([...currentCombination]);
        currentCombination = [];
        currentCapacity = 0;
      }
    }

    return combinations;
  };

  const groupedRooms = Array.isArray(availableRooms)
    ? availableRooms.reduce((acc, room) => {
        if (!acc[room.Type]) {
          acc[room.Type] = {};
        }
        if (!acc[room.Type][room.Block]) {
          acc[room.Type][room.Block] = [];
        }
        acc[room.Type][room.Block].push(room);
        return acc;
      }, {})
    : {};

  const handleRoomSelect = (room) => {
    if (selectedRooms.includes(room)) {
      setSelectedRooms(selectedRooms.filter((r) => r !== room));
    } else {
      setSelectedRooms([...selectedRooms, room]);
    }
  };

  const handleBookSlots = () => {
    const bookingDetails = {
      facultyName, // Capture from the input field
      facultyID,
      courseCode,
      sessionType,
      resourceNeeds,
      recurringOption,
      rooms: selectedRooms,
    };

    // Send bookingDetails to the backend
    console.log("Booking Details:", bookingDetails);

    alert(`Booking slots for Rooms: ${bookingDetails}`);
    setSelectedRooms([]);
    setShowPopup(false);
  };

  const handleOpenPopup = () => {
    if (selectedRooms.length > 0) {
      setShowPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="mt-5">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-sky-600">Available Venues</h2>
        {selectedRooms.length > 0 && (
          <button
            className=" bg-sky-500 font-semibold text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition"
            onClick={handleOpenPopup}
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
            <div
              key={type}
              className="mt-4 bg-white rounded-lg shadow-md p-4 pb-6"
            >
              <h4 className="text-lg font-bold text-gray-700">{type}</h4>
              {Object.entries(blocks).map(([block, rooms]) => {
                findRoomCombinations(rooms, capacity); // For possible future use
                return (
                  <div key={block} className="mt-3 ml-4">
                    <h5 className="text-base font-semibold text-gray-600">
                      {block}
                    </h5>
                    <ul className="mt-1 ml-4 grid grid-cols-9 gap-4 pt-3">
                      {rooms.map((room) => (
                        <li
                          key={room.RoomID}
                          className="text-sky-700 text-center font-semibold space-y-2"
                        >
                          <div
                            className={` p-4 rounded cursor-pointer ${
                              selectedRooms.includes(room)
                                ? "bg-green-200 text-green-700"
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
                );
              })}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-gray-500">No rooms available.</p>
      )}

      {/* Popup */}
      {showPopup && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleClosePopup}
        >
          <div
            className="bg-white p-8 rounded-lg shadow-xl w-1/3 max-w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6 text-sky-700 border-b pb-4 font-cambria">
              Selected Venues -{" "}
              {selectedRooms.map((room) => room.RoomID).join(", ")}
            </h2>

            {/* Form Inputs */}
            <div className="space-y-4">
              {/* Faculty Name */}
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm text-gray-600 mb-1">
                    Faculty Name
                  </label>
                  <input
                    type="text"
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
                  placeholder="Enter the purpose of booking (e.g., Workshop,Lab slot, Academic session, etc.)"
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
                  placeholder="Enter any equipment or resource requirements (e.g., projectors, lab kits)"
                  className="p-2 border-2 text-lg text-sky-500 font-semibold placeholder:text-gray-400 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                ></textarea>
              </div>

              {/* Recurring Options */}
              {/* <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Recurring Options
                </label>
                <select className="p-2 border-2 text-lg text-sky-500 font-semibold rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-sky-500">
                  <option value="">Select Recurring Option</option>
                  <option value="none">None</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="custom">Custom</option>
                </select>
              </div> */}
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-4">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition"
                onClick={handleClosePopup}
              >
                Cancel
              </button>
              <button
                className="bg-sky-500 font-semibold text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition"
                onClick={handleBookSlots}
              >
                Book Slots
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VenueDetails;
