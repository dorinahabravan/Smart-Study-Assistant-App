import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Collapse,
  Paper,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  keyframes
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { styled } from "@mui/system";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinningLogo = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: "50%",
  background: theme.palette.primary.main,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontWeight: "bold",
  fontSize: "0.9rem",
  animation: `${spin} 3s linear infinite`,
  textAlign: "center",
  padding: 4,
}));

const NavBar = ({ onToggleTheme, currentTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("token");

  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [courses, setCourses] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const username = isLoggedIn ? localStorage.getItem("username") : "";

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const showLoginButton = location.pathname === "/courses";

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      localStorage.removeItem("username");
    }

    if (isLoggedIn) {
      fetch("http://127.0.0.1:8000/api/courses", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => res.json())
        .then((data) => setCourses(data))
        .catch((err) => console.error("Failed to load courses:", err));
    }
  }, [isLoggedIn]);

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Left side - logo + dropdown */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              onClick={() => navigate("/")}
              sx={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 2 }}
            >
              <SpinningLogo>
                <Typography variant="caption" sx={{ fontSize: "0.7rem", textAlign: "center" }}>Smart Study</Typography>
              </SpinningLogo>
              <Typography variant="h6">Smart Study Assistant</Typography>
            </Box>

            {isLoggedIn && (
              <Button
                color="inherit"
                onClick={() => setShowCourseDropdown((prev) => !prev)}
              >
                {showCourseDropdown ? "⬆ Hide All Courses" : "⬇ Show All Courses"}
              </Button>
            )}
          </Box>

          {/* Right side - dark mode toggle + avatar */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* 🌙 Dark Mode Toggle */}
            <Button onClick={onToggleTheme} color="inherit">
              {currentTheme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </Button>

            {isLoggedIn ? (
              <>
                <Tooltip title="Account settings">
                  <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                    <Avatar>{username[0]?.toUpperCase()}</Avatar>
                  </IconButton>
                </Tooltip>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  onClick={handleMenuClose}
                >
                  <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
                  <MenuItem onClick={() => navigate("/mylearning")}>My Learning</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              showLoginButton && (
                <Button color="inherit" onClick={() => navigate("/login")}>
                  Login
                </Button>
              )
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Courses dropdown under navbar */}
      {isLoggedIn && (
        <Collapse in={showCourseDropdown}>
          <Paper
            elevation={2}
            sx={{
              px: 2,
              py: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              backgroundColor: "#f5f5f5",
              borderBottom: "1px solid #ccc",
              position: "relative",
            }}
          >
            {/* Left scroll arrow */}
            <Button
              onClick={() => {
                const container = document.getElementById("course-scroll-container");
                container.scrollLeft -= 200;
              }}
              sx={{ minWidth: "30px" }}
            >
              ⬅
            </Button>

            {/* Scrollable course list */}
            <Box
              id="course-scroll-container"
              sx={{
                display: "flex",
                overflowX: "auto",
                scrollBehavior: "smooth",
                gap: 2,
                flex: 1,
                px: 1,
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {courses.map((course) => (
                <Button
                  key={course.id}
                  variant="outlined"
                  onClick={() => {
                    navigate(`/courses/${course.id}`);
                    setShowCourseDropdown(false);
                  }}
                  sx={{ whiteSpace: "nowrap" }}
                >
                  {course.title}
                </Button>
              ))}
            </Box>

            {/* Right scroll arrow */}
            <Button
              onClick={() => {
                const container = document.getElementById("course-scroll-container");
                container.scrollLeft += 200;
              }}
              sx={{ minWidth: "30px" }}
            >
              ➡
            </Button>
          </Paper>
        </Collapse>
      )}
    </>
  );
};

export default NavBar;
