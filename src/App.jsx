
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Progress from './components/Progress';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Video from './components/Video';
import VideoData from './components/VideoData';


function App() {

  return (
    <>
{/* <Video/>
<Progress/>
<VideoData/> */}
  <Router>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
