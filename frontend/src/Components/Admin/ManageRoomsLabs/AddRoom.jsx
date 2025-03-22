import React, { useState } from "react";

const AddRoom = ({ onClose, onSave }) => {
  const [newRoom, setNewRoom] = useState({
    RoomID: "",
    Block: "",
    Type: "",
    Floor: "",
    Capacity: "",
    RoomInfo: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoom((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSave(newRoom); // Pass the new room data to the parent component
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ease-in-out">
        <div className="border-2 border-sky-500 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-sky-500 mb-6">Add New Room</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Room ID:
                </label>
                <input
                  type="text"
                  name="RoomID"
                  value={newRoom.RoomID}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Block:
                </label>
                <select
                  name="Block"
                  value={newRoom.Block}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Block</option>
                  <option value="Research Park">Research Park</option>
                  <option value="East Wing (AS)">East Wing (AS)</option>
                  <option value="Auditorium">Auditorium</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="SF">SF</option>
                  <option value="West Wing (1B)">West Wing (1B)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Type:
                </label>
                <select
                  name="Type"
                  value={newRoom.Type}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Computer Labs">Computer Labs</option>
                  <option value="Seminar Hall">Seminar Hall</option>
                  <option value="Class Room">Class Room</option>
                  <option value="Auditorium">Auditorium</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Floor:
                </label>
                <select
                  name="Floor"
                  value={newRoom.Floor}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Floor</option>
                  <option value="3">3</option>
                  <option value="0">0</option>
                  <option value="2">2</option>
                  <option value="1">1</option>
                  <option value="-1">-1</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Capacity:
                </label>
                <input
                  type="number"
                  name="Capacity"
                  value={newRoom.Capacity}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Room Info:
                </label>
                <textarea
                  name="RoomInfo"
                  value={newRoom.RoomInfo}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Save
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRoom;