import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './index.css';
import './App.css';

import Login from './Components/Login';
import Sidebar from './Components/Helpers/Sidebar';
import Header from './Components/Helpers/Header';

function App() {
  const userRole = "faculty";
  return (
    <Router>
      <div className="flex">
        {/* Sidebar component on the left */}
        <Sidebar userRole={userRole} /> {/* Pass userRole as required */}
        
        {/* Main content area */}
        <div className="flex-1">
        <Header userRole={userRole} />
          <Routes>
            <Route path="/" element={<Login />} />
            {/* Add other routes here */}
            <Route path="/dashboard" element={<div>Dashboard Content</div>} />
            <Route path="/profile" element={<div>Profile Content</div>} />
            {/* Add more routes for admin, faculty, etc. */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
