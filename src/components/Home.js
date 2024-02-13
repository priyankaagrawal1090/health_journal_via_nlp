import React from "react";
import { HorizontalNavbar } from "./Navbar";
import PatientUI from "./PatientUI";
import Login from "./Login";
import About from "./About";
import { Navbar, Nav, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { Link as ScrollLink } from "react-scroll";

export const HOME_CONTENT_ITEMS = [
  {
    id: 0,
    title: "Sign In",
    description: "Explore more by signing in",
    component: Login,
  },
  {
    id: 1,
    title: "About",
    description: "Learn more about our application",
    component: About,
  },
];

export default function Home() {
  return (
    <div style={{ paddingTop: "50px" }}>
      <Navbar
        bg="dark"
        variant="dark"
        className="fixed-top rounded"
        style={{ padding: "20px" }}
      >
        <Container>
          <Navbar.Brand href="#">
            <ScrollLink to="0" className="navbar-brand">
              Health Journal
            </ScrollLink>
          </Navbar.Brand>
          <Nav className="ml-auto">
            {/* Use Link for smooth scrolling */}
            {HOME_CONTENT_ITEMS.map((menu) => (
              <ScrollLink
                to={menu.id}
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
      <div id="0" className="content overlay mt-5">
        <Login />
      </div>
      <div id="1" className="content overlay">
        <About />
      </div>
    </div>
  );
}
