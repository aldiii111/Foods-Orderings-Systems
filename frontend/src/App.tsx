import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { SidebarProvider, SidebarInset, SidebarTrigger } from './components/ui/sidebar'
import { Home } from '@/page/auth/home'
import { SidebarComp } from './components/Sidebar'
import { AuthProvider } from './context/authContext'
import { ChooseRole } from './page/auth/chooseRole'

function RouteApp() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/choose-role" element={<ChooseRole />} />
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
