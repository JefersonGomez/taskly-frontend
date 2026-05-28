import { useDroppable } from '@dnd-kit/core'
import TareaCard from './TareaCard'

function Columna({ id, titulo, color, tareas, onRefresh, esBacklog }) {
  const { setNodeRef, isOver } = useDroppable({ id })

  if (esBacklog) {
    return (
      <div ref={setNodeRef} style={{
        background: isOver ? '#E9F2FF' : '#F8F9FA',
        borderRadius: '14px',
        padding: '14px',
        minHeight: '100px',
        border: isOver ? '2px dashed #0052CC' : '2px dashed #DFE1E6',
        transition: 'all 0.2s',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        alignContent: 'flex-start'
      }}>
        {tareas.length === 0 && (
          <p style={{ fontSize: '13px', color: '#A5ADBA', padding: '8px' }}>
            No hay tareas en el backlog
          </p>
        )}
        {tareas.map(tarea => (
          <div key={tarea.ID} style={{ width: '220px' }}>
            <TareaCard tarea={tarea} onRefresh={onRefresh} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div ref={setNodeRef} style={{
      background: isOver ? '#E9F2FF' : '#F0F1F3',
      borderRadius: '16px',
      padding: '14px',
      minHeight: '500px',
      border: isOver ? '2px dashed #0052CC' : '2px dashed transparent',
      transition: 'all 0.2s'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }}></div>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#5E6C84', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {titulo}
          </span>
        </div>
        <span style={{ fontSize: '11px', color: '#5E6C84', background: '#fff', borderRadius: '999px', padding: '2px 8px', border: '1px solid #DFE1E6', fontWeight: '600' }}>
          {tareas.length}
        </span>
      </div>

      {tareas.length === 0 && (
        <p style={{ fontSize: '13px', color: '#A5ADBA', textAlign: 'center', marginTop: '2rem' }}>
          No hay tareas
        </p>
      )}

      {tareas.map(tarea => (
        <TareaCard key={tarea.ID} tarea={tarea} onRefresh={onRefresh} />
      ))}
    </div>
  )
}

export default Columna