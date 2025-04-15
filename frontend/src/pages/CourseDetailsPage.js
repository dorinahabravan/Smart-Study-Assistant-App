import { useLocation } from "react-router-dom";

const CourseDetailsPage = () => {
  const location = useLocation();
  const course = location.state;

  if (!course) {
    return <div>No course data found</div>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>{course.title}</Typography>
      {course.subtopics.map((subtopic, idx) => (
        <Card key={idx} sx={{ marginBottom: "1rem" }}>
          <CardContent>
            <Typography variant="h6">{subtopic.title}</Typography>
            <ul>
              {subtopic.resources.map((res, i) => (
                <li key={i}><a href={res} target="_blank" rel="noopener noreferrer">{res}</a></li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};
