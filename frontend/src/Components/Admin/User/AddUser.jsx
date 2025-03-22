import React, { useState } from "react";

const AddUser = ({ onClose, onSave }) => {
  const [newUser, setNewUser] = useState({
    faculty_id: "", // Updated key
    faculty_name: "", // Added field
    role: "",
    team: "",
    mail_id: "", // Updated key
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSave(newUser); // Pass the new user data to the parent component
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ease-in-out">
        <div className="border-2 border-sky-500 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-sky-500 mb-6">Add New User</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Faculty ID:
                </label>
                <input
                  type="text"
                  name="faculty_id"
                  value={newUser.faculty_id}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Faculty Name:
                </label>
                <input
                  type="text"
                  name="faculty_name"
                  value={newUser.faculty_name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Email:
                </label>
                <input
                  type="email"
                  name="mail_id"
                  value={newUser.mail_id}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Password:
                </label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Role:
                </label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="faculty">Faculty</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Team:
                </label>
                <select
                  name="team"
                  value={newUser.team}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Team</option>
                  <option value="placement">Placement</option>
                  <option value="academics">Academics</option>
                  <option value="research">Research</option>
                  <option value="others">Others</option>
                </select>
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

export default AddUser;