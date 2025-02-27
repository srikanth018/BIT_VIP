import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import "./index.css";

import Header from "./Components/Helpers/Header";
import Sidebar from "./Components/Helpers/Sidebar";
import Login from "./Components/Login";
import BookSlots from "./Components/Faculty/BookSlots/BookSlots.jsx";
import Bookings from "./Components/Faculty/My_Bookings/Bookings.jsx";
import ManageBookings from "./Components/Admin/ManageBookings/ManageBookings.jsx";
import ConflictResolution from "./Components/Admin/ManageBookings/ConflictResolution.jsx";
import AdminDashboard from "./Components/Admin/Dashboard/AdminDashboard.jsx";

function App() {
  // const userRole = "faculty";
  const userRole = "admin";
  

  return (
    <Router>
      <Routes>
        {/* Standalone Login Route */}
        <Route path="/" element={<Login />} />

        {/* Routes with Layout */}
        <Route
          path="*"
          element={
            <div className="flex ">
              
              <Sidebar userRole={userRole} />
              <div className="flex-1">
                <Header userRole={userRole} />
                <Routes>
                  <Route path="/dashboard" element={<AdminDashboard/>} />
                  <Route path="/profile" element={<div>Profile Content</div>} />
                  <Route path="/book-slot" element={<BookSlots/> } />
                  <Route path="/my-bookings" element={<Bookings/>} />
                  <Route path="/manage-bookings" element={<ManageBookings />} />
                  <Route path="/conflict-resolution" element={<ConflictResolution />} />
                  <Route path="/admin-dashboard" element={<AdminDashboard/>} />
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
