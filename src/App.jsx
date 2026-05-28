import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Dashboard from './pages/Dashboard'
import Equipo from './pages/Equipo'
import Equipos from './pages/Equipos'
import Configuracion from './pages/Configuracion'
import RutaProtegida from './components/RutaProtegida'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        <Route path="/dashboard" element={
          <RutaProtegida><Dashboard /></RutaProtegida>
        } />
        <Route path="/equipos" element={
          <RutaProtegida><Equipos /></RutaProtegida>
        } />
        <Route path="/equipos/:id" element={
          <RutaProtegida><Equipo /></RutaProtegida>
        } />
        <Route path="/configuracion" element={
          <RutaProtegida><Configuracion /></RutaProtegida>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App