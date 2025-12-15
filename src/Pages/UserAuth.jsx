import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginAPI, registerAPI } from '../services/allAPIs'; // Import the API

function UserAuth({ register }) {
  const navigate = useNavigate();
  const registerForm = register ? true : false;

  // State to hold inputs
  const [userData, setUserData] = useState({
    username: "",
    password: ""
  });

  // Handle Input Change
  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Handle Submit
  const handleAuth = async (e) => {
    e.preventDefault();
    
    if (!userData.username || !userData.password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      if (registerForm) {
        // --- REGISTER LOGIC ---
        const result = await registerAPI(userData);
        if (result.status === 200) {
          alert("Registration Successful! Please Login.");
          navigate('/login');
        } else {
          alert(result.data.detail || "Registration Failed");
        }
      } else {
        // --- LOGIN LOGIC ---
        const result = await loginAPI(userData);
        if (result.status === 200) {
          // Save User ID to LocalStorage (So we know who is logged in)
          localStorage.setItem("user_id", result.data.user_id);
          localStorage.setItem("username", result.data.username);
          
          alert("Login Successful!");
          navigate('/add-habits');
        } else {
          alert(result.data.detail || "Invalid Credentials");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Server Connection Failed. Is Python running?");
    }
  };

  return (
    <div className='container p-4' style={{ marginTop: '50px' }}>
      <div className="row align-items-center">
        
        {/* Left Side (Image) - Kept same as before */}
        <div className="col-lg-6 col-md-6 p-5 d-none d-md-block">
          <img 
            className='rounded shadow img-fluid' 
            src={registerForm ? 'https://static.vecteezy.com/system/resources/previews/021/272/478/original/isometric-flat-3d-illustration-concept-of-man-filling-registration-form-on-screen-free-vector.jpg' : 'https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg'} 
            alt="Auth"
          />
        </div>

        {/* Right Side (Form) */}
        <div className="col-lg-6 col-md-6">
          <div className="card shadow p-4">
            <div className="text-center">
              <h2 className='mt-2 fw-bold text-primary'>Habit Hero</h2>
              <h5 className='mt-2 text-muted'>{registerForm ? 'Create Account' : 'Welcome Back'}</h5>
            </div>

            <form className='p-3'>
              {/* Username */}
              <div className="mb-3">
                <input 
                  type="text" name="username"
                  placeholder='Username' className='form-control' 
                  value={userData.username} onChange={handleInput}
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <input 
                  type="password" name="password"
                  placeholder='Password' className='form-control' 
                  value={userData.password} onChange={handleInput}
                />
              </div>

              {/* Buttons */}
              <div className='text-center d-grid gap-2'>
                <button onClick={handleAuth} className={`btn ${registerForm ? 'btn-info text-white' : 'btn-success'} fw-bold`}>
                  {registerForm ? 'Sign Up' : 'Login'}
                </button>
                <p className='mt-3'>
                  {registerForm ? "Already registered?" : "New here?"} 
                  <Link to={registerForm ? '/login' : '/register'} className="text-decoration-none ms-1">
                    {registerForm ? "Login" : "Register"}
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserAuth;