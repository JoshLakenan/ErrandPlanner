import Navbar from "../components/NavBar";
import { Box } from "@mui/material";

const MainLayout = ({ children }) => {
  return (
    <Box
      sx={{
        maxHeight: "90vH",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start", // Align items at the top
        paddingTop: 3,
      }}
    >
      <Navbar />
      {children}
    </Box>
  );
};

export default MainLayout;
