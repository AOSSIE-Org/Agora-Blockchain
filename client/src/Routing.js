import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

//All the components import goes here
import Auth from "./Components/Screens/Auth";
import Dashboard from "./Components/Screens/Dashboard";
import Election from "./Components/Screens/Election";
import BrightID from "./Components/Screens/BrightID";

const Routing = () => {
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/election" element={<Election />} />
        <Route path="/brightid" element={<BrightID />} />

      </Routes>

    // <BrowserRouter>

    //     <Route exact path="/" element={() => <Navigate to="/auth" />} />
    //     <Route path="/auth" exact component={() => <Auth />} />
    //     <Route path="/dashboard" exact component={() => <Dashboard />} />
    //     <Route path="/election" exact component={() => <Election />} />

    // </BrowserRouter>
  );
};

export default Routing;
