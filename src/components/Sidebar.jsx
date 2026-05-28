import { LayoutDashboard, Users, Settings, LogOut } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const itemStyle = (path) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    borderRadius: '10px',
    border: 'none',
    background: isActive(path) ? '#E9F2FF' : 'transparent',
    cursor: 'pointer',
    fontSize: '14px',
    color: isActive(path) ? '#0052CC' : '#42526E',
    fontWeight: isActive(path) ? '600' : '400',
    width: '100%',
    textAlign: 'left',
    transition: '0.2s'
  })

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div style={{
      width: '240px',
      background: '#FFFFFF',
      borderRight: '1px solid #E5E7EB',
      height: '100vh',
      padding: '20px 16px',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div>
        <div onClick={() => navigate('/dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px', cursor: 'pointer' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#0052CC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700' }}>
            T
          </div>
          <span style={{ fontSize: '20px', fontWeight: '700', color: '#172B4D' }}>Taskly</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button style={itemStyle('/dashboard')} onClick={() => navigate('/dashboard')}>
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button style={itemStyle('/equipos')} onClick={() => navigate('/equipos')}>
            <Users size={18} />
            Equipos
          </button>

          <button style={itemStyle('/configuracion')} onClick={() => navigate('/configuracion')}>
            <Settings size={18} />
            Configuración
          </button>
        </div>
      </div>

      {/* Cerrar sesión al fondo */}
      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '16px' }}>
        <button onClick={cerrarSesion}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '12px', borderRadius: '10px', border: 'none',
            background: 'transparent', cursor: 'pointer', fontSize: '14px',
            color: '#BF2600', fontWeight: '500', width: '100%', textAlign: 'left',
            transition: '0.2s'
          }}>
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

export default Sidebar