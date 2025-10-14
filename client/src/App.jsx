import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import Home from './pages/Home'
import Profile from './components/Profile'
import ProtectedRoutes from './utils/ProtectedRoutes'
import OTPVerify from './components/OTPVerify'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/dashboard' element={
          <ProtectedRoutes>
            <Dashboard />
          </ProtectedRoutes>
        } />
        <Route path='/docs' element={
          <ProtectedRoutes>
            <Dashboard />
          </ProtectedRoutes>
        } />
        <Route path="/profile" element={
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otpverify" element={<OTPVerify />} />
      </Routes>
    </>
  )
}

export default App
