import Home from './components/Home';
import About from './components/About';
import SignIn from './components/SignIn';
import 'font-awesome/css/font-awesome.min.css';
import { Link } from 'react-scroll';
import { Navbar, Nav, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import PatientUI from './components/PatientUI'

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
    component: SignIn,
  },
];

// FIXME: Temporarily comment out Home/ and render static PatientUI

// function App() {
//   return (
//     <div className="App">
//       <header>
//         <Navbar bg="dark" variant="dark" className="fixed-top">
//           <Container>
//             <Navbar.Brand href="#">Health Journal</Navbar.Brand>
//             <Nav className="ml-auto">
//               {/* Use Link for smooth scrolling */}
//               {HOME_CONTENT_ITEMS.map((menu) => (
//                 <Link 
//                   to={menu.title}
//                   smooth={true}
//                   offset={-200}
//                   duration={500}
//                   delay={0}
//                 >
//                   <Nav.Item as="div" className="nav-item">{menu.title}</Nav.Item>
//                 </Link>
//               ))}
//             </Nav>
//           </Container>
//         </Navbar>
//       </header>
      
//       <div style={{ paddingTop: '50px' }}>
//         {HOME_CONTENT_ITEMS.map((menu) => (
//           <div className="content overlay" id={menu.title}>
//             {<menu.component/>}
//           </div>
//         ))}
//       </div>
//     </div>

//   );
// }

function App() {
  return (
    <div className='App'>
      <PatientUI/>
    </div>
  )
}

export default App;
