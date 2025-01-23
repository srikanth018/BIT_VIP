import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import "./index.css";

import Header from "./Components/Helpers/Header";
import Sidebar from "./Components/Helpers/Sidebar";
import Login from "./Components/Login";
import BookSlots from "./Components/BookSlots/BookSlots.jsx";

function App() {
  const userRole = "faculty";

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
