import React, { useEffect, useState } from "react";
import { Container, Typography, Card, CardContent, List, ListItem, Button, Chip } from "@mui/material";
import { useLocation } from "react-router-dom";

const CourseDetailsPage = () => {
  const { state: course } = useLocation();
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`progress_${course.title}`)) || {};
    setProgress(saved);
  }, [course.title]);

  const startLearning = () => {
    const updated = {};
    course.subtopics.forEach((sub) => {
      updated[sub.title] = "in_progress";
    });
    setProgress(updated);
    localStorage.setItem(`progress_${course.title}`, JSON.stringify(updated));
  };

  const markAsComplete = (title) => {
    const updated = { ...progress, [title]: "completed" };
    setProgress(updated);
    localStorage.setItem(`progress_${course.title}`, JSON.stringify(updated));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {course.title}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 3 }}
        onClick={startLearning}
      >
        🚀 Start Learning
      </Button>

      <List>
        {course.subtopics.map((sub, index) => (
          <ListItem key={index} sx={{ flexDirection: "column", alignItems: "start" }}>
            <Card sx={{ width: "100%" }}>
              <CardContent>
                <Typography variant="h6">{sub.title}</Typography>
                <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                  Resources:
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                 {sub.description || "No description available."}
                </Typography>

                <ul>
                  {sub.resources.map((link, i) => (
                    <li key={i}><a href={link} target="_blank" rel="noopener noreferrer">{link}</a></li>
                  ))}
                </ul>
                <Chip
                  label={progress[sub.title] || "not started"}
                  color={
                    progress[sub.title] === "completed"
                      ? "success"
                      : progress[sub.title] === "in_progress"
                      ? "warning"
                      : "default"
                  }
                  sx={{ mt: 2, mr: 2 }}
                />
                {progress[sub.title] !== "completed" && (
                  <Button
                    variant="outlined"
                    onClick={() => markAsComplete(sub.title)}
                  >
                    Mark as Completed
                  </Button>
                )}
              </CardContent>
            </Card>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default CourseDetailsPage;
