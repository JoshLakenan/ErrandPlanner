import PathPage from "./pages/PathPage.jsx";
import Register from "./pages/RegisterPage.jsx";
import Login from "./pages/LoginPage.jsx";
import LocationPage from "./pages/LocationPage.jsx";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LocationPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
