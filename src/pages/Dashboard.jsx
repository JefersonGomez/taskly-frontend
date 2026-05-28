import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Sidebar from '../components/Sidebar'

function Dashboard() {
  const [equipos, setEquipos] = useState([])
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [refresh, setRefresh] = useState(false)

  const navigate = useNavigate()

  const [usuario, setUsuario] = useState(null)

  useEffect(() => {
  api.get('/me').then(res => setUsuario(res.data))
  api.get('/equipos')
    .then(res => setEquipos(res.data || []))
    .catch(() => navigate('/login'))
}, [refresh])


  useEffect(() => {
  api.get('/equipos')
    .then(res => setEquipos(res.data || []))
    .catch(() => navigate('/login'))
}, [refresh])

  const crearEquipo = async () => {
    if (!nombre.trim()) return

    try {
      await api.post('/equipos', {
        nombre,
        descripcion
      })

      setNombre('')
      setDescripcion('')
      setMostrarForm(false)
      setRefresh(r => !r)

    } catch (error) {
      console.error('Error creando equipo', error)
    }
  }

  const colores = [
    '#0052CC',
    '#0F6E56',
    '#534AB7',
    '#BF2600',
    '#FF8B00'
  ]

  return (
    <div
      style={{
        display: 'flex',
        background: '#F4F5F7',
        minHeight: '100vh'
      }}
    >

      <Sidebar />

      <div
        style={{
          marginLeft: '240px',
          width: '100%',
          padding: '40px'
        }}
      >

        {/* HERO */}
        <div
          style={{
            marginBottom: '40px'
          }}
        >
          <h1
            style={{
              fontSize: '52px',
              fontWeight: '800',
              color: '#172B4D',
              marginBottom: '12px'
            }}
          >
            Hola de nuevo, {usuario?.nombre}.
          </h1>

          <p
            style={{
              fontSize: '18px',
              color: '#5E6C84'
            }}
          >
            Continúa donde lo dejaste
          </p>
        </div>

        {/* CARD PRINCIPAL */}
        {equipos.length > 0 && (
          <div
            onClick={() => navigate(`/equipos/${equipos[0].ID}`)}
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '40px',
              border: '1px solid #E5E7EB',
              cursor: 'pointer',
              transition: '0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)'
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.06)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0px)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '18px'
              }}
            >

              <div
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '16px',
                  background: '#9FD356',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '30px',
                  fontWeight: '700',
                  color: '#3D4F1C'
                }}
              >
                {equipos[0]?.nombre?.charAt(0)}
              </div>

              <div>
                <h2
                  style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#172B4D',
                    marginBottom: '6px'
                  }}
                >
                  {equipos[0]?.nombre}
                </h2>

                <p
                  style={{
                    color: '#5E6C84'
                  }}
                >
                  {equipos[0]?.descripcion || 'Sin descripción'}
                </p>
              </div>

            </div>

            <button
              style={{
                background: '#FFB800',
                border: 'none',
                padding: '14px 24px',
                borderRadius: '999px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Ir al proyecto
            </button>

          </div>
        )}

        {/* HEADER */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}
        >

          <h2
            style={{
              fontSize: '26px',
              fontWeight: '700',
              color: '#172B4D'
            }}
          >
            Tus espacios de trabajo
          </h2>

          <button
            onClick={() => setMostrarForm(!mostrarForm)}
            style={{
              background: '#0052CC',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 20px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            + Crear equipo
          </button>

        </div>

        {/* FORM */}
        {mostrarForm && (
          <div
            style={{
              background: '#fff',
              borderRadius: '20px',
              padding: '24px',
              marginBottom: '30px',
              border: '1px solid #E5E7EB'
            }}
          >

            <h3
              style={{
                fontSize: '22px',
                fontWeight: '700',
                marginBottom: '20px',
                color: '#172B4D'
              }}
            >
              Crear nuevo equipo
            </h3>

            <input
              type="text"
              placeholder="Nombre del equipo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid #D0D7DE',
                marginBottom: '14px',
                fontSize: '15px',
                outline: 'none'
              }}
            />

            <textarea
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid #D0D7DE',
                marginBottom: '20px',
                fontSize: '15px',
                outline: 'none',
                resize: 'none'
              }}
            />

            <div
              style={{
                display: 'flex',
                gap: '12px'
              }}
            >

              <button
                onClick={crearEquipo}
                style={{
                  background: '#0052CC',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Crear equipo
              </button>

              <button
                onClick={() => setMostrarForm(false)}
                style={{
                  background: '#fff',
                  color: '#172B4D',
                  border: '1px solid #D0D7DE',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Cancelar
              </button>

            </div>

          </div>
        )}

        {/* GRID */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}
        >

          {equipos.map((equipo, i) => (
            <div
              key={equipo.ID}
              onClick={() => navigate(`/equipos/${equipo.ID}`)}
              style={{
                background: '#fff',
                borderRadius: '18px',
                overflow: 'hidden',
                border: '1px solid #E5E7EB',
                cursor: 'pointer',
                transition: '0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >

              <div
                style={{
                  background: colores[i % colores.length],
                  height: '100px'
                }}
              />

              <div
                style={{
                  padding: '20px'
                }}
              >

                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#172B4D',
                    marginBottom: '10px'
                  }}
                >
                  {equipo.nombre}
                </h3>

                <p
                  style={{
                    color: '#5E6C84',
                    lineHeight: '1.5'
                  }}
                >
                  {equipo.descripcion || 'Sin descripción'}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  )
}

export default Dashboard