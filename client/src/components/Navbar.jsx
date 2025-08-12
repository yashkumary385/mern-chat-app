import React from 'react';
import { Navbar, Container, Nav, NavDropdown, Button } from 'react-bootstrap';
import { useUser } from '../hooks/useUser';

const ChatNavbar = ({onEditClick , onDeleteClick}) => {
  const {logout , user} = useUser()
  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg">
  <Container>
    
    {/* Left side nav */}
    <Nav className="me-auto">
    <Navbar.Brand href="#home">Simple Chat App</Navbar.Brand>


    </Nav>
    
    {/* Right side nav */}
    <Nav className="ms-auto flex gap-2">
      <Nav.Link href="#home">Hello {user?.username}</Nav.Link>
      <Nav.Link  className="btn btn-primary" onClick={logout}>Logout</Nav.Link>
          <button 
        onClick={onEditClick} 
        className="btn btn-primary"
      >
        Edit Profile
      </button>
          <button 
        onClick={onDeleteClick} 
        className="btn btn-primary"
      >
        Delete Profile
      </button>
    </Nav>
  </Container>
</Navbar>

  );
};

export default ChatNavbar;
