import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getHabitsAPI, deleteHabitAPI } from '../services/allAPIs';
import {
  MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn, MDBRow, MDBCol, MDBIcon
} from 'mdb-react-ui-kit';

function View() {
  const { category } = useParams();
  const displayCategory = category ? category.replace('-', ' ').toUpperCase() : "HABITS";
  const [habits, setHabits] = useState([]);

  // 1. FETCH HABITS (Moved INSIDE useEffect to fix the red line error)
  useEffect(() => {
    const fetchHabits = async () => {
      const userId = localStorage.getItem("user_id");
      if (userId) {
        const result = await getHabitsAPI(userId);
        if (result.status === 200) {
          const categoryName = category ? category.replace('-', ' ') : ""; 
          const filtered = result.data.filter(h => 
            h.category.toLowerCase() === categoryName.toLowerCase()
          );
          setHabits(filtered);
        }
      }
    };

    fetchHabits();
  }, [category]); // Now this dependency array is perfectly correct

  // 2. DELETE FUNCTION (Updated to be faster)
  const handleDelete = async (e, habitId) => {
    e.preventDefault(); 
    
    if (window.confirm("Are you sure you want to delete this habit?")) {
      const result = await deleteHabitAPI(habitId);
      if (result.status === 200) {
        alert("Habit deleted!");
        
        // INSTANT UPDATE: Remove the deleted habit from the list immediately
        // (We don't need to call fetchHabits anymore)
        setHabits(habits.filter(habit => habit.id !== habitId));
        
      } else {
        alert("Failed to delete.");
      }
    }
  };

  return (
    <div className="container py-5">
      
      <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
        <h2 className="fw-bold text-dark m-0">{displayCategory}</h2>
        <Link to="/add-habits">
          <MDBBtn outline color="dark" className="rounded-0">+ Add New</MDBBtn>
        </Link>
      </div>

      <MDBRow className="row-cols-1 row-cols-md-3 row-cols-lg-4 g-4"> 
        {habits.length > 0 ? (
          habits.map((habit) => (
            <MDBCol key={habit.id}>
              
              <Link to={`/track`} state={{ habit }} style={{ textDecoration: 'none', color: 'inherit' }}>
                <MDBCard className="h-100 shadow-sm border rounded-0 hover-shadow position-relative">
                  <MDBCardBody>
                    
                    {/* DELETE BUTTON */}
                    <button 
                      onClick={(e) => handleDelete(e, habit.id)}
                      className="btn btn-link position-absolute top-0 end-0 p-3 text-danger"
                      style={{ zIndex: 10 }}
                    >
                      <MDBIcon fas icon="trash" />
                    </button>

                    <MDBCardTitle className="fw-bold mt-2">{habit.name}</MDBCardTitle>
                    <MDBCardText className="text-muted small">
                      {habit.frequency} | Started: {habit.start_date}
                    </MDBCardText>
                  </MDBCardBody>
                </MDBCard>
              </Link>
            </MDBCol>
          ))
        ) : (
          <div className="text-center w-100 mt-5 text-muted">
            <p>No habits found in {displayCategory}.</p>
            <Link to="/add-habits">Create one now</Link>
          </div>
        )}
      </MDBRow>
    </div>
  );
}

export default View;