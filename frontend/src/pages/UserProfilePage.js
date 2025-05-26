import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Plot from 'react-plotly.js';


const UserProfilePage = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";

  const progressKeys = Object.keys(localStorage).filter((key) =>
    key.startsWith("progress_")
  );
  const totalCoursesStarted = progressKeys.length;

  const [allCourses, setAllCourses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://127.0.0.1:8000/api/courses", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAllCourses(data))
      .catch((err) => console.error("Failed to fetch courses:", err));
  }, []);

  useEffect(() => {
  const interval = setInterval(() => {
    const refresh = localStorage.getItem("needsProfileRefresh");

    if (refresh === "true") {
      window.location.reload(); // ✅ simplest way to re-run all progress logic
      localStorage.setItem("needsProfileRefresh", "false");
    }
  }, 1000); // check every 1 second

  return () => clearInterval(interval);
}, []);


  const coursesProgress = progressKeys
    .map((key) => {
      const courseTitle = key.replace("progress_", "");
      const courseMatch = allCourses.find((c) => c.title === courseTitle);
      if (!courseMatch) return null;

      const progress = JSON.parse(localStorage.getItem(key));
      const total = Object.keys(progress).length;
      const completed = Object.values(progress).filter((s) => s === "completed").length;
      const inProgress = Object.values(progress).filter((s) => s === "in_progress").length;
      const status =
        completed === total
          ? "Completed"
          : inProgress > 0
          ? "In Progress"
          : "Not Started";







      return {
        courseTitle,
        total,
        completed,
        status,
        id: courseMatch.id,
      };
    })
    .filter(Boolean);

  const unlockedBadges = [];
  if (totalCoursesStarted >= 1) unlockedBadges.push("🎉 Started Learning");
  if (coursesProgress.some((c) => c.completed === c.total && c.total > 0))
    unlockedBadges.push("🏆 Course Completed");
  if (totalCoursesStarted >= 3) unlockedBadges.push("🔥 Consistency");

  const activityLog = JSON.parse(localStorage.getItem("activity_log") || "[]");


  const courseNames = coursesProgress.map(c => c.courseTitle);
      const completionRates = coursesProgress.map(c =>
      c.total > 0 ? Math.round((c.completed / c.total) * 100) : 0 );
  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        {/* Top Profile Info */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
          <Avatar sx={{ width: 56, height: 56 }}>
            {username[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5">Welcome back, {username}! 👋</Typography>
            <Typography variant="body2" color="text.secondary">
              Joined: April 2025
            </Typography>
          </Box>
        </Box>

        {/* 🔘 Navigation Buttons */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
          <Button variant="contained" onClick={() => navigate("/mylearning")}>
            Go to My Learning
          </Button>
          <Button variant="outlined" onClick={() => navigate("/courses")}>
            Browse All Courses
          </Button>
          <Button
            color="error"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("username");
              navigate("/login");
            }}
          >
            Logout
          </Button>
        </Box>
        

        {/* 📊 Course Progress */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Courses Started: {totalCoursesStarted}
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
          {coursesProgress.map((course, index) => (
            <Paper key={index} sx={{ p: 2, minWidth: 250 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {course.courseTitle}
              </Typography>
              <Typography variant="body2">
                Progress: {course.completed}/{course.total} completed
              </Typography>
              <Chip
                label={course.status}
                color={
                  course.status === "Completed"
                    ? "success"
                    : course.status === "In Progress"
                    ? "warning"
                    : "default"
                }
                size="small"
                sx={{ mt: 1 }}
              />
              <Button
                size="small"
                variant="text"
                sx={{ mt: 1 }}
                onClick={() => navigate(`/courses/${course.id}`)}
              >
                Continue Course →
              </Button>
            </Paper>
          ))}
        </Box>

        <Typography variant="h6" sx={{ mt: 4 }}>
  📊 Your Course Completion (Interactive)
</Typography>

<Plot
  data={[
    {
      x: completionRates,
      y: courseNames,
      type: 'bar',
      orientation: 'h',
      marker: { color: 'teal' },
    },
  ]}
  layout={{
    title: 'Course Completion by Topic',
    xaxis: { title: 'Progress (%)', range: [0, 100] },
    yaxis: { title: 'Course' },
    height: 400,
  }}
  style={{ width: '100%', marginTop: '10px' }}
/>


        {/* 🧠 Badges */}
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" sx={{ mb: 1 }}>
          🧠 Unlocked Badges
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
          {unlockedBadges.length > 0 ? (
            unlockedBadges.map((badge, i) => (
              <Chip key={i} label={badge} color="primary" />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No badges unlocked yet.
            </Typography>
          )}
        </Box>

        {/* 📅 Recent Activity */}
        <Typography variant="h6" sx={{ mt: 5, mb: 2 }}>
          📅 Recent Activity
        </Typography>
        <Box
          sx={{
            maxHeight: 300,
            overflowY: "auto",
            borderLeft: "3px solid #ccc",
            pl: 2,
            ml: 1,
          }}
        >
          {activityLog.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No activity yet. Start learning to see your progress here.
            </Typography>
          ) : (
            activityLog.map((item, index) => (
              <Box
                key={index}
                sx={{
                  position: "relative",
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 5,
                    left: -16,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: "#1976d2",
                  }}
                />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {item.action} <i>{item.topic}</i> in <u>{item.course}</u>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(item.timestamp).toLocaleString()}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default UserProfilePage;
