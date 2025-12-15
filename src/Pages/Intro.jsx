import React from 'react'
import './Intro.css'; // Ensure this CSS file contains the animation code
import { Link } from 'react-router-dom';
function Intro() {
  return (
    <div className='intro-container'>
      <Link to={'/register'} style={{textDecoration:'none'}}>
      <div className="card p-5 ">
      <h1 className='tracking-in-expand-fwd fs-1'><i class="fa-solid fa-person-running fa-beat mx-2" style={{color: "#1b1be6ff;"}}></i>HABIT-HERO</h1>
      </div>
      </Link>
 


      
    </div>
  )
}



export default Intro