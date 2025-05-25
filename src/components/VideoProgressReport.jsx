import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Spinner, Table, Button, ProgressBar } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList,
} from 'recharts';

const mergeIntervals = (intervals) => {
  intervals.sort((a, b) => a.start - b.start);
  const merged = [];

  for (const interval of intervals) {
    if (!merged.length || merged[merged.length - 1].end < interval.start) {
      merged.push({ ...interval });
    } else {
      merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, interval.end);
    }
  }

  return merged;
};

const getUnwatchedIntervals = (merged, duration) => {
  const gaps = [];
  let prevEnd = 0;

  for (const interval of merged) {
    if (interval.start > prevEnd) {
      gaps.push({ start: prevEnd, end: interval.start });
    }
    prevEnd = interval.end;
  }

  if (prevEnd < duration) {
    gaps.push({ start: prevEnd, end: duration });
  }

  return gaps;
};

const VideoProgressReport = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { video, userId } = state || {};

  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState(null);
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!video || !userId) return;

      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/video/getVideoProgressReport`, {
          videoId: video._id,
          userId: userId,
        });

        if (response.status === 200) {
          const data = response.data.data;
          const merged = mergeIntervals(data.rawIntervals || []);
          const gaps = getUnwatchedIntervals(merged, video.duration);

          // Prepare data for chart
          const chartData = [
            ...merged.map((item, i) => ({
              name: `Watched ${i + 1}`,
              start: item.start,
              duration: item.end - item.start,
              type: 'watched',
            })),
            ...gaps.map((item, i) => ({
              name: `Skipped ${i + 1}`,
              start: item.start,
              duration: item.end - item.start,
              type: 'skipped',
            }))
          ];

          setProgressData(data);
          setGraphData(chartData);
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

  const handleCertificateCheck = () => {
    if (progressData?.isEligibleForCertificate) {
      alert('🎉 Congratulations! You are eligible for the certificate.');
      // Logic to download/show certificate here
    } else {
      alert('❌ Better luck next time. Complete the video to earn a certificate.');
    }
  };

  if (!video || !userId) {
    return (
      <Container className="mt-5 text-center">
        <h5>Invalid Request</h5>
        <Button onClick={() => navigate('/videos')}>🔙 Go Back</Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h3>📊 Progress Report for: {video.title}</h3>

      {loading ? (
        <div className="text-center mt-4">
          <Spinner animation="border" variant="primary" />
          <p>Loading progress...</p>
        </div>
      ) : progressData ? (
        <>
          <h5 className="mt-4">Overall Progress</h5>
          <ProgressBar
            now={parseFloat(progressData.progress)}
            label={`${parseFloat(progressData.progress).toFixed(2)}%`}
            striped
            animated
            variant="success"
            className="mb-4"
          />

          <Table striped bordered hover>
            <tbody>
              <tr>
                <td><strong>Total Duration</strong></td>
                <td>{video.duration} sec</td>
              </tr>
              <tr>
                <td><strong>Last Watched At</strong></td>
                <td>{progressData.lastWatchedAt || 'N/A'} sec</td>
              </tr>
              <tr>
                <td><strong>Certificate Eligibility</strong></td>
                <td>{progressData.isEligibleForCertificate ? 'Yes' : 'No'}</td>
              </tr>
            </tbody>
          </Table>

          <h5 className="mt-5">Visual Watch History</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={graphData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Duration (s)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="duration" name="Watched Duration"
                fill="#0d6efd"
                isAnimationActive={false}
              >
                <LabelList dataKey="duration" position="top" />
              </Bar>
              <Bar
                dataKey="duration"
                data={graphData.filter(item => item.type === 'skipped')}
                fill="red"
                name="Skipped Duration"
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 text-center">
            <Button variant="success" onClick={handleCertificateCheck}>
              🎓 Check Certificate Eligibility
            </Button>
          </div>
        </>
      ) : (
        <p className="text-danger mt-4">No progress report found for this video.</p>
      )}

      <Button variant="secondary" className="mt-4" onClick={() => navigate('/videos')}>
        Back to Videos
      </Button>
    </Container>
  );
};

export default VideoProgressReport;
