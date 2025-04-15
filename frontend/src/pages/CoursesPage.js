import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Card, CardContent, Button,  CircularProgress, Box} from "@mui/material";
import { useNavigate } from "react-router-dom";



const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    //fetch("http://127.0.0.1:8000/api/courses") // This was for the local testing
    // NEW (for production)
    //This is for testing
      //fetch(`${process.env.REACT_APP_API_URL}/api/courses`)
      //This is for production

  fetch("https://smart-study-assistant-app.onrender.com/api/courses")
  .then((res) => res.json())
  .then((data) => {
    setCourses(data);
    setLoading(false); // ✅ only stop loading when data is actually fetched
  })
  .catch((err) => {
    console.error("Failed to load courses:", err);
    setLoading(false); // ✅ still stop loading even if there's an error
  });
}, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        📚 Available Courses
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {courses.map((course, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{course.title}</Typography>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ marginTop: "1rem" }}
                    onClick={() => navigate(`/courses/${index}`)}
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