import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/video/getVideo`);
        if (res.status === 200) {
          setVideos(res.data.data);
        } else {
          console.error('Error fetching videos');
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handlePlay = (video) => {
    navigate(`/play/${video._id}`, { state: { video } });
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading videos...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        {videos.map((video) => (
          <Col key={video._id} md={4} className="mb-4">
            <Card>
              <Card.Img
                variant="top"
                src={
                  video.thumbnailurl ||
                  'https://via.placeholder.com/320x180.png?text=Video+Thumbnail'
                }
              />
              <Card.Body>
                <Card.Title>{video.title}</Card.Title>
                <Card.Text>Duration: {video.duration} sec</Card.Text>
                <Button variant="primary" onClick={() => handlePlay(video)}>
                  ▶️ Play
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Videos;
