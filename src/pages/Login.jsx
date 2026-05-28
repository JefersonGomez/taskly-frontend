import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const res = await api.post('/login', { email, password })

      localStorage.setItem('token', res.data.token)

      navigate('/dashboard')

    } catch {
      setError('Email o contraseña incorrectos')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F4F5F7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>

      <div style={{ width: '420px' }}>

        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '14px'
          }}>
            <div style={{
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
            }}>
              T
            </div>

            <span style={{
              fontSize: '32px',
              fontWeight: '800',
              color: '#172B4D'
            }}>
              Taskly
            </span>
          </div>

          <p style={{
            color: '#5E6C84',
            fontSize: '16px'
          }}>
            Bienvenido de nuevo
          </p>

        </div>

        <div style={{
          background: '#fff',
          borderRadius: '24px',
          padding: '34px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
        }}>

          {error && (
            <div style={{
              background: '#FFEBE6',
              color: '#BF2600',
              padding: '14px',
              borderRadius: '12px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Contraseña</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
            />
          </div>

          <button
            onClick={handleLogin}
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
            Iniciar sesión
          </button>

          <p style={{
            marginTop: '24px',
            textAlign: 'center',
            color: '#5E6C84'
          }}>
            ¿No tienes cuenta?{' '}
            <Link
              to="/registro"
              style={{
                color: '#0052CC',
                fontWeight: '700',
                textDecoration: 'none'
              }}
            >
              Regístrate
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
  outline: 'none'
}

export default Login