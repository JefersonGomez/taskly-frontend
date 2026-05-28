import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Sidebar from '../components/Sidebar'

function Equipos() {
  const [equipos, setEquipos] = useState([])
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null)
  const [miembros, setMiembros] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/equipos').then(res => setEquipos(res.data || []))
  }, [])

  const verEquipo = async (equipo) => {
    setEquipoSeleccionado(equipo)
    const res = await api.get(`/equipos/${equipo.ID}/miembros`)
    setMiembros(res.data || [])
  }

  const eliminarEquipo = async (id) => {
    await api.delete(`/equipos/${id}`)
    setEquipoSeleccionado(null)
    setMiembros([])
    const res = await api.get('/equipos')
    setEquipos(res.data || [])
  }

  const colores = ['#0052CC', '#0F6E56', '#534AB7', '#BF2600', '#FF8B00']

  const iniciales = (nombre) => {
    if (!nombre) return '?'
    return nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const coloresAvatar = ['#0052CC', '#0F6E56', '#534AB7', '#BF2600', '#FF8B00', '#36B37E']

  return (
    <div style={{ display: 'flex', background: '#F4F5F7', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ marginLeft: '240px', width: '100%', padding: '32px', display: 'flex', gap: '24px' }}>

        {/* Lista de equipos */}
        <div style={{ width: '340px', flexShrink: 0 }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#172B4D', marginBottom: '20px' }}>
            Equipos
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {equipos && equipos.map((equipo, i) => (
              <div
                key={equipo.ID}
                onClick={() => verEquipo(equipo)}
                style={{
                  background: '#fff',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: equipoSeleccionado?.ID === equipo.ID ? '2px solid #0052CC' : '1px solid #E5E7EB',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{ background: colores[i % colores.length], height: '6px' }} />
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '15px', fontWeight: '700', color: '#172B4D' }}>{equipo.nombre}</p>
                    <span style={{ fontSize: '11px', color: '#5E6C84', background: '#F4F5F7', padding: '2px 8px', borderRadius: '999px' }}>
                      Ver →
                    </span>
                  </div>
                  {equipo.descripcion && (
                    <p style={{ fontSize: '12px', color: '#5E6C84', marginTop: '4px' }}>{equipo.descripcion}</p>
                  )}
                </div>
              </div>
            ))}

            {equipos.length === 0 && (
              <div style={{ background: '#fff', borderRadius: '14px', padding: '2rem', textAlign: 'center', border: '1px solid #E5E7EB' }}>
                <p style={{ color: '#5E6C84', fontSize: '14px' }}>No tienes equipos aún</p>
                <button onClick={() => navigate('/dashboard')}
                  style={{ marginTop: '12px', background: '#0052CC', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>
                  Crear equipo
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Detalle del equipo */}
        <div style={{ flex: 1 }}>
          {!equipoSeleccionado ? (
            <div style={{ background: '#fff', borderRadius: '20px', padding: '3rem', textAlign: 'center', border: '1px solid #E5E7EB', marginTop: '52px' }}>
              <p style={{ fontSize: '16px', color: '#5E6C84' }}>Selecciona un equipo para ver su información</p>
            </div>
          ) : (
            <div>
              {/* Header del equipo */}
              <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', marginBottom: '20px', border: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#172B4D', marginBottom: '6px' }}>
                      {equipoSeleccionado.nombre}
                    </h2>
                    <p style={{ fontSize: '14px', color: '#5E6C84' }}>
                      {equipoSeleccionado.descripcion || 'Sin descripción'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => navigate(`/equipos/${equipoSeleccionado.ID}`)}
                      style={{ background: '#0052CC', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 16px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                      Ver tablero
                    </button>
                    <button
                      onClick={() => eliminarEquipo(equipoSeleccionado.ID)}
                      style={{ background: '#FFEBE6', color: '#BF2600', border: 'none', borderRadius: '10px', padding: '10px 16px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                      Eliminar
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
                  <div style={{ background: '#F4F5F7', borderRadius: '10px', padding: '12px 20px', textAlign: 'center' }}>
                    <p style={{ fontSize: '22px', fontWeight: '800', color: '#172B4D' }}>{miembros.length}</p>
                    <p style={{ fontSize: '11px', color: '#5E6C84', fontWeight: '600', textTransform: 'uppercase' }}>Miembros</p>
                  </div>
                </div>
              </div>

              {/* Miembros */}
              <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid #E5E7EB' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#172B4D', marginBottom: '20px' }}>
                  Miembros del equipo
                </h3>

                {miembros.length === 0 ? (
                  <p style={{ color: '#5E6C84', fontSize: '14px', textAlign: 'center', padding: '1.5rem' }}>
                    No hay miembros en este equipo
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {miembros.map((miembro, i) => (
                      <div key={miembro.ID} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#F8F9FA', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '42px', height: '42px', borderRadius: '50%',
                            background: coloresAvatar[i % coloresAvatar.length],
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontWeight: '700', fontSize: '14px'
                          }}>
                            {iniciales(miembro.usuario?.nombre)}
                          </div>
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#172B4D' }}>
                              {miembro.usuario?.nombre || 'Usuario'}
                            </p>
                            <p style={{ fontSize: '12px', color: '#5E6C84' }}>
                              {miembro.usuario?.email}
                            </p>
                          </div>
                        </div>
                        <span style={{
                          fontSize: '12px', padding: '4px 12px', borderRadius: '999px', fontWeight: '600',
                          background: miembro.rol === 'admin' ? '#E9F2FF' : '#F4F5F7',
                          color: miembro.rol === 'admin' ? '#0052CC' : '#5E6C84'
                        }}>
                          {miembro.rol}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Equipos