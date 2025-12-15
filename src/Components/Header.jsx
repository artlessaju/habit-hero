import React from 'react';
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBBtn
} from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("user_id");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    // 1. Clear Data
    localStorage.clear();
    // 2. Redirect to Home
    navigate('/');
  };

  return (
    <MDBNavbar light bgColor='light' className='shadow-sm'>
      <MDBContainer fluid>
        
        {/* LOGO */}
        <Link to='/' className='text-decoration-none'>
          <MDBNavbarBrand className='fw-bold text-dark'>
            <i className="fas fa-check-circle text-primary me-2"></i>
            HABIT HERO
          </MDBNavbarBrand>
        </Link>

        {/* NAVIGATION BUTTONS */}
        <div className='d-flex align-items-center gap-3'>
          
          {isLoggedIn ? (
            <>
              {/* Show this if Logged In */}
              <span className='d-none d-md-block text-muted small fw-bold text-uppercase'>
                Welcome, {username}
              </span>
              
              <Link to='/add-habits'>
                <MDBBtn color='link' className='text-dark fw-bold text-decoration-none'>
                  Dashboard
                </MDBBtn>
              </Link>

              <MDBBtn onClick={handleLogout} color='danger' className='rounded-pill px-4'>
                Logout
              </MDBBtn>
            </>
          ) : (
            <>
              {/* Show this if Logged Out */}
              <Link to='/login'>
                <MDBBtn outline color='primary' className='rounded-pill px-4'>
                  Login
                </MDBBtn>
              </Link>
              
              <Link to='/register'>
                <MDBBtn color='primary' className='rounded-pill px-4'>
                  Get Started
                </MDBBtn>
              </Link>
            </>
          )}

        </div>

      </MDBContainer>
    </MDBNavbar>
  );
}

export default Header;