import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Home from './pages/Home';
import Profile from './components/Profile';
import ProtectedRoutes from './utils/ProtectedRoutes';
import OTPVerify from './components/OTPVerify';
import Docs from './components/Docs';

function App() {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/docs"
          element={
              <Docs />
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoutes>
              <Profile />
            </ProtectedRoutes>
          }
        />

        {/* Auth routes */}
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Register />}
        />
        <Route
          path="/otpverify"
          element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <OTPVerify />}
        />
      </Routes>
    </>
  );
}

export default App;
