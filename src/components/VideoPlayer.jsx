import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

const VideoPlayer = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const video = state?.video;
    const videoRef = useRef(null);
    const [lastSentTime, setLastSentTime] = useState(null);

    const userId = localStorage.getItem('userId');

    const sendProgress = (start, end) => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/progress/addProgressReports`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                videoId: video._id,
                start: Math.floor(start),
                end: Math.floor(end)
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log('Progress sent:', data);
            })
            .catch(err => {
                console.error('Failed to send progress:', err);
            });
    };

    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement || !video) return;

        let intervalId = null;

        const handlePlay = () => {
            console.log('Video started');
            const start = videoElement.currentTime;
            setLastSentTime(start);
            // Send initial progress
            sendProgress(start, start + 1);

            // Start interval updates every 5 seconds
            intervalId = setInterval(() => {
                const current = videoElement.currentTime;
                if (lastSentTime !== null && current - lastSentTime >= 5) {
                    sendProgress(lastSentTime, current);
                    setLastSentTime(current);
                }
            }, 5000);
        };

        const handlePauseOrEnd = () => {
            clearInterval(intervalId);
            const current = videoElement.currentTime;
            if (lastSentTime !== null && current > lastSentTime) {
                sendProgress(lastSentTime, current);
                setLastSentTime(current);
            }
        };

        videoElement.addEventListener('play', handlePlay);
        videoElement.addEventListener('pause', handlePauseOrEnd);
        videoElement.addEventListener('ended', handlePauseOrEnd);

        return () => {
            clearInterval(intervalId);
            videoElement.removeEventListener('play', handlePlay);
            videoElement.removeEventListener('pause', handlePauseOrEnd);
            videoElement.removeEventListener('ended', handlePauseOrEnd);
        };
    }, [video, lastSentTime]);

    if (!video) {
        return (
            <Container className="text-center mt-5">
                <h4>Video not found.</h4>
                <Button onClick={() => navigate('/videos')}>🔙 Back to Videos</Button>
            </Container>
        );
    }

    return (
        <Container className="mt-4 text-center">
            <h3>{video.title}</h3>
            <video ref={videoRef} width="640" height="360" controls>
                <source src={`http://localhost:4000/videos/${video.url}`} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <p className="mt-2">Duration: {video.duration} sec</p>
            <Button variant="secondary" onClick={() => navigate('/videos')}>
                🔙 Back to List
            </Button>

            <Button
                variant="info"
                className="mt-2 ms-2"
                onClick={() =>
                    navigate('/progressreport', {
                        state: { video, userId }
                    })
                }
            >
                📈 View Progress
            </Button>
        </Container>
    );
};

export default VideoPlayer;
