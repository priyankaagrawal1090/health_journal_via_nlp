import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import About from './components/About';
import SignIn from './components/SignIn';
import PatientUI from './components/PatientUI';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';


function App() {
  return (
    <div className="App">
      <Router>
        {/* <Home/> */}
        <Routes>
          <Route path="" element={<Home/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/about" element={<About />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
