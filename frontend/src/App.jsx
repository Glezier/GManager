import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Calendar from './pages/Calendar'
import PrivateRoute from './routes/PrivateRoute'
import DayPage from './pages/DayPage'

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />}/>
        <Route path="/" element={<Login />}/>
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
          }
        />
        <Route path="/calendario" element={
          <PrivateRoute>
            <Calendar/>
          </PrivateRoute>
        }
        />
        <Route path='/dia/:data'
        element={
          <PrivateRoute>
            <DayPage />
          </PrivateRoute>
        }
        />
      </Routes>
    </BrowserRouter>
  )
}