
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

const VideoPlayer = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const video = state?.video;

    if (!video) {
        return (
            <Container className="text-center mt-5">
                <h4>Video not found.</h4>
                <Button onClick={() => navigate('/videodata')}>🔙 Back to Videos</Button>
            </Container>
        );
    }

    return (
        <Container className="mt-4 text-center">
            <h3>{video.title}</h3>
            <video width="640" height="360" controls>
                <source src={`http://localhost:4000/videos/${video.url}`} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <p className="mt-2">Duration: {video.duration} sec</p>
            <Button variant="secondary" onClick={() => navigate('/videodata')}>
                🔙 Back to List
            </Button>

            <Button
                variant="info"
                className="mt-2 ms-2"
                onClick={() =>
                    navigate('/progress-report', {
                        state: { video, userId: '6832358e4e711450505535cd' } // replace with dynamic userId if available
                    })
                }
            >
                📈 View Progress
            </Button>

        </Container>
    );
};

export default VideoPlayer;
