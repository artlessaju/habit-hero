import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Header from './Components/Header'
import Footer from './Components/Footer'
import Intro from './Pages/Intro'
import UserAuth from './Pages/UserAuth'
import AddHabits from './Pages/AddHabitsAndCategories'
import View from './Pages/View'
import Track from './Pages/Track'

function App() {

  const location = useLocation();
  // Only show header/footer if NOT on the Intro page ('/')
  const showHeaderAndFooter = location.pathname !== '/';

  return (
    <div className="d-flex flex-column min-vh-100">
      
      {showHeaderAndFooter && <Header />}

      <main className="flex-grow-1">
        <Routes>
          {/* Landing Page */}
          <Route path='/' element={<Intro/>}/>
          
          {/* Auth Pages */}
          <Route path='/login' element={<UserAuth />}/>
          <Route path='/register' element={<UserAuth register/>}/>
          
          {/* Dashboard */}
          <Route path='/add-habits' element={<AddHabits/>}/>
          
          {/* DYNAMIC ROUTE FIX: This allows /view/fitness, /view/learning, etc. */}
          <Route path='/view/:category' element={<View/>}/>
          
          {/* Tracking Page */}
          <Route path='/track' element={<Track/>}/>
        </Routes>
      </main>

      {showHeaderAndFooter && <Footer />}
      
    </div>
  )
}

export default App