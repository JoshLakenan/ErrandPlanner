import Navbar from "../components/NavBar";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clientAuthCheck } from "../services/authService.js";

const MainLayout = ({ children }) => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = clientAuthCheck();

    // Redirect to login page if user is not logged in
    if (!user) {
      navigate("/login", {
        replace: true,
        state: { alert: { message: "Please login", type: "info" } },
      });
      return;
    }

    // Set the username in the state
    setUsername(user.username);
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Navbar username={username} />
      {children}
    </Box>
  );
};

export default MainLayout;
