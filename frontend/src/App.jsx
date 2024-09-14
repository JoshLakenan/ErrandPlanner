import MainLayout from "./layouts/MainLayout.jsx";
import Register from "./pages/RegisterPage.jsx";
import Login from "./pages/LoginPage.jsx";
import PathPage from "./pages/PathPage.jsx";
import LocationPage from "./pages/LocationPage.jsx";
import "./App.css";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/paths" />} />
        <Route
          path="/paths"
          element={
            <MainLayout>
              <PathPage />
            </MainLayout>
          }
        />
        <Route
          path="/locations"
          element={
            <MainLayout>
              <LocationPage />
            </MainLayout>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
