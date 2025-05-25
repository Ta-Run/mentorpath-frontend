import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Spinner, Table, Button, ProgressBar } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Legend, Cell
} from 'recharts';




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

          const coloredGraph = (data.graph || []).map((chunk, index) => ({
            name: chunk.time,
            status: chunk.status,
            duration: 5,
            fill: chunk.status === 'watched' ? '#198754' : '#dc3545'
          }));

          setProgressData(data);
          setGraphData(coloredGraph);
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
  const isWatchTimeInvalid = progressData && progressData.lastWatchedAt > video.duration;
  return (
    <Container className="mt-4 container-no-scroll" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
      <div className='d-flex justify-content-between mb-5'>

        <h3>📊 Progress Report for: {video.title}</h3>
        <Button variant="secondary" className="" onClick={() => navigate('/videos')}>
          Back to Videos
        </Button>
      </div>


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
            variant={isWatchTimeInvalid ? "danger" : "success"}
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



          <h5 className="mt-5">🎬 Visual Watch History</h5>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={graphData}
              margin={{ top: 40, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="watched" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#198754" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#198754" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="unwatched" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc3545" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#dc3545" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                label={{ value: 'Duration (s)', angle: -90, position: 'insideLeft' }}
                allowDecimals={false}
              />
              <Tooltip
                formatter={(value, name, props) => [`${value} seconds`, props.payload.status.toUpperCase()]}
              />
              {/* <Legend verticalAlign="top" height={36} /> */}
              <Bar dataKey="duration" name="Video Progress">
                <LabelList dataKey="status" position="top" />
                {
                  graphData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#${entry.status === 'watched' ? 'watched' : 'unwatched'})`}
                    />
                  ))
                }
              </Bar>
            </BarChart>
          </ResponsiveContainer>




          <div className="mt-4 text-center">
            <Button
              variant={isWatchTimeInvalid ? "danger" : "success"}
              onClick={handleCertificateCheck}
              disabled={isWatchTimeInvalid}
            >
              🎓 Get Certificate
            </Button>
          </div>
        </>
      ) : (
        <p className="text-danger mt-4">No progress report found for this video.</p>
      )}


    </Container>
  );
};

export default VideoProgressReport;
