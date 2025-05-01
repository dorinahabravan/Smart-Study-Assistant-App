import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Box,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const MyLearningPage = () => {
  const [startedCourses, setStartedCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://127.0.0.1:8000/api/courses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((allCourses) => {
        const keys = Object.keys(localStorage).filter((key) =>
          key.startsWith("progress_")
        );

        const matched = keys
          .map((key) => {
            const title = key.replace("progress_", "");
            const course = allCourses.find((c) => c.title === title);
            if (!course) return null;

            const progress = JSON.parse(localStorage.getItem(key));
            const completedCount = Object.values(progress).filter(
              (status) => status === "completed"
            ).length;
            const total = Object.keys(progress).length;
            const percentage = Math.round((completedCount / total) * 100);

            return {
              id: course.id,
              title: course.title,
              progress: `${completedCount} / ${total}`,
              percentage,
            };
          })
          .filter(Boolean);

        setStartedCourses(matched);
      });
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        📘 My Learning Progress
      </Typography>

      <Grid container spacing={3}>
        {startedCourses.length === 0 && (
          <Typography>You haven't started any courses yet.</Typography>
        )}

        {startedCourses.map((course, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6">{course.title}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Progress: {course.progress}
              </Typography>

              <Chip
                label={`${course.percentage}% complete`}
                color={
                  course.percentage === 100
                    ? "success"
                    : course.percentage >= 50
                    ? "warning"
                    : "default"
                }
              />

              <Button
                size="small"
                variant="text"
                sx={{ mt: 1 }}
                onClick={() => navigate(`/courses/${course.id}`)} // ✅ Working ID-based navigation
              >
                Continue Course →
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MyLearningPage;
