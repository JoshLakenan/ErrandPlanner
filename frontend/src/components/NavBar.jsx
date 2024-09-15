import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const navLinkStyle = {
  textDecoration: "none",
  color: "inherit",
  "&:hover": {
    textDecoration: "underline",
    color: "white",
    cursor: "pointer",
  },
};

const Navbar = ({ username = "" }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the JWT token from the session storage
    sessionStorage.removeItem("jwt");

    // Redirect to the login page
    navigate("/login", {
      replace: true,
      state: { alert: { message: "Logged out successfully", type: "success" } },
    });
  };

  return (
    <AppBar position="static" sx={{ width: "100vw", mb: 2 }}>
      <Toolbar id="toolbar">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            width: "100%",
          }}
        >
          {/* Left side */}
          <Typography variant="h6" sx={{ paddingLeft: 2 }}>
            Errand Planner
          </Typography>

          {/* Center*/}
          <Box sx={{ display: "flex", gap: 3 }}>
            <Typography
              variant="h6"
              onClick={() => navigate("/paths")}
              sx={navLinkStyle}
            >
              Paths
            </Typography>
            <Typography
              variant="h6"
              onClick={() => navigate("/locations")}
              sx={navLinkStyle}
            >
              Locations
            </Typography>
          </Box>

          {/* Right side */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Typography variant="h6">Welcome {username}</Typography>
            <Typography variant="h6" onClick={handleLogout} sx={navLinkStyle}>
              Logout
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
