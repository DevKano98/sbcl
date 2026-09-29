import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { RegisterPage } from './pages/RegisterPage'
import { BuilderPage } from './pages/BuilderPage'
import { SuccessPage } from './pages/SuccessPage'

export default function App() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/builder/:registrationId" element={<BuilderPage />} />
    <Route path="/success/:registrationId" element={<SuccessPage />} />
    <Route path="*" element={<LandingPage />} />
  </Routes></BrowserRouter>
}
