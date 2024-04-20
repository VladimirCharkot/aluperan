import { useState } from "react";
import { Alumne } from "../../lib/api";
import { CartaAlumne } from "./alumne";
import { Lista } from "../general/display/lista";
import { Boton } from "../general/input/boton";
import { ModalNuevoAlumne } from "../general/modales/modalNuevoAlumne";
import { sortBy } from "lodash";
import { useBackend } from "../context/backend";
import { Check } from "../general/input/checkbox";

interface AlumnesProps {
  alumnes: Alumne[]
}

export default function Alumnes() {
  const [agregando, setAgregando] = useState(false)
  const [verSoloActivos, setVerSoloActivos] = useState(false)
  const [verSoloInactivos, setVerSoloInactivos] = useState(false)
  const [filtro, setFiltro] = useState('');
  const { alumnes, lkpInscripcionesActivasAlumne } = useBackend();

  // Solo activos
  const alumnes_base = alumnes.filter(a => a.activo !== false)

  // Activos con y sin inscripciones activas
  const alumnes_con_inscripciones_activas = alumnes_base.filter(a => lkpInscripcionesActivasAlumne(a).length > 0)
  const alumnes_sin_inscripciones_activas = alumnes_base.filter(a => lkpInscripcionesActivasAlumne(a).length == 0)

  const fuente = verSoloActivos ? alumnes_con_inscripciones_activas :
                 verSoloInactivos ? alumnes_sin_inscripciones_activas : 
                 alumnes_base

  const alumnes_mostrados = sortBy(fuente
    .filter(a => a.nombre.toLowerCase().includes(filtro.toLowerCase())), a => a.nombre)


  return (
    <Lista titulo="Alumnes" bg="tateti" >
      <p className="mx-6">{alumnes_base.length} alumnes activos, {alumnes_con_inscripciones_activas.length} con inscripciones activas</p>
      {agregando && <ModalNuevoAlumne cerrar={() => setAgregando(false)} />}
      <div className="flex justify-between items-center">
        <Boton texto="Agregar" color="indigo" onClick={() => { setAgregando(true) }} addons="mx-6" />
        <div>
          <div className="flex items-center">
            <p>Buscar:</p><input className="mx-6" value={filtro} onChange={e => setFiltro(e.target.value)} />
          </div>

          {/* Check activos */}
          <div className="flex items-center">
            <Check checked={verSoloActivos} onClick={() => {
              setVerSoloInactivos(false)
              setVerSoloActivos(!verSoloActivos)
            }
            } />
            <label className="mx-4">Ver solo activos</label>
          </div>

          {/* Check inactivos */}
          <div className="flex items-center">
            <Check checked={verSoloInactivos} onClick={() => {
              setVerSoloActivos(false)
              setVerSoloInactivos(!verSoloInactivos)
            }} />
            <label className="mx-4">Ver solo inactivos</label>
          </div>


        </div>
      </div>

      <p className="mx-6">Mostrando {alumnes_mostrados.length} </p>
      {alumnes && alumnes_mostrados.map((a) => (
        <CartaAlumne key={a._id} alumne={a} />
      ))}

    </Lista>
  );
}




