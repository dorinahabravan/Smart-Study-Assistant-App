import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  Button,
  Chip,
  Box,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import QuizComponent from './QuizComponent';



const CourseDetailsPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState({});
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to access the course.");
      navigate("/login", { replace: true });
      return;
    }

    fetch(`http://127.0.0.1:8000/api/courses/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or course not found");
        return res.json();
      })
      .then((data) => {
        setCourse(data);
        setAuthenticated(true);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Session expired or course not found.");
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      });
  }, [id, navigate]);

  useEffect(() => {
    if (course?.title) {
      const saved = JSON.parse(localStorage.getItem(`progress_${course.title}`)) || {};
      setProgress(saved);
    }
  }, [course?.title]);

  const logActivity = (action, topicTitle) => {
    const log = JSON.parse(localStorage.getItem("activity_log") || "[]");
    log.unshift({
      action,
      topic: topicTitle,
      course: course.title,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("activity_log", JSON.stringify(log.slice(0, 15)));
  };

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
    logActivity("Completed", title);
  };

  if (loading || !course) return <div>Loading...</div>;
  if (!authenticated) return null;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>{course.title}</Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 3 }}
        onClick={startLearning}
      >
        🚀 Start Learning
      </Button>

      <Box sx={{ display: "flex", height: "75vh", gap: 2 }}>
        {/* Left Side */}
        <Box sx={{ width: "30%", borderRight: "1px solid #ccc", overflowY: "auto", pr: 1 }}>
          <List>
            {course.subtopics.map((sub, index) => (
              <ListItem
                button
                key={index}
                selected={expandedIndex === index}
                onClick={() => setExpandedIndex(index)}
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  mb: 1,
                  cursor: "pointer",
                }}
              >
                {sub.title}
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Right Side */}
        <Box
          sx={{
            width: "70%",
            overflowY: "auto",
            p: 2,
            borderRadius: "4px",
            backgroundColor: "#fafafa",
            border: "1px solid #ddd",
          }}
        >
          {expandedIndex !== null && (
          
            <>
              <Typography variant="h6">
                {course.subtopics[expandedIndex].title}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  whiteSpace: "pre-wrap",
                  maxHeight: "300px",
                  overflowY: "auto",
                  backgroundColor: "#f9f9f9",
                  p: 2,
                  borderRadius: "4px",
                  mt: 2,
                }}
              >
                {course.subtopics[expandedIndex].description || "No description available."}
              </Typography>

              <ul>
                {course.subtopics[expandedIndex].resources.map((link, i) => (
                  <li key={i}>
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
              {console.log("🧩 Expanded index:", expandedIndex, "ID:", course.subtopics[expandedIndex]?.id)}

              <QuizComponent
  topicId={course.subtopics[expandedIndex].id}
  quizCompleted={progress[course.subtopics[expandedIndex].title] === "completed"}
  onQuizCompleted={() => {
    markAsComplete(course.subtopics[expandedIndex].title);
    
  }}
/>

          

              <Chip
                label={progress[course.subtopics[expandedIndex].title] || "not started"}
                color={
                  progress[course.subtopics[expandedIndex].title] === "completed"
                    ? "success"
                    : progress[course.subtopics[expandedIndex].title] === "in_progress"
                    ? "warning"
                    : "default"
                }
                sx={{ mt: 2, mr: 2 }}
              />

<Chip
  label={
    progress[course.subtopics[expandedIndex].title] === "completed"
      ? "✅ Quiz Passed"
      : "🚧 In Progress"
      

  }
/>

              <Box sx={{ mt: 2 }}>
                {expandedIndex > 0 && (
                  <Button onClick={() => setExpandedIndex(expandedIndex - 1)}>⬅ Previous</Button>
                )}
                {expandedIndex < course.subtopics.length - 1 && (
                  <Button onClick={() => setExpandedIndex(expandedIndex + 1)}>Next ➡</Button>
                )}
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* 📅 Recent Activity */}
      <Typography variant="h6" sx={{ mt: 5, mb: 2 }}>
        📅 Recent Activity
      </Typography>

      <Box
        sx={{
          maxHeight: "200px",
          overflowY: "auto",
          backgroundColor: "#f1f1f1",
          p: 2,
          borderRadius: "6px",
          border: "1px solid #ddd",
        }}
      >
        {JSON.parse(localStorage.getItem("activity_log") || "[]").map((item, index) => (
          <Box key={index} sx={{ mb: 1 }}>
            <Typography variant="body2">
              <strong>{item.action}</strong> <i>{item.topic}</i> in <u>{item.course}</u>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(item.timestamp).toLocaleString()}
            </Typography>
            
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default CourseDetailsPage;
