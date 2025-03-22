// App.js
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import "./index.css";

import AdminDashboard from "./Components/Admin/Dashboard/AdminDashboard.jsx";
import ConflictResolution from "./Components/Admin/ManageBookings/ConflictResolution.jsx";
import ManageBookings from "./Components/Admin/ManageBookings/ManageBookings.jsx";
import ManageRooms from "./Components/Admin/ManageRoomsLabs/ManageRooms.jsx";
import BookSlots from "./Components/Faculty/BookSlots/BookSlots.jsx";
import Bookings from "./Components/Faculty/My_Bookings/Bookings.jsx";
import Header from "./Components/Helpers/Header";
import ProtectedRoute from "./Components/Helpers/ProtectedRoute"; // Import the ProtectedRoute component
import Sidebar from "./Components/Helpers/Sidebar";
import Login from "./Components/Login";
import Profile from "./Components/Helpers/Profile.jsx";
import UserManagement from "./Components/Admin/User/UserManagement.jsx";

function App() {
  const userRole = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).role
    : null;

  return (
    <Router>
      <Routes>
        {/* Standalone Login Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="*"
            element={
              <div className="flex">
                <Sidebar userRole={userRole} />
                <div className="flex-1">
                  <Header userRole={userRole} />
                  <Routes>
                    <Route path="/dashboard" element={<AdminDashboard />} />
                    
                    <Route path="/book-slot" element={<BookSlots />} />
                    <Route path="/my-bookings" element={<Bookings />} />
                    <Route
                      path="/manage-bookings"
                      element={<ManageBookings />}
                    />
                    <Route
                      path="/conflict-resolution"
                      element={<ConflictResolution />}
                    />
                    <Route
                      path="/admin-dashboard"
                      element={<AdminDashboard />}
                    />
                    <Route path="/manage-rooms" element={<ManageRooms />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/user-management" element={<UserManagement/>} />
                  </Routes>
                </div>
              </div>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
