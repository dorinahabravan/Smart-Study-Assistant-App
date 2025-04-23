import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  Button,
  Chip
} from "@mui/material";
import { useLocation, useParams} from "react-router-dom";

const CourseDetailsPage = () => {
  const { id } = useParams(); // id from URL like /courses/113
  const location = useLocation();
  const [course, setCourse] = useState(location.state || null);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    if (!course) {
      fetch(`http://127.0.0.1:8000/api/courses`) // or your deployed URL
        .then((res) => res.json())
        .then((data) => {
          const found = data.find((c) => c.id === parseInt(id));
          setCourse(found);
        });
    } else {
      const saved = JSON.parse(localStorage.getItem(`progress_${course.title}`)) || {};
      setProgress(saved);
    }
  }, [course, id]);

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
              
                <Typography
  variant="body1"
  sx={{
    whiteSpace: "pre-wrap",
    maxHeight: "300px",
    overflowY: "auto",
    backgroundColor: "#f9f9f9",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "1rem"
  }}
>
  {sub.description || "No description available."}

                </Typography>
                <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                  Resources:
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