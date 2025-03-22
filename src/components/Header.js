// src/components/Header.js
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login'); // Redirige a la página de login tras cerrar sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Gestor Lista de Mercado</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            {currentUser ? (
              <>
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                <Nav.Link onClick={handleLogout}>Cerrar Sesión</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Iniciar Sesión</Nav.Link>
                <Nav.Link as={Link} to="/register">Registrarse</Nav.Link>
              </>
            )}
            <Nav.Link as={Link} to="/contacto">Contacto</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;



