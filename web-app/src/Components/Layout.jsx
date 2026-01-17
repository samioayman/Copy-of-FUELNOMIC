import React, { useState } from "react";
import Sidebar from "/Users/samio_ayman/FYP-Fuelnomic/web-app/src/Components/SideBar.jsx";

const Layout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false); // controls width
  const [isOpen, setIsOpen] = useState(true); // controls mobile toggle

  return (
    <div>
      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <main
        style={{
          marginLeft: isCollapsed ? "90px" : "350px",
          transition: "margin-left 0.3s ease",
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
