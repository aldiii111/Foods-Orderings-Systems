import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Home } from '@/page/home'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/test-api" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
