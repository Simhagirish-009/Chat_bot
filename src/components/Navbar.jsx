import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function AppNavbar() {
  const navigate = useNavigate();
  const isAuth = !!localStorage.getItem("access");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand>AI ChatBot 🤖</Navbar.Brand>
        <Nav className="ms-auto">
          {!isAuth ? (
            <>
              <Button
                variant="outline-light"
                className="me-2"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button variant="light" onClick={() => navigate("/register")}>
                Register
              </Button>
            </>
          ) : (
            
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}
