import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { logHabitAPI, getHabitsAPI } from '../services/allAPIs';
import {
  MDBContainer, MDBRow, MDBCol, MDBBtn, MDBCard, MDBCardBody, MDBTextArea, MDBIcon,
  MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody
} from 'mdb-react-ui-kit';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';

function Track() {
  const location = useLocation();
  const navigate = useNavigate();
  const habitInitial = location.state?.habit;

  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState("");
  const [motivation, setMotivation] = useState("");
  const [basicModal, setBasicModal] = useState(false);
  const [logs, setLogs] = useState([]);
  
  // STATS STATE
  const [pieData, setPieData] = useState([]);
  const [graphData, setGraphData] = useState([]);

  // --- 1. CALCULATE CHARTS (MOVED TO TOP) ---
  const calculateStats = (history) => {
    if (!history) return; // Safety check

    const completed = history.filter(l => l.status === "Completed").length;
    const missed = history.filter(l => l.status === "Missed").length;
    setPieData([
      { name: 'Completed', value: completed, color: '#198754' },
      { name: 'Missed', value: missed, color: '#dc3545' }
    ]);

    const trend = history.map(h => ({
      day: h.date.split('-')[2],
      score: h.sentiment === "Positive" ? 10 : h.sentiment === "Negative" ? 2 : 5
    }));
    setGraphData(trend.slice(-5));
  };

  // --- 2. REFRESH DATA (Uses calculateStats) ---
  const refreshData = async () => {
    if (!habitInitial) return;
    const userId = localStorage.getItem("user_id");
    const result = await getHabitsAPI(userId);
    
    if (result && result.status === 200) {
      const currentHabit = result.data.find(h => h.id === habitInitial.id);
      if (currentHabit) {
        // Use empty array [] if logs are missing to prevent crash
        const history = currentHabit.logs || []; 
        setLogs(history);
        calculateStats(history);
      }
    }
  };

  useEffect(() => {
    if (!habitInitial) {
      alert("No habit selected!");
      navigate('/add-habits');
    } else {
      refreshData();
    }
  }, []);

  // --- 3. VALIDATION FUNCTION ---
  const checkLimitation = () => {
    const todayStr = date.toISOString().split('T')[0];
    const frequency = habitInitial.frequency;

    // RULE 1: DAILY LIMIT
    const alreadyLoggedToday = logs.some(log => log.date === todayStr);
    
    if (alreadyLoggedToday) {
      alert(`⚠️ You have already logged an entry for ${todayStr}.`);
      return false;
    }

    // RULE 2: WEEKLY LIMIT
    if (frequency === "Weekly") {
      const currentDay = date.getDay();
      const diff = date.getDate() - currentDay + (currentDay === 0 ? -6 : 1); 
      const monday = new Date(date);
      monday.setDate(diff);
      monday.setHours(0, 0, 0, 0);

      const loggedThisWeek = logs.some(log => {
        const logDate = new Date(log.date);
        return logDate >= monday;
      });

      if (loggedThisWeek) {
        alert("⚠️ Weekly Limit Reached: You have already logged this habit this week.");
        return false;
      }
    }

    return true;
  };

  // --- 4. HANDLE LOGGING ---
  const handleLog = async (status) => {
    if (!checkLimitation()) return;

    const today = date.toISOString().split('T')[0];
    
    const payload = {
      date: today,
      status: status,
      note: note
    };

    const result = await logHabitAPI(habitInitial.id, payload);

    if (result.status === 200) {
      const sentiment = result.data.sentiment;
      let msg = "";
      
      if (status === "Completed") {
        msg = sentiment === "Positive" 
          ? "🔥 You're on fire! Your mindset is unstoppable." 
          : "✅ Done! Even on tough days, you showed up.";
      } else {
        msg = "It's okay. Rest, reset, and come back stronger tomorrow.";
      }
      
      setMotivation(msg);
      setBasicModal(true);
      refreshData();
      setNote("");
    } else {
      alert("Failed to log.");
    }
  };

  // --- 5. CALENDAR TILE COLORING ---
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      const log = logs.find(l => l.date === dateString);
      if (log) {
        return log.status === "Completed" ? "bg-success text-white rounded-circle" : "bg-danger text-white rounded-circle";
      }
    }
  };

  return (
    <MDBContainer fluid className="py-4">
      <h2 className="text-center fw-bold mb-4 text-uppercase">{habitInitial?.name} TRACKER</h2>

      <MDBRow className="g-4">
        {/* Left Col */}
        <MDBCol md="6">
          <MDBCard className="shadow-sm border rounded-0 mb-4" style={{ height: '400px' }}>
            <MDBCardBody className="d-flex flex-column align-items-center justify-content-center">
              <h5 className="fw-bold text-muted mb-3">HISTORY</h5>
              <Calendar onChange={setDate} value={date} tileClassName={tileClassName} className="border-0" />
            </MDBCardBody>
          </MDBCard>

          <MDBCard className="shadow-sm border rounded-0" style={{ height: '300px' }}>
            <MDBCardBody className="d-flex flex-column justify-content-center text-center">
              <h5 className="fw-bold text-muted mb-3">LOG FOR: {date.toDateString()}</h5>
              <MDBTextArea label='How do you feel?' rows={2} value={note} onChange={(e) => setNote(e.target.value)} className="mb-5 rounded-0"/>
              <div className="d-flex gap-2 justify-content-center mt-3">
                <MDBBtn onClick={() => handleLog("Completed")} color="success" className="rounded-0 px-5">DONE</MDBBtn>
                <MDBBtn onClick={() => handleLog("Missed")} color="danger" outline className="rounded-0 px-5">MISSED</MDBBtn>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        {/* Right Col */}
        <MDBCol md="6">
          <MDBCard className="shadow-sm border rounded-0 mb-4" style={{ height: '400px' }}>
            <MDBCardBody>
              <h5 className="fw-bold text-muted text-center mb-1">CONSISTENCY</h5>
              <div style={{ width: '100%', height: '320px' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value">
                      {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip /><Legend verticalAlign="bottom"/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </MDBCardBody>
          </MDBCard>

          <MDBCard className="shadow-sm border rounded-0" style={{ height: '300px' }}>
            <MDBCardBody>
              <h5 className="fw-bold text-muted text-center mb-1">MOOD TREND</h5>
              <div style={{ width: '100%', height: '230px' }}>
                <ResponsiveContainer>
                  <LineChart data={graphData}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#0d6efd" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      {/* Modal */}
      <MDBModal open={basicModal} onClose={() => setBasicModal(false)} tabIndex='-1'>
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader className="bg-success text-white">
              <MDBModalTitle>Habit Logged</MDBModalTitle>
              <MDBBtn className='btn-close-white' color='none' onClick={() => setBasicModal(false)}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody className="text-center p-4">
              <MDBIcon fas icon="robot" size="2x" className="text-success mb-3"/>
              <h5 className="fw-bold">{motivation}</h5>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </MDBContainer>
  );
}

export default Track;