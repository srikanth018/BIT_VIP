import React, { useEffect, useState } from "react";
import Select from "react-select";
import EditUser from "./EditUser";
import AddUser from "./AddUser";

function UserManagement() {
  const [users, setUsers] = useState([]); // State to store all users
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [selectedUser, setSelectedUser] = useState(null); // State to store the selected user
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  // State for filters
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Fetch all users from the API
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/users"); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      console.log("Fetched users:", data);
      setUsers(data); // Set the fetched users to state
    } catch (error) {
      setError(error.message); // Set error message if something goes wrong
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on selected criteria
  const filteredUsers = users.filter((user) => {
    return (
      (!selectedRole || user.role === selectedRole.value) &&
      (!selectedTeam || user.team === selectedTeam.value)
    );
  });

  // Options for dropdowns with "Choose" option
  const roleOptions = [
    { value: null, label: "Default" },
    ...Array.from(new Set(users.map((user) => user.role))).map((role) => ({
      value: role,
      label: role,
    })),
  ];

  const teamOptions = [
    { value: null, label: "Default" },
    ...Array.from(new Set(users.map((user) => user.team))).map((team) => ({
      value: team,
      label: team,
    })),
  ];

  // Handle filter change for dropdowns
  const handleRoleChange = (selectedOption) => {
    setSelectedRole(selectedOption?.value ? selectedOption : null);
  };

  const handleTeamChange = (selectedOption) => {
    setSelectedTeam(selectedOption?.value ? selectedOption : null);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user); // Set the selected user
  };

  const handleSave = async (updatedUser) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/users/${updatedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", errorText);
        throw new Error("Failed to update user");
      }
  
      const responseText = await response.text();
      const data = responseText ? JSON.parse(responseText) : {};
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === data.user.id ? data.user : user))
      );
      setSelectedUser(null); // Close the popup
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      const data = await response.json();
      console.log("User deleted successfully:", data);

      // Update the UI to reflect the deletion
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      setSelectedUser(null); // Close the edit modal
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };

  const handleAddUser = async (newUser) => {
    try {
      const response = await fetch("http://localhost:8000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      const data = await response.json();
      setUsers((prevUsers) => [...prevUsers, data.user]); // Add the new user to the list
      setShowAddUserForm(false); // Close the form
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  // Render loading state
  if (loading) {
    return <div>Loading users...</div>;
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <button
          onClick={() => setShowAddUserForm(true)}
          className="mt-4 px-6 py-2 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
        >
          Create New User
        </button>
      </div>
      <div className="my-5">
        {/* Filter UI */}
        <div className="flex flex-col md:flex-row gap-4 mt-4 bg-white p-4 rounded-lg shadow-md">
          <div className="w-full">
            <label className="block text-sm text-gray-600 mb-1">
              Role (Optional)
            </label>
            <Select
              options={roleOptions}
              value={selectedRole}
              onChange={handleRoleChange}
              placeholder="Select Role"
              styles={customStyles}
            />
          </div>
          <div className="w-full">
            <label className="block text-sm text-gray-600 mb-1">
              Team (Optional)
            </label>
            <Select
              options={teamOptions}
              value={selectedTeam}
              onChange={handleTeamChange}
              placeholder="Select Team"
              styles={customStyles}
            />
          </div>
        </div>

        {/* Display filtered users */}
        {filteredUsers.length > 0 ? (
          <div className="mt-2  bg-white rounded-lg shadow-md p-4  grid grid-cols-6 gap-4 pt-3" >
            {filteredUsers.map((user) => (
              <div
                key={user.id}
              >
                <div
                  className="p-4 rounded-md bg-sky-200 cursor-pointer"
                  onClick={() => handleUserClick(user)}
                >
                  <h4 className="text-lg font-bold text-sky-700">
                    {user.faculty_id} - {user.faculty_name}
                  </h4>
                  <p className="text-sky-700 font-semibold">Role: {user.role}</p>
                  
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-gray-500">No users available.</p>
        )}

        {/* Render EditUser if a user is selected */}
        {selectedUser && (
          <EditUser
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        )}

        {showAddUserForm && (
          <AddUser
            onClose={() => setShowAddUserForm(false)}
            onSave={handleAddUser}
          />
        )}
      </div>
    </main>
  );
}

export default UserManagement;