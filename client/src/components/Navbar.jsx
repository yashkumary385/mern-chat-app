import React from 'react';
import { Navbar, Container, Nav, NavDropdown, Button } from 'react-bootstrap';
import { useUser } from '../hooks/useUser';

const ChatNavbar = ({onEditClick , onDeleteClick , onLogout}) => {
  const {logout , user} = useUser()
  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg" >
  <Container>
    
    <Nav className="me-auto">
    <Navbar.Brand href="#home">Simple Chat App</Navbar.Brand>
    </Nav>
    <Nav className="ms-auto flex gap-2">
      <strong href="#home" className='text-white mt-1 mr-2'>Hello {user?.username}</strong>
      <Button className="btn btn-primary" onClick={onLogout}>Logout</Button>
          <Button 
        onClick={onEditClick} 
    variant="primary"
      >
        Edit Profile
      </Button>
          <Button 
        onClick={onDeleteClick} 
      variant="primary"
      >
        Delete Profile
      </Button>
    </Nav>
  </Container>
</Navbar>

  );
};

export default ChatNavbar;
