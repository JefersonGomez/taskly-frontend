import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'

function Registro() {

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const handleRegistro = async () => {

    try {

      await api.post('/registro', {
        nombre,
        email,
        password
      })

      navigate('/login')

    } catch {

      setError('Error al crear la cuenta')

    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F4F5F7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >

      <div style={{ width: '420px' }}>

        {/* LOGO */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '30px'
          }}
        >

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '14px'
            }}
          >

            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: '#0052CC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: '800',
                fontSize: '18px'
              }}
            >
              T
            </div>

            <span
              style={{
                fontSize: '32px',
                fontWeight: '800',
                color: '#172B4D'
              }}
            >
              Taskly
            </span>

          </div>

          <p
            style={{
              color: '#5E6C84',
              fontSize: '16px'
            }}
          >
            Crea tu cuenta gratis
          </p>

        </div>

        {/* CARD */}
        <div
          style={{
            background: '#fff',
            borderRadius: '24px',
            padding: '34px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
          }}
        >

          {error && (
            <div
              style={{
                background: '#FFEBE6',
                color: '#BF2600',
                padding: '14px',
                borderRadius: '12px',
                marginBottom: '20px',
                fontSize: '14px'
              }}
            >
              {error}
            </div>
          )}

          {/* NOMBRE */}
          <div style={{ marginBottom: '18px' }}>

            <label style={labelStyle}>
              Nombre
            </label>

            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              style={inputStyle}
            />

          </div>

          {/* EMAIL */}
          <div style={{ marginBottom: '18px' }}>

            <label style={labelStyle}>
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              style={inputStyle}
            />

          </div>

          {/* PASSWORD */}
          <div style={{ marginBottom: '24px' }}>

            <label style={labelStyle}>
              Contraseña
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
            />

          </div>

          {/* BOTON */}
          <button
            onClick={handleRegistro}
            style={{
              width: '100%',
              padding: '14px',
              background: '#0052CC',
              color: '#fff',
              border: 'none',
              borderRadius: '14px',
              fontWeight: '700',
              fontSize: '15px',
              cursor: 'pointer'
            }}
          >
            Crear cuenta
          </button>

          {/* LOGIN */}
          <p
            style={{
              marginTop: '24px',
              textAlign: 'center',
              color: '#5E6C84'
            }}
          >
            ¿Ya tienes cuenta?{' '}

            <Link
              to="/login"
              style={{
                color: '#0052CC',
                fontWeight: '700',
                textDecoration: 'none'
              }}
            >
              Inicia sesión
            </Link>

          </p>

        </div>

      </div>

    </div>
  )
}

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: '600',
  color: '#172B4D',
  fontSize: '14px'
}

const inputStyle = {
  width: '100%',
  padding: '14px',
  borderRadius: '14px',
  border: '1px solid #D0D7DE',
  fontSize: '15px',
  outline: 'none',
  boxSizing: 'border-box'
}

export default Registro