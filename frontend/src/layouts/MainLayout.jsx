import Navbar from "../components/NavBar";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clientAuthCheck } from "../services/authService.js";

const MainLayout = ({ children }) => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = clientAuthCheck();

    if (!user) {
      navigate("/login", {
        replace: true,
        state: { alert: { message: "Please login", type: "info" } },
      });
    }
    setUserName(user.username);
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
      <Navbar username={userName} />
      {children}
    </Box>
  );
};

export default MainLayout;
