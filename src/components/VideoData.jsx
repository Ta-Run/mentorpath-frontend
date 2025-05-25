import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const VideoData = () => {
  return (
   <>
       <Container>
    <Row>
        <Col> <Card style={{ width: '' }}>
      <Card.Body>
        <Card.Title>06:00</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Unique Time Watched</Card.Subtitle>
    
       
      </Card.Body>
    </Card></Col>
        <Col> <Card style={{ width: '' }}>
      <Card.Body>
        <Card.Title>10:00</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Total Play Time</Card.Subtitle>
    
       
      </Card.Body>
    </Card></Col>
        <Col> <Card style={{ width: '' }}>
      <Card.Body>
        <Card.Title>100%</Card.Title>
        <Card.Subtitle className="mb-2 text-muted"> Watch Efficiency
</Card.Subtitle>
    
       
      </Card.Body>
    </Card></Col>
      </Row>
    </Container>
   </>
  )
}

export default VideoData