import React, { useState } from "react";

const EditUser = ({ user, onClose, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [editedUser, setEditedUser] = useState({ ...user }); // State to store edited user data

  // Dropdown options
  const roleOptions = ["admin", "faculty"];
  const teamOptions = ["placement", "academics", "research", "others"];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle save changes
  const handleSave = () => {
    onSave(editedUser); // Pass the updated user data to the parent component
    setIsEditing(false); // Exit edit mode
  };

  // Handle delete user
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      onDelete(user.faculty_id); // Pass the faculty ID to the parent component for deletion
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-1/2 mx-4 transform transition-all duration-300 ease-in-out">
        <div className="border-2 border-sky-500 p-6 rounded-lg">
          {/* Header with edit icon */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-sky-500">
              {user.faculty_name}
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-sky-500 hover:text-sky-700 focus:outline-none"
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

          {/* User details */}
          <table className="w-full text-gray-700">
            <tbody>
              <tr>
                <td className="font-semibold py-2">Faculty ID:</td>
                <td className="py-2">{user.faculty_id}</td>
              </tr>
              <tr>
                <td className="font-semibold py-2">Faculty Name:</td>
                <td className="py-2">
                  {isEditing ? (
                    <input
                      type="text"
                      name="faculty_name"
                      value={editedUser.faculty_name}
                      onChange={handleInputChange}
                      className="w-full p-1 border rounded"
                    />
                  ) : (
                    user.faculty_name
                  )}
                </td>
              </tr>
              <tr>
                <td className="font-semibold py-2">Email:</td>
                <td className="py-2">
                  {isEditing ? (
                    <input
                      type="email"
                      name="mail_id"
                      value={editedUser.mail_id}
                      onChange={handleInputChange}
                      className="w-full p-1 border rounded"
                    />
                  ) : (
                    user.mail_id
                  )}
                </td>
              </tr>
              <tr>
                <td className="font-semibold py-2">Role:</td>
                <td className="py-2">
                  {isEditing ? (
                    <select
                      name="role"
                      value={editedUser.role}
                      onChange={handleInputChange}
                      className="w-full p-1 border rounded"
                    >
                      {roleOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
              </tr>
              <tr>
                <td className="font-semibold py-2">Team:</td>
                <td className="py-2">
                  {isEditing ? (
                    <select
                      name="team"
                      value={editedUser.team}
                      onChange={handleInputChange}
                      className="w-full p-1 border rounded"
                    >
                      {teamOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    user.team
                  )}
                </td>
              </tr>

             
            </tbody>
          </table>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-green-200 border border-green-500 font-semibold text-green-600 rounded-lg hover:bg-green-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Save Changes
              </button>
            ) : null}
            <button
              onClick={handleDelete}
              className="px-6 py-2 bg-red-200 border border-red-500 font-semibold text-red-600 rounded-lg hover:bg-red-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Delete User
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-sky-200 border border-sky-500 font-semibold text-sky-600 rounded-lg hover:bg-sky-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
