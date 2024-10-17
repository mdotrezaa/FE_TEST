import React from "react";
import { Box, CssBaseline } from "@mui/material";
import SideNav from "./SideNav";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = ({ setIsAuthenticated }) => {
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <SideNav onLogout={handleLogout} />

      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default" }}>
        <Navbar onLogout={handleLogout} />

        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
