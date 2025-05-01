import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Box,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const isAuthenticated = () => !!localStorage.getItem("token");

const handleCourseClick = (courseId) => {
  if (isAuthenticated()) {
    navigate(`/courses/${courseId}`);
  } else {
    alert("Please log in to start learning this course.");
    navigate("/login");
  }
};
  

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/courses")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load courses:", err);
        setLoading(false);
      });
  }, []);
  
  

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        📚 Available Courses
      </Typography>
      <TextField
  label="Search courses or topics..."
  variant="outlined"
  fullWidth
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  sx={{ marginBottom: "2rem" }}
/>
      {loading ? (
      
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {courses
  .filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.subtopics.some(sub =>
      sub.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )
  .map((course, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{course.title}</Typography>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ marginTop: "1rem" }}
                    onClick={() => handleCourseClick(course.id)}

                  >
                    View Course
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default CoursesPage;