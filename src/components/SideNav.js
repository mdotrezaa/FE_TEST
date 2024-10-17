import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Collapse,
} from "@mui/material";
import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReportIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const drawerWidth = 240;

const SideNav = ({ onLogout }) => {
  const [openReports, setOpenReports] = useState(false);

  const handleReportsClick = () => {
    setOpenReports(!openReports);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Typography variant="h6" noWrap component="div" sx={{ padding: 2 }}>
        App Logo
      </Typography>
      <List disablePadding>
        {/* Dashboard Link */}
        <ListItem button component={Link} to="/dashboard">
          <ListItemIcon sx={{ minWidth: "30px" }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText disableGutters primary="Dashboard" />
        </ListItem>

        {/* Reports Link with Collapse */}
        <ListItem button onClick={handleReportsClick}>
          <ListItemIcon sx={{ minWidth: "30px" }}>
            <ReportIcon />
          </ListItemIcon>
          <ListItemText primary="Laporan Lalin" />
          {openReports ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        {/* Collapsible Reports Submenu */}
        <Collapse in={openReports} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button component={Link} to="/reports/daily">
              <ListItemText primary="Lalin Per Hari" sx={{ pl: 4 }} />
            </ListItem>
          </List>
        </Collapse>

        {/* Settings Link */}
        <ListItem button component={Link} to="/settings">
          <ListItemIcon sx={{ minWidth: "30px" }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Master Gerbang" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default SideNav;
