import React from 'react';
import { ProgressBar, Container } from 'react-bootstrap'; // ✅ Import ProgressBar

const Progress = () => {
  const now = 10;

  return (
    <Container>
      <h4>Learning Progress</h4>
      <ProgressBar now={now} label={`${now}%`} />
    </Container>
  );
};

export default Progress;
