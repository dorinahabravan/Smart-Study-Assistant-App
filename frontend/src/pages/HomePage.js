import React, { useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Fade,
  Slide,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const latestNews = [
    { title: "AI Revolution in Education", summary: "New AI tools are changing how students learn in 2025." },
    { title: "Tech Job Market Update", summary: "Demand for Python and cloud skills remains high." },
    { title: "Top 5 IT Certifications", summary: "Certifications that will boost your career this year." },
    { title: "React 19 Features", summary: "The new release improves server-side rendering and performance." },
    { title: "Cybersecurity in 2025", summary: "Zero trust and AI-based protection trends." }
  ];

  useEffect(() => {
    const container = scrollRef.current;
    let animationFrameId;

    const scroll = () => {
      if (container) {
        container.scrollLeft += 1;
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
          container.scrollLeft = 0; // reset scroll
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <Box>
      {/* Hero Section */}
      <Slide direction="down" in={true} timeout={800}>
        <Box
          sx={{
            background: "linear-gradient(135deg, #1CB5E0 0%, #000851 100%)",
            color: "white",
            py: 10,
            textAlign: "center",
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Container>
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
              Smart Study Assistant 📚
            </Typography>
            <Typography variant="h5" gutterBottom>
              Your personal AI companion for mastering tech courses.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{ mt: 3, px: 5, py: 1.5, fontSize: "1.2rem", backgroundColor: "#00796b" }}
              onClick={() => navigate("/signup")}
            >
              Get Started
            </Button>
          </Container>
        </Box>
      </Slide>

      {/* Features */}
      <Container sx={{ py: 10 }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Grid container spacing={4} maxWidth="md" justifyContent="center">
            {[
              { icon: "🧠", title: "AI Learning Paths", desc: "Get smart, dynamic topic suggestions based on your progress." },
              { icon: "📘", title: "Course Progress", desc: "Track your learning journey across tech topics and subtopics." },
              { icon: "🏆", title: "Badges & Motivation", desc: "Earn badges for consistency, course completions, and more." },
              { icon: "📄", title: "PDF Certificates", desc: "Download a certificate when you finish any course." }
            ].map((feature, i) => (
              <Grid item xs={12} sm={6} md={3} key={i} display="flex" justifyContent="center">
                <Fade in={true} style={{ transitionDelay: `${i * 200}ms` }}>
                  <Paper
                    elevation={4}
                    sx={{
                      p: 3,
                      textAlign: "center",
                      transition: "all 0.4s ease",
                      background: "#ffffff",
                      borderRadius: 3,
                      transform: "translateY(0)",
                      maxWidth: 250,
                      minHeight: 220,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      "&:hover": {
                        transform: "scale(1.08) translateY(-5px)",
                        boxShadow: 8,
                        backgroundColor: "#f1f8e9",
                      },
                    }}
                  >
                    <Typography variant="h4" sx={{ mb: 1 }}>{feature.icon}</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{feature.title}</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>{feature.desc}</Typography>
                  </Paper>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Call to Action */}
      <Fade in={true} timeout={1000}>
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            background: "linear-gradient(to right, #43cea2, #185a9d)",
            color: "white",
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
            Ready to start learning?
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ px: 5, py: 1.5, fontSize: "1.1rem", backgroundColor: "#004d40" }}
            onClick={() => navigate("/courses")}
          >
            Browse Courses
          </Button>
        </Box>
      </Fade>

      {/* 📰 Latest IT News Section (Auto-scroll) */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h5" gutterBottom>
          📰 Latest IT News
        </Typography>
        <Box
  ref={scrollRef}
  sx={{
    display: "flex",
    overflowX: "auto",
    gap: 2,
    scrollBehavior: "smooth",
    "&::-webkit-scrollbar": { display: "none" },
  }}
>
  {[...latestNews, ...latestNews].map((news, index) => (
    <Card
      key={index}
      sx={{
        minWidth: 280,
        maxWidth: 300,
        flex: "0 0 auto",
        border: "2px solid #ccc",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Typography variant="h6">{news.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {news.summary}
        </Typography>
      </CardContent>
    </Card>
  ))}
</Box>

      </Container>
    </Box>
  );
};

export default HomePage;
