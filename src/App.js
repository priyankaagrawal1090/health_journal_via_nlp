import Home from "./components/Home";
import About from "./components/About";
import SignIn from "./components/SignIn";
import AuthForm from "./components/AuthForm";
import "font-awesome/css/font-awesome.min.css";
import { Link as ScrollLink } from "react-scroll";
import { Navbar, Nav, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import PatientUI from "./components/PatientUI";
import Login from "./components/Login";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

export const HOME_CONTENT_ITEMS = [
  {
    id: 1,
    title: "Home",
    description: "Welcome to our application",
    component: Home,
  },
  {
    id: 2,
    title: "About",
    description: "Learn more about our application",
    component: About,
  },
  {
    id: 3,
    title: "Sign In",
    description: "Explore more by signing in",
    component: AuthForm,
  },
];

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <Navbar bg="dark" variant="dark" className="fixed-top">
            <Container>
              <Navbar.Brand href="#">Health Journal</Navbar.Brand>
              <Nav className="ml-auto">
                {/* Use Link for smooth scrolling */}
                {HOME_CONTENT_ITEMS.map((menu) => (
                  <ScrollLink
                    to={menu.title}
                    smooth={true}
                    offset={-200}
                    duration={500}
                    delay={0}
                  >
                    <Nav.Item as="div" className="nav-item">
                      {menu.title}
                    </Nav.Item>
                  </ScrollLink>
                ))}
              </Nav>
            </Container>
          </Navbar>
        </header>
        <div style={{ paddingTop: "50px" }}>
          <div className="content overlay">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/patient-ui" element={<PatientUI />} />
              <Route path="/" element={<Login />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

// function App() {
//   return (
//     <>
//       <PatientUI />
//     </>
//   );
// }

export default App;
