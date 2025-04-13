import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Box,
} from "@mui/material";
import { useParams } from "react-router-dom";

const CourseDetails = () => {
  const { id } = useParams(); // Get course index from the URL
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://smart-study-assistant-app.onrender.com/api/courses")
      .then((res) => res.json())
      .then((data) => {
        setCourse(data[id]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load course details:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (!course) {
    return (
      <Container>
        <Typography variant="h5">Course not found</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {course.title}
      </Typography>
      {course.subtopics.map((topic, index) => (
        <Card key={index} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6">{topic.title}</Typography>
            <List>
              {topic.resources.map((link, i) => (
                <ListItem key={i}>
                  <ListItemText>
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      {link}
                    </a>
                  </ListItemText>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default CourseDetails;
