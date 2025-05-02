import React ,{ useMemo, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import PrivateRoute from "./components/PrivateRoute"; // 💡 import here
import Navbar from "./components/NavBar";
import MyLearningPage from "./pages/MyLearningPage";
import UserProfilePage from "./pages/UserProfilePage"; // import it





const theme = createTheme(); // You can customize this later



// Add inside <Routes>

function App() {


  const [mode, setMode] = useState(() => localStorage.getItem("theme") || "light");

const theme = useMemo(() =>
  createTheme({
    palette: {
      mode,
    },
  }), [mode]);

const toggleDarkMode = () => {
  const next = mode === "light" ? "dark" : "light";
  setMode(next);
  localStorage.setItem("theme", next);
};

  return (
    
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
      <Navbar onToggleTheme={toggleDarkMode} currentTheme={mode} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/courses/:id" element={<PrivateRoute><CourseDetailsPage /></PrivateRoute>} />
          <Route path="/mylearning" element={<PrivateRoute><MyLearningPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><UserProfilePage /></PrivateRoute>} />

          

        </Routes>
      </Router>
     
    </ThemeProvider>
    
  );
}

export default App;
