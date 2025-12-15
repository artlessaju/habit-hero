import React, { useState } from 'react';
import { MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { addHabitAPI } from '../services/allAPIs';    // Import your API bridge

function AddHabits() {
  const navigate = useNavigate();
  
  // State for form data
  const [habitData, setHabitData] = useState({
    name: "",
    category: "Fitness", 
    startDate: new Date().toISOString().split('T')[0], // Default to today
    frequency: "Daily"
  });

  const handleSubmit = async () => {
    // 1. Get User ID from Login
    const userId = localStorage.getItem("user_id");
    
    if (!userId) {
      alert("Please login first!");
      navigate('/login');
      return;
    }

    if (!habitData.name) {
      alert("Please enter a habit name");
      return;
    }

    try {
      // 2. Send to Python
      // Backend expects: name, category, frequency, start_date
      const payload = {
        name: habitData.name,
        category: habitData.category,
        frequency: habitData.frequency,
        start_date: habitData.startDate
      };

      const result = await addHabitAPI(payload, userId);

      if (result.status === 200) {
        alert("Habit Created Successfully!");
        // Redirect to the View page for that category
        navigate(`/view/${habitData.category.toLowerCase().replace(" ", "-")}`);
      } else {
        alert("Failed to create habit.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  }

  return (
    <div className="container py-5">
      <div className="row h-100">
        
        {/* === LEFT COLUMN: FORM === */}
        <div className="col-md-6 col-lg-5 mb-4 mb-md-0">
          <div className="card shadow-sm border h-100">
            <div className="card-body p-5">
              
              <h3 className="mb-4 fw-bold text-dark">New Habit</h3>

              {/* Habit Name */}
              <div className="mb-4">
                <MDBInput 
                  label="Habit Name" 
                  type="text" 
                  size="lg"
                  value={habitData.name}
                  onChange={(e) => setHabitData({...habitData, name: e.target.value})}
                />
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="form-label text-muted small text-uppercase fw-bold">Category</label>
                <select 
                  className="form-select form-select-lg rounded-0"
                  value={habitData.category}
                  onChange={(e) => setHabitData({...habitData, category: e.target.value})}
                >
                  <option value="Fitness">Fitness</option>
                  <option value="Mental Health">Mental Health</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Learning">Learning</option>
                </select>
              </div>

              {/* Start Date */}
              <div className="mb-4">
                <label className="form-label text-muted small text-uppercase fw-bold">Start Date</label>
                <input 
                  type="date" 
                  className="form-control form-control-lg rounded-0" 
                  value={habitData.startDate}
                  onChange={(e) => setHabitData({...habitData, startDate: e.target.value})}
                />
              </div>

               {/* Frequency */}
               <div className="mb-4">
                <label className="form-label text-muted small text-uppercase fw-bold">Frequency</label>
                <select 
                  className="form-select form-select-lg rounded-0"
                  value={habitData.frequency}
                  onChange={(e) => setHabitData({...habitData, frequency: e.target.value})}
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                </select>
              </div>

              {/* Submit Button */}
              <MDBBtn onClick={handleSubmit} className="w-100 rounded-0" size='lg' style={{ backgroundColor: '#333' }}>
                Create Habit
              </MDBBtn>

            </div>
          </div>
        </div>

        {/* === RIGHT COLUMN: NAVIGATION === */}
        <div className="col-md-6 col-lg-7 d-none d-md-block">
          <div className="h-100 p-5 bg-light border d-flex flex-column justify-content-center align-items-center text-center">
            <h2 className="fw-bold text-muted mb-3">YOUR CATEGORIES</h2>
            <p className="text-muted mb-4">Click a category below to view your progress.</p>
            <div className="d-flex flex-wrap justify-content-center gap-3 w-100">
              {['Fitness', 'Mental Health', 'Productivity', 'Learning'].map((cat) => (
                <Link to={`/view/${cat.toLowerCase().replace(" ", "-")}`} className="text-decoration-none text-dark" key={cat}>
                  <div className="p-4 bg-white border shadow-sm text-center element-hover" style={{ width: '140px', cursor: 'pointer' }}>
                    <i className={`fas fa-${cat === 'Fitness' ? 'running' : cat === 'Learning' ? 'book' : cat === 'Productivity' ? 'check-circle' : 'brain'} fa-2x mb-2 text-primary`}></i>
                    <h6 className="m-0 fw-bold">{cat}</h6>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
      <style>{`.element-hover:hover { transform: translateY(-5px); transition: transform 0.2s ease; border-color: #0d6efd !important; }`}</style>
    </div>
  );
}

export default AddHabits;