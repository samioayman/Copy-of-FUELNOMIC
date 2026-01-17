import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Wrapper from "./pages/Wrapper";
import GetStarted from "./pages/GetStarted";
import User_Management from "./pages/User_Management";
import Fuel_Configuration from "./pages/Fuel_Configuration";
import Station_Management from "./pages/Station_Management";
import Transaction_Management from "./pages/Transaction_Management";
import Notification_News from "./pages/Notification_News";


function App() {
  return (
    <BrowserRouter>

      <Routes>

         <Route path="/" element={<GetStarted />} />
        {/* home */}
        <Route path="/home" element={<Home />} />

        {/* register */}
        <Route path="/register" element={<Register />} />

        {/* login */}
        <Route path="/login" element={<Login />} />



        
        {/* user-management */}
        <Route path="/user-management" element={<User_Management />} />

        {/* fuel-configuration */}
        <Route path="/fuel-configuration" element={<Fuel_Configuration />} />

        {/* station-management */}
        <Route path="/station-management" element={<Station_Management />} />

        {/* transaction-management */}
        <Route path="/transaction-management" element={<Transaction_Management />} />

        {/* notification-news */}
        <Route path="/notification-news" element={<Notification_News />} />

        

        {/* dashboard */}
        <Route
          path="/dashboard"
          element={
            <Wrapper>
              <Dashboard />
            </Wrapper>
          }
        />
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
