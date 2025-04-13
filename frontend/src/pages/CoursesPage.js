import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Card, CardContent, List, ListItem, ListItemText} from "@mui/material";
import { useNavigate } from "react-router-dom";



const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    //fetch("http://127.0.0.1:8000/api/courses") // This was for the local testing
    // NEW (for production)
    //This is for testing
      //fetch(`${process.env.REACT_APP_API_URL}/api/courses`)
      //This is for production
      fetch("https://smart-study-assistant-app.onrender.com/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error("Failed to load courses:", err));
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        📚 Available Courses
      </Typography>
      <Grid container spacing={3}>
        {courses.map((course, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card>
              <CardContent>
                <Typography variant="h6">{course.title}</Typography>
                <Typography variant="subtitle2" gutterBottom>Subtopics:</Typography>
                <List dense>
                  {course.subtopics.map((sub, subIdx) => (
                    <ListItem key={subIdx}>
                      <ListItemText primary={sub.title} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CoursesPage;