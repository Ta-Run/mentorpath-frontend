import { Container } from 'react-bootstrap';
import movieFile from '../assets/video-01.mp4'; // adjust path based on your file location
export const Video = () => {
  return (
    <>
      <Container>
        <video width="320" height="240" controls>
        <source src={movieFile} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      </Container>
    </>
  );
};

export default Video;
