import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import "./index.css";

import Header from "./Components/Helpers/Header";
import Sidebar from "./Components/Helpers/Sidebar";
import Login from "./Components/Login";
import BookSlots from "./Components/BookSlots/BookSlots.jsx";
import Bookings from "./Components/My_Bookings/Bookings.jsx";
import ManageBookings from "./Components/Admin/ManageBookings/ManageBookings.jsx";

function App() {
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
            <div className="flex">
              <Sidebar userRole={userRole} />
              <div className="flex-1">
                <Header userRole={userRole} />
                <Routes>
                  <Route path="/dashboard" element={<div>Dashboard Content</div>} />
                  <Route path="/profile" element={<div>Profile Content</div>} />
                  <Route path="/book-slot" element={<BookSlots/> } />
                  <Route path="/my-bookings" element={<Bookings/>} />
                  <Route path="/manage-bookings" element={<ManageBookings />} />
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
