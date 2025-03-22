import React, { useEffect, useState } from "react";
import Select from "react-select";
import EditRooms from "./EditRooms";
import AddRoom from "./AddRoom";

function ManageRooms() {
  const [rooms, setRooms] = useState([]); // State to store all rooms
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [selectedRoom, setSelectedRoom] = useState(null); // State to store the selected room
  const [showAddRoomForm, setShowAddRoomForm] = useState(false);

  // State for filters
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [capacity, setCapacity] = useState("");

  // Fetch all rooms from the API
  const fetchRooms = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/rooms"); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }
      const data = await response.json();
      setRooms(data); // Set the fetched rooms to state
    } catch (error) {
      setError(error.message); // Set error message if something goes wrong
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  // Fetch rooms on component mount
  useEffect(() => {
    fetchRooms();
  }, []);

  // Filter rooms based on selected criteria
  const filteredRooms = rooms.filter((room) => {
    return (
      (!selectedBlock || room.Block === selectedBlock.value) &&
      (!selectedType || room.Type === selectedType.value) &&
      (!selectedFloor || room.Floor === selectedFloor.value) &&
      (!capacity || room.Capacity >= parseInt(capacity))
    );
  });

  // Options for dropdowns with "Choose" option
  const blockOptions = [
    { value: null, label: "Default" },
    ...Array.from(new Set(rooms.map((room) => room.Block))).map((block) => ({
      value: block,
      label: block,
    })),
  ];

  const typeOptions = [
    { value: null, label: "Default" },
    ...Array.from(new Set(rooms.map((room) => room.Type))).map((type) => ({
      value: type,
      label: type,
    })),
  ];

  const floorOptions = [
    { value: null, label: "Default" },
    ...Array.from(new Set(rooms.map((room) => room.Floor))).map((floor) => ({
      value: floor,
      label: floor,
    })),
  ];

  // Handle filter change for dropdowns
  const handleBlockChange = (selectedOption) => {
    setSelectedBlock(selectedOption?.value ? selectedOption : null);
  };

  const handleTypeChange = (selectedOption) => {
    setSelectedType(selectedOption?.value ? selectedOption : null);
  };

  const handleFloorChange = (selectedOption) => {
    setSelectedFloor(selectedOption?.value ? selectedOption : null);
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room); // Set the selected room
  };

  const handleSave = async (updatedRoom) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/rooms/${updatedRoom.RoomID}`, // Use RoomID instead of _id
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedRoom),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update room");
      }

      const data = await response.json();
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.RoomID === data.room.RoomID ? data.room : room
        )
      );
      setSelectedRoom(null); // Close the popup
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };

  const handleDelete = async (roomId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/rooms/${roomId}`, {
        method: "DELETE", // Use the DELETE HTTP method
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete room");
      }
  
      const data = await response.json();
      console.log("Room deleted successfully:", data);
  
      // Update the UI to reflect the deletion
      setRooms((prevRooms) => prevRooms.filter((room) => room.RoomID !== roomId));
      setSelectedRoom(null); // Close the edit modal
    } catch (error) {
      console.error("Error deleting room:", error.message);
    }
  };

  const handleAddRoom = async (newRoom) => {
    try {
      const response = await fetch("http://localhost:8000/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRoom),
      });

      if (!response.ok) {
        throw new Error("Failed to create room");
      }

      const data = await response.json();
      setRooms((prevRooms) => [...prevRooms, data.room]); // Add the new room to the list
      setShowAddRoomForm(false); // Close the form
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };
  // Render loading state
  if (loading) {
    return <div>Loading rooms...</div>;
  }

  // Render error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      padding: "3px",
      fontSize: "1.125rem",
      borderWidth: "2px",
      borderColor: state.isFocused ? "#0ea5e9" : "#38bdf8",
      boxShadow: state.isFocused
        ? "0 0 4px 2px rgba(14, 165, 233, 0.3)"
        : "none",
      "&:hover": { borderColor: "#0ea5e9" },
      borderRadius: "8px",
      width: "100%",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#0ea5e9",
      fontSize: "15px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#0284c7",
      fontWeight: "600",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 20,
    }),
  };

  return (
    <main className="px-6 pt-3 min-h-screen">
        <div className="flex justify-between items-center   ">
        <h1 className="text-2xl font-bold">Manage venues</h1>
        <button
          onClick={() => setShowAddRoomForm(true)}
          className="mt-4 px-6 py-2 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
        >
          Create New Room
        </button>
        </div>
      <div className="my-5">
        {/* Filter UI */}
        <div className="flex flex-col md:flex-row gap-4 mt-4 bg-white p-4 rounded-lg shadow-md">
          <div className="w-full">
            <label className="block text-sm text-gray-600 mb-1">
              Room Block (Optional)
            </label>
            <Select
              options={blockOptions}
              value={selectedBlock}
              onChange={handleBlockChange}
              placeholder="Select Block"
              styles={customStyles}
            />
          </div>
          <div className="w-full">
            <label className="block text-sm text-gray-600 mb-1">
              Type (Optional)
            </label>
            <Select
              options={typeOptions}
              value={selectedType}
              onChange={handleTypeChange}
              placeholder="Select Type"
              styles={customStyles}
            />
          </div>
          <div className="w-full">
            <label className="block text-sm text-gray-600 mb-1">
              Floor (Optional)
            </label>
            <Select
              options={floorOptions}
              value={selectedFloor}
              onChange={handleFloorChange}
              placeholder="Select Floor"
              styles={customStyles}
            />
          </div>
          <div className="w-full">
            <label className="block text-sm text-gray-600 mb-1">
              Capacity (Optional)
            </label>
            <input
              type="number"
              placeholder="Enter Capacity"
              className="p-2 border-2 text-lg text-sky-500 font-semibold placeholder:text-sky-500 placeholder:text-base placeholder:font-normal border-sky-500 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:shadow-sm focus:shadow-sky-300 focus:placeholder-sky-500 focus:placeholder:font-semibold focus:text-sky-600 focus:border"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
          </div>
        </div>
       
        {/* Display filtered rooms */}
        {filteredRooms.length > 0 ? (
          <div className="mt-2">
            {Object.entries(
              filteredRooms.reduce((acc, room) => {
                if (!acc[room.Type]) acc[room.Type] = {};
                if (!acc[room.Type][room.Block])
                  acc[room.Type][room.Block] = [];
                acc[room.Type][room.Block].push(room);
                return acc;
              }, {})
            ).map(([type, blocks]) => (
              <div
                key={type}
                className="mt-4 bg-white rounded-lg shadow-md p-4 pb-6"
              >
                <h4 className="text-lg font-bold text-gray-700">{type}</h4>
                {Object.entries(blocks).map(([block, rooms]) => (
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
                            className="p-4 rounded bg-sky-200"
                            onClick={() => handleRoomClick(room)}
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

        {/* Render EditRooms if a room is selected */}
        {selectedRoom && (
          <EditRooms
            room={selectedRoom}
            onClose={() => setSelectedRoom(null)}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        )}

        {showAddRoomForm && (
          <AddRoom
            onClose={() => setShowAddRoomForm(false)}
            onSave={handleAddRoom}
          />
        )}
      </div>
    </main>
  );
}

export default ManageRooms;
