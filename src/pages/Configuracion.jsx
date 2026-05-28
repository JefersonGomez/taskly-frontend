import { useState, useEffect } from 'react'
import api from '../api/axios'
import Sidebar from '../components/Sidebar'

function Configuracion() {
  const [nombre, setNombre] = useState('')
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [usuario, setUsuario] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/me').then(res => {
      setUsuario(res.data)
      setNombre(res.data.nombre)
    })
  }, [])

  const guardar = async () => {
    setMensaje('')
    setError('')

    if (password && password !== confirmar) {
      setError('Las contraseñas no coinciden')
      return
    }

    try {
      const body = {}
      if (nombre && nombre !== usuario?.nombre) body.nombre = nombre
      if (password) body.password = password

      if (Object.keys(body).length === 0) {
        setError('No hay cambios para guardar')
        return
      }

      await api.put('/me', body)
      setMensaje('Cambios guardados correctamente')
      setPassword('')
      setConfirmar('')
    } catch {
      setError('Error al guardar los cambios')
    }
  }

  const iniciales = (nombre) => {
    if (!nombre) return '?'
    return nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div style={{ display: 'flex', background: '#F4F5F7', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ marginLeft: '240px', width: '100%', padding: '32px' }}>

        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#172B4D', marginBottom: '8px' }}>
          Configuración
        </h1>
        <p style={{ color: '#5E6C84', fontSize: '15px', marginBottom: '32px' }}>
          Administra tu cuenta y preferencias
        </p>

        {/* Avatar y nombre actual */}
        <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', marginBottom: '20px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#0052CC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '24px' }}>
            {iniciales(usuario?.nombre)}
          </div>
          <div>
            <p style={{ fontSize: '20px', fontWeight: '700', color: '#172B4D' }}>{usuario?.nombre}</p>
            <p style={{ fontSize: '14px', color: '#5E6C84' }}>{usuario?.email}</p>
          </div>
        </div>

        {/* Formulario */}
        <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid #E5E7EB' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#172B4D', marginBottom: '20px' }}>
            Editar perfil
          </h3>

          {mensaje && (
            <div style={{ background: '#E3FCEF', color: '#006644', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', fontWeight: '600' }}>
              ✓ {mensaje}
            </div>
          )}

          {error && (
            <div style={{ background: '#FFEBE6', color: '#BF2600', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#172B4D', marginBottom: '6px' }}>
              Nombre
            </label>
            <input value={nombre} onChange={e => setNombre(e.target.value)}
              style={inputStyle} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#172B4D', marginBottom: '6px' }}>
              Nueva contraseña
            </label>
            <input type="password" placeholder="Dejar vacío para no cambiar" value={password} onChange={e => setPassword(e.target.value)}
              style={inputStyle} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#172B4D', marginBottom: '6px' }}>
              Confirmar contraseña
            </label>
            <input type="password" placeholder="Repetir nueva contraseña" value={confirmar} onChange={e => setConfirmar(e.target.value)}
              style={inputStyle} />
          </div>

          <button onClick={guardar}
            style={{ background: '#0052CC', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>
            Guardar cambios
          </button>
        </div>

      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '12px',
  border: '1px solid #D0D7DE',
  fontSize: '14px',
  outline: 'none',
  color: '#172B4D',
  background: '#fff'
}

export default Configuracion