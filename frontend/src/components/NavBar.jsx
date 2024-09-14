import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = ({ username = "josh" }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("jwt");
    navigate("/login", {
      replace: true,
      state: { alert: { message: "Logged out successfully", type: "success" } },
    });
  };
  return (
    <AppBar position="fixed" sx={{ width: "100vw" }}>
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          {/* Left side: Navigation Links */}
          <Box sx={{ display: "flex", gap: 3 }}>
            <Button color="inherit" component={Link} to="/paths">
              Paths
            </Button>
            <Button color="inherit" component={Link} to="/locations">
              Locations
            </Button>
          </Box>

          {/* Center: Brand Name */}
          <Typography variant="h6">Errand Planner</Typography>

          {/* Right side: Username and Logout Button */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Typography variant="h6">Welcome {username}</Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
