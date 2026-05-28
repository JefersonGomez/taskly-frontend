import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import api from "../api/axios";

function TareaCard({ tarea, onRefresh }) {
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: tarea.ID });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        opacity: isDragging ? 0.6 : 1,
        zIndex: isDragging ? 999 : 1,
      }
    : {};

  const eliminarTarea = async () => {
    await api.delete(`/tareas/${tarea.ID}`);
    setMostrarDetalle(false);
    onRefresh();
  };

  const prioridad = {
    alta: { bg: "#FFEBE6", color: "#BF2600", dot: "#FF5630" },
    media: { bg: "#FFFAE6", color: "#974F0C", dot: "#FF8B00" },
    baja: { bg: "#E3FCEF", color: "#006644", dot: "#36B37E" },
  };
  const p = prioridad[tarea.prioridad] || prioridad.media;

  const iniciales = (nombre) => {
    if (!nombre) return "?";
    return nombre
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const [editando, setEditando] = useState(false);
  const [tituloEdit, setTituloEdit] = useState(tarea.titulo);
  const [descripcionEdit, setDescripcionEdit] = useState(
    tarea.descripcion || "",
  );
  const [prioridadEdit, setPrioridadEdit] = useState(tarea.prioridad);

  const editarTarea = async () => {
    await api.put(`/tareas/${tarea.ID}`, {
      titulo: tituloEdit,
      descripcion: descripcionEdit,
      prioridad: prioridadEdit,
    });
    setEditando(false);
    onRefresh();
  };
  return (
    <>
      <div
        ref={setNodeRef}
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "14px",
          marginBottom: "10px",
          border: "1px solid #E5E7EB",
          boxShadow: isDragging
            ? "0 8px 20px rgba(0,0,0,0.15)"
            : "0 1px 3px rgba(0,0,0,0.06)",
          ...style,
        }}
      >
        <div {...listeners} {...attributes} style={{ cursor: "grab" }}>
          <p
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#172B4D",
              marginBottom: "8px",
              lineHeight: "1.4",
            }}
          >
            {tarea.titulo}
          </p>
          {tarea.descripcion && (
            <p
              style={{
                fontSize: "12px",
                color: "#5E6C84",
                marginBottom: "10px",
                lineHeight: "1.4",
              }}
            >
              {tarea.descripcion.length > 60
                ? tarea.descripcion.slice(0, 60) + "..."
                : tarea.descripcion}
            </p>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: p.dot,
              }}
            ></div>
            <span
              style={{
                fontSize: "11px",
                padding: "2px 8px",
                borderRadius: "999px",
                fontWeight: "600",
                background: p.bg,
                color: p.color,
              }}
            >
              {tarea.prioridad}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {tarea.nombreAsignado && (
              <div
                title={tarea.nombreAsignado}
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  background: "#0052CC",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "10px",
                  fontWeight: "700",
                }}
              >
                {iniciales(tarea.nombreAsignado)}
              </div>
            )}
            <button
              onClick={() => setMostrarDetalle(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#5E6C84",
                fontSize: "18px",
                padding: "2px 6px",
                borderRadius: "6px",
              }}
            >
              ···
            </button>
          </div>
        </div>
      </div>

      {mostrarDetalle && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "32px",
              width: "500px",
              maxWidth: "90vw",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "20px",
              }}
            >
              {editando ? (
                <input
                  value={tituloEdit}
                  onChange={(e) => setTituloEdit(e.target.value)}
                  style={{
                    fontSize: "18px",
                    fontWeight: "800",
                    color: "#172B4D",
                    border: "1px solid #D0D7DE",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    width: "100%",
                    marginRight: "12px",
                    outline: "none",
                  }}
                />
              ) : (
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "800",
                    color: "#172B4D",
                    flex: 1,
                    marginRight: "12px",
                  }}
                >
                  {tarea.titulo}
                </h2>
              )}
              <button
                onClick={() => setMostrarDetalle(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "20px",
                  color: "#5E6C84",
                }}
              >
                ✕
              </button>
            </div>

            {/* Descripción */}
            <div style={{ marginBottom: "20px" }}>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#5E6C84",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                }}
              >
                Descripción
              </p>
              {editando ? (
                <textarea
                  value={descripcionEdit}
                  onChange={(e) => setDescripcionEdit(e.target.value)}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid #D0D7DE",
                    fontSize: "14px",
                    outline: "none",
                    resize: "none",
                    color: "#172B4D",
                  }}
                />
              ) : (
                <p
                  style={{
                    fontSize: "14px",
                    color: "#172B4D",
                    lineHeight: "1.6",
                  }}
                >
                  {tarea.descripcion || "Sin descripción"}
                </p>
              )}
            </div>

            {/* Grid de info */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  background: "#F4F5F7",
                  borderRadius: "10px",
                  padding: "12px",
                }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#5E6C84",
                    marginBottom: "6px",
                    textTransform: "uppercase",
                  }}
                >
                  Estado
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#172B4D",
                  }}
                >
                  {tarea.estado?.replace("_", " ")}
                </p>
              </div>

              <div
                style={{
                  background: "#F4F5F7",
                  borderRadius: "10px",
                  padding: "12px",
                }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#5E6C84",
                    marginBottom: "6px",
                    textTransform: "uppercase",
                  }}
                >
                  Prioridad
                </p>
                {editando ? (
                  <select
                    value={prioridadEdit}
                    onChange={(e) => setPrioridadEdit(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      border: "1px solid #D0D7DE",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                  </select>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: p.dot,
                      }}
                    ></div>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: p.color,
                      }}
                    >
                      {tarea.prioridad}
                    </span>
                  </div>
                )}
              </div>

              {tarea.nombreAsignado && (
                <div
                  style={{
                    background: "#F4F5F7",
                    borderRadius: "10px",
                    padding: "12px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#5E6C84",
                      marginBottom: "6px",
                      textTransform: "uppercase",
                    }}
                  >
                    Asignado a
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: "#0052CC",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: "11px",
                        fontWeight: "700",
                      }}
                    >
                      {iniciales(tarea.nombreAsignado)}
                    </div>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#172B4D",
                      }}
                    >
                      {tarea.nombreAsignado}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Botones */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "8px",
              }}
            >
              <button
                onClick={eliminarTarea}
                style={{
                  background: "#FFEBE6",
                  color: "#BF2600",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                Eliminar
              </button>

              <div style={{ display: "flex", gap: "8px" }}>
                {editando ? (
                  <>
                    <button
                      onClick={() => setEditando(false)}
                      style={{
                        background: "#F4F5F7",
                        color: "#172B4D",
                        border: "none",
                        padding: "10px 18px",
                        borderRadius: "10px",
                        fontWeight: "700",
                        cursor: "pointer",
                        fontSize: "13px",
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={editarTarea}
                      style={{
                        background: "#0052CC",
                        color: "#fff",
                        border: "none",
                        padding: "10px 18px",
                        borderRadius: "10px",
                        fontWeight: "700",
                        cursor: "pointer",
                        fontSize: "13px",
                      }}
                    >
                      Guardar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setMostrarDetalle(false)}
                      style={{
                        background: "#F4F5F7",
                        color: "#172B4D",
                        border: "none",
                        padding: "10px 18px",
                        borderRadius: "10px",
                        fontWeight: "700",
                        cursor: "pointer",
                        fontSize: "13px",
                      }}
                    >
                      Cerrar
                    </button>
                    <button
                      onClick={() => setEditando(true)}
                      style={{
                        background: "#0052CC",
                        color: "#fff",
                        border: "none",
                        padding: "10px 18px",
                        borderRadius: "10px",
                        fontWeight: "700",
                        cursor: "pointer",
                        fontSize: "13px",
                      }}
                    >
                      Editar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TareaCard;
