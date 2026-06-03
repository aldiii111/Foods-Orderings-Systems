import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from './context/authContext'
import { Home } from '@/page/auth/home'
import { ChooseRole } from '@/page/auth/chooseRole'
import { Login } from '@/page/auth/login'
import { Register } from '@/page/auth/signUp'
import { ProtectedRoute } from './components/protectedRoute'
import { Customer } from '@/components/layout/customer'
import { Staff } from '@/components/layout/staff'

function RouteApp() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/choose-role" element={<ChooseRole />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/customer/*"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <Customer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/*"
        element={
          <ProtectedRoute allowedRoles={["staff"]}>
            <Staff />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RouteApp />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
