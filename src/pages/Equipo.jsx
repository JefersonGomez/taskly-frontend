import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DndContext, closestCenter } from "@dnd-kit/core";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import Columna from "../components/Columna";

function Equipo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [equipo, setEquipo] = useState(null);
  const [tareas, setTareas] = useState([]);
  const [miembros, setMiembros] = useState([]);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [prioridad, setPrioridad] = useState("media");
  const [mostrarFormTarea, setMostrarFormTarea] = useState(false);

  const [emailBuscar, setEmailBuscar] = useState("");
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);
  const [errorBuscar, setErrorBuscar] = useState("");
  const [mostrarFormMiembro, setMostrarFormMiembro] = useState(false);
  const [asignadoId, setAsignadoId] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [tab, setTab] = useState("tablero");

  useEffect(() => {
    api.get(`/equipos/${id}`).then((res) => setEquipo(res.data));
    api.get(`/equipos/${id}/tareas`).then((res) => setTareas(res.data || []));
    api
      .get(`/equipos/${id}/miembros`)
      .then((res) => setMiembros(res.data || []));
  }, [id, refresh]);

  const crearTarea = async () => {
    await api.post(`/equipos/${id}/tareas`, {
      titulo,
      descripcion,
      prioridad,
      asignadoId: asignadoId,
    });
    setTitulo("");
    setDescripcion("");
    setPrioridad("media");
    setAsignadoId(0);
    setMostrarFormTarea(false);
    setRefresh((r) => !r);
  };

  const buscarUsuario = async () => {
    try {
      setErrorBuscar("");
      setUsuarioEncontrado(null);
      const res = await api.get(`/usuarios/buscar?email=${emailBuscar}`);
      setUsuarioEncontrado(res.data);
    } catch {
      setErrorBuscar("No se encontró ningún usuario con ese email");
    }
  };

  const agregarMiembro = async () => {
    try {
      await api.post(`/equipos/${id}/miembros`, {
        usuarioId: usuarioEncontrado.id,
        rol: "miembro",
      });
      setEmailBuscar("");
      setUsuarioEncontrado(null);
      setMostrarFormMiembro(false);
      setRefresh((r) => !r);
    } catch {
      setErrorBuscar("Error al agregar el miembro");
    }
  };

  const eliminarEquipo = async () => {
    const confirmar = window.confirm(
      "¿Estás seguro que quieres eliminar este equipo?",
    );
    if (!confirmar) return;
    await api.delete(`/equipos/${id}`);
    navigate("/dashboard");
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;
    const tareaId = active.id;
    const nuevoEstado = over.id;
    const estados = ["backlog", "pendiente", "en_progreso", "completada"];
    const tarea = tareas.find((t) => t.ID === tareaId);
    if (!tarea) return;
    const indexActual = estados.indexOf(tarea.estado);
    const indexNuevo = estados.indexOf(nuevoEstado);
    if (tarea.estado === "completada") return;
    if (tarea.estado === "backlog" && nuevoEstado !== "pendiente") return;
    if (indexNuevo !== indexActual + 1) return;
    await api.patch(`/tareas/${tareaId}/estado`, { estado: nuevoEstado });
    setRefresh((r) => !r);
  };

  const columnas = [
    { id: "backlog", titulo: "Backlog", color: "#5E6C84" },
    { id: "pendiente", titulo: "Pendiente", color: "#0052CC" },
    { id: "en_progreso", titulo: "En progreso", color: "#FF8B00" },
    { id: "completada", titulo: "Completada", color: "#36B37E" },
  ];

  const coloresAvatar = [
    "#0052CC",
    "#0F6E56",
    "#534AB7",
    "#BF2600",
    "#FF8B00",
    "#36B37E",
  ];

  const eliminarMiembro = async (usuarioId) => {
    const confirmar = window.confirm("¿Eliminar este miembro del equipo?");
    if (!confirmar) return;
    await api.delete(`/equipos/${id}/miembros/${usuarioId}`);
    setRefresh((r) => !r);
  };
  const iniciales = (nombre) => {
    if (!nombre) return "?";
    return nombre
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div style={{ display: "flex", background: "#F4F5F7", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ marginLeft: "240px", width: "100%", padding: "32px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "24px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "800",
                color: "#172B4D",
                marginBottom: "6px",
              }}
            >
              {equipo?.nombre}
            </h1>
            <p style={{ color: "#5E6C84", fontSize: "15px" }}>
              {equipo?.descripcion}
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            {tab === "tablero" && (
              <button
                onClick={() => setMostrarFormTarea(!mostrarFormTarea)}
                style={{
                  background: "#0052CC",
                  color: "#fff",
                  border: "none",
                  padding: "12px 18px",
                  borderRadius: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                + Nueva tarea
              </button>
            )}
            {tab === "miembros" && (
              <button
                onClick={() => setMostrarFormMiembro(!mostrarFormMiembro)}
                style={{
                  background: "#0052CC",
                  color: "#fff",
                  border: "none",
                  padding: "12px 18px",
                  borderRadius: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                + Agregar miembro
              </button>
            )}
            <button
              onClick={eliminarEquipo}
              style={{
                background: "#FFEBE6",
                color: "#BF2600",
                border: "none",
                padding: "12px 18px",
                borderRadius: "12px",
                fontWeight: "700",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Eliminar equipo
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            marginBottom: "24px",
            borderBottom: "2px solid #E5E7EB",
          }}
        >
          {["tablero", "miembros"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: "none",
                border: "none",
                padding: "10px 18px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: tab === t ? "700" : "500",
                color: tab === t ? "#0052CC" : "#5E6C84",
                borderBottom:
                  tab === t ? "2px solid #0052CC" : "2px solid transparent",
                marginBottom: "-2px",
                textTransform: "capitalize",
              }}
            >
              {t === "tablero" ? "Tablero" : `Miembros (${miembros.length})`}
            </button>
          ))}
        </div>

        {/* Tab Tablero */}
        {tab === "tablero" && (
          <>
            {mostrarFormTarea && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: "20px",
                  padding: "24px",
                  marginBottom: "24px",
                  border: "1px solid #E5E7EB",
                }}
              >
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    marginBottom: "16px",
                    color: "#172B4D",
                  }}
                >
                  Nueva tarea
                </h3>
                <input
                  placeholder="Título"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  style={inputStyle}
                />
                <textarea
                  placeholder="Descripción"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={3}
                  style={{ ...inputStyle, resize: "none", marginTop: "12px" }}
                />
                <select
                  value={prioridad}
                  onChange={(e) => setPrioridad(e.target.value)}
                  style={{ ...inputStyle, marginTop: "12px" }}
                >
                  <option value="baja">Prioridad baja</option>
                  <option value="media">Prioridad media</option>
                  <option value="alta">Prioridad alta</option>
                </select>
                <select
                  value={asignadoId}
                  onChange={(e) => setAsignadoId(parseInt(e.target.value))}
                  style={{ ...inputStyle, marginTop: "12px" }}
                >
                  <option value={0}>Sin asignar</option>
                  {miembros.map((m) => (
                    <option key={m.ID} value={m.usuario?.ID}>
                      {m.usuario?.nombre}
                    </option>
                  ))}
                </select>
                <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                  <button
                    onClick={crearTarea}
                    style={{
                      background: "#0052CC",
                      color: "#fff",
                      border: "none",
                      padding: "10px 18px",
                      borderRadius: "10px",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    Crear tarea
                  </button>
                  <button
                    onClick={() => setMostrarFormTarea(false)}
                    style={{
                      background: "#F4F5F7",
                      color: "#172B4D",
                      border: "1px solid #DFE1E6",
                      padding: "10px 18px",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              {/* Backlog separado */}
              <div style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "14px",
                  }}
                >
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: "#5E6C84",
                    }}
                  ></div>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "#5E6C84",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Backlog
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#5E6C84",
                      background: "#fff",
                      borderRadius: "999px",
                      padding: "2px 8px",
                      border: "1px solid #DFE1E6",
                      fontWeight: "600",
                    }}
                  >
                    {tareas.filter((t) => t.estado === "backlog").length}
                  </span>
                </div>
                <Columna
                  id="backlog"
                  titulo=""
                  color="#5E6C84"
                  tareas={tareas.filter((t) => t.estado === "backlog")}
                  onRefresh={() => setRefresh((r) => !r)}
                  esBacklog={true}
                />
              </div>

              {/* Separador */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{ flex: 1, height: "1px", background: "#E5E7EB" }}
                />
                <span
                  style={{
                    fontSize: "11px",
                    color: "#A5ADBA",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Ciclo de trabajo
                </span>
                <div
                  style={{ flex: 1, height: "1px", background: "#E5E7EB" }}
                />
              </div>

              {/* Columnas del ciclo */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "20px",
                }}
              >
                {columnas
                  .filter((col) => col.id !== "backlog")
                  .map((col) => (
                    <Columna
                      key={col.id}
                      id={col.id}
                      titulo={col.titulo}
                      color={col.color}
                      tareas={tareas.filter((t) => t.estado === col.id)}
                      onRefresh={() => setRefresh((r) => !r)}
                      esBacklog={false}
                    />
                  ))}
              </div>
            </DndContext>
          </>
        )}

        {/* Tab Miembros */}
        {tab === "miembros" && (
          <div>
            {mostrarFormMiembro && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: "20px",
                  padding: "24px",
                  marginBottom: "24px",
                  border: "1px solid #E5E7EB",
                }}
              >
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    marginBottom: "16px",
                    color: "#172B4D",
                  }}
                >
                  Agregar miembro
                </h3>
                <div
                  style={{ display: "flex", gap: "10px", marginBottom: "12px" }}
                >
                  <input
                    placeholder="Buscar por email"
                    value={emailBuscar}
                    onChange={(e) => setEmailBuscar(e.target.value)}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button
                    onClick={buscarUsuario}
                    style={{
                      background: "#0052CC",
                      color: "#fff",
                      border: "none",
                      padding: "12px 18px",
                      borderRadius: "12px",
                      fontWeight: "700",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Buscar
                  </button>
                </div>

                {errorBuscar && (
                  <div
                    style={{
                      background: "#FFEBE6",
                      color: "#BF2600",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      marginBottom: "12px",
                    }}
                  >
                    {errorBuscar}
                  </div>
                )}

                {usuarioEncontrado && (
                  <div
                    style={{
                      background: "#E3FCEF",
                      borderRadius: "12px",
                      padding: "14px 16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background: "#0052CC",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontWeight: "700",
                          fontSize: "13px",
                        }}
                      >
                        {iniciales(usuarioEncontrado.nombre)}
                      </div>
                      <div>
                        <p
                          style={{
                            fontWeight: "600",
                            color: "#172B4D",
                            fontSize: "14px",
                          }}
                        >
                          {usuarioEncontrado.nombre}
                        </p>
                        <p style={{ color: "#5E6C84", fontSize: "12px" }}>
                          {usuarioEncontrado.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={agregarMiembro}
                      style={{
                        background: "#0052CC",
                        color: "#fff",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontWeight: "700",
                        cursor: "pointer",
                        fontSize: "13px",
                      }}
                    >
                      Agregar al equipo
                    </button>
                  </div>
                )}
              </div>
            )}

            <div
              style={{
                background: "#fff",
                borderRadius: "20px",
                padding: "24px",
                border: "1px solid #E5E7EB",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  marginBottom: "20px",
                  color: "#172B4D",
                }}
              >
                Miembros del equipo
              </h3>

              {miembros.length === 0 ? (
                <p
                  style={{
                    color: "#5E6C84",
                    fontSize: "14px",
                    textAlign: "center",
                    padding: "2rem",
                  }}
                >
                  No hay miembros aún. Agrega el primero.
                </p>
              ) : (
                miembros.map((miembro, i) => (
                  <div
                    key={miembro.ID}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 0",
                      borderBottom:
                        i < miembros.length - 1 ? "1px solid #F4F5F7" : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background: coloresAvatar[i % coloresAvatar.length],
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontWeight: "700",
                          fontSize: "14px",
                        }}
                      >
                        {iniciales(miembro.usuario?.nombre)}
                      </div>
                      <div>
                        <p
                          style={{
                            fontWeight: "600",
                            color: "#172B4D",
                            fontSize: "14px",
                          }}
                        >
                          {miembro.usuario?.nombre || "Usuario"}
                        </p>
                        <p style={{ color: "#5E6C84", fontSize: "12px" }}>
                          {miembro.usuario?.email}
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          padding: "4px 10px",
                          borderRadius: "999px",
                          fontWeight: "600",
                          background:
                            miembro.rol === "admin" ? "#E9F2FF" : "#F4F5F7",
                          color:
                            miembro.rol === "admin" ? "#0052CC" : "#5E6C84",
                        }}
                      >
                        {miembro.rol}
                      </span>
                      <button
                        onClick={() => eliminarMiembro(miembro.usuario?.ID)}
                        style={{
                          background: "#FFEBE6",
                          color: "#BF2600",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #D0D7DE",
  fontSize: "14px",
  outline: "none",
  color: "#172B4D",
};

export default Equipo;
