import { useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div style={{ background: '#0052CC', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.15)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
        <div style={{ width: '28px', height: '28px', background: 'rgba(255,255,255,0.2)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>T</span>
        </div>
        <span style={{ color: '#fff', fontSize: '16px', fontWeight: '600' }}>Taskly</span>
      </div>
      <button onClick={handleLogout}
        style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '6px', padding: '6px 14px', fontSize: '13px' }}>
        Cerrar sesión
      </button>
    </div>
  )
}

export default Navbar