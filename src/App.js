import { Container, Nav, Navbar, Row, Col, Card } from 'react-bootstrap';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import FormCanchas from "./components/formCanchas";
import FormReservas from './components/formReservas';
import Canchas from './components/canchas';
import Reservas from './components/reservas';
import { SiPaddle } from "react-icons/si";
import { FaHome, FaList, FaPlusCircle, FaCalendarAlt, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { FaCalendarPlus } from "react-icons/fa6";
function Home() {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title className="display-4">Paddle</Card.Title>
              <Card.Text>
                Bienvenido a la aplicación de gestión de canchas y reservas de Paddle
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

function App() {
  return (
    <Router>
      {/* Contenedor principal con layout flex */}
      <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
        {/* Barra de Navegación */}
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand href="/"><SiPaddle style={{ marginRight: "5px" }} />Paddle</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Item>
                  <Nav.Link href="/"><FaHome style={{ marginRight: "5px" }} /> Inicio</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="/canchas"><FaList style={{ marginRight: "5px" }} />Lista de canchas</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="/agregarCancha"><FaPlusCircle style={{ marginRight: "5px" }} />Crear cancha</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="/reservas"><FaCalendarAlt style={{ marginRight: "5px" }} />Lista de reservas</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="/agregarReserva"><FaCalendarPlus style={{ marginRight: "5px" }} />Crear reserva</Nav.Link>
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Contenido principal */}
        <Container className="flex-grow-1 my-4">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/canchas' element={<Canchas />} />
            <Route path='/reservas' element={<Reservas />} />
            <Route path='/agregarCancha' element={<FormCanchas />} />
            <Route path='/agregarReserva' element={<FormReservas />} />
            <Route path='/editarCancha' element={<FormCanchas />} />
            <Route path='/editarReserva' element={<FormReservas />} />
          </Routes>
        </Container>

        {/* Footer */}
        <footer className="footer bg-dark text-white text-center py-4">
          <Container>
            <div className="d-flex justify-content-center align-items-center">
              <SiPaddle style={{ marginRight: "10px", fontSize: "30px" }} />
              <h5>Paddle - 2024</h5>
            </div>
            <div>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="mx-2">
                <FaFacebook size={25} color="#4267B2" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="mx-2">
                <FaInstagram size={25} color="#E4405F" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="mx-2">
                <FaTwitter size={25} color="#1DA1F2" />
              </a>
            </div>
            <p className="mt-3">&copy; 2024 - Paddle. Todos los derechos reservados.</p>
          </Container>
        </footer>
      </div>
    </Router>

    
  );
}

export default App;
