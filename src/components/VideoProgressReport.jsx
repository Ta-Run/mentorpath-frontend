import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Spinner, Table, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

const VideoProgressReport = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { video, userId } = state || {};

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!video || !userId) return;

      try {
        const response = await axios.post('http://localhost:4000/api/video/getVideoProgressReport', {
          videoId: video._id,
          userId: userId
        });

        if (response.status === 200) {
          setProgress(response.data.data);
        } else {
          console.error('Failed to fetch progress report');
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [video, userId]);

  if (!video || !userId) {
    return (
      <Container className="mt-5 text-center">
        <h5>Invalid Request</h5>
        <Button onClick={() => navigate('/videodata')}>🔙 Go Back</Button>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h3>📊 Progress Report for: {video.title}</h3>
      {loading ? (
        <div className="text-center mt-4">
          <Spinner animation="border" variant="primary" />
          <p>Loading progress...</p>
        </div>
      ) : progress ? (
        <Table striped bordered hover className="mt-4">
          <tbody>
            <tr>
              <td><strong>Video Title</strong></td>
              <td>{video.title}</td>
            </tr>
            <tr>
              <td><strong>Total Duration</strong></td>
              <td>{video.duration} sec</td>
            </tr>
            <tr>
              <td><strong>Watched Time</strong></td>
              <td>{progress.watchedTime || 'N/A'} sec</td>
            </tr>
            <tr>
              <td><strong>Progress %</strong></td>
              <td>{progress.percentage || 'N/A'}%</td>
            </tr>
            <tr>
              <td><strong>Last Watched</strong></td>
              <td>{progress.lastWatched || 'N/A'}</td>
            </tr>
          </tbody>
        </Table>
      ) : (
        <p className="text-danger mt-4">No progress report found for this video.</p>
      )}

      <Button variant="secondary" className="mt-3" onClick={() => navigate('/videodata')}>
        🔙 Back to Videos
      </Button>
    </Container>
  );
};

export default VideoProgressReport;
