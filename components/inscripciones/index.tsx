import { useState } from "react";
import { sortBy } from "lodash";
import { Inscripcion } from "../../lib/api";
import { CartaInscripcion } from "./inscripcion";
import { useBackend } from "../context/backend";

interface InscripcionesProps {
  inscripciones: Inscripcion[]
}

export default function Inscripciones() {
  const { inscripciones, lkpTallerInscripcion, lkpAlumneInscripcion } = useBackend()

  // const inscs = sortBy(sortBy(inscripciones, i => i.titulo), i => !i.activa)
  const [filtro, setFiltro] = useState('')

  return (
    <div className="h-screen cruces w-full overflow-y-scroll">
      <h1 className="text-3xl p-4 text-rye">Inscripciones</h1>
      <div className="flex justify-between">
        <div className="flex items-center mx-6 w-full"><p className="ml-auto">Buscar:</p><input className="mx-6 px-2" value={filtro} onChange={e => setFiltro(e.target.value)} /></div>
      </div>
      <ul>
        {/* {inscs.filter(i => lkpTallerInscripcion(i).nombre.toLowerCase().includes(filtro.toLowerCase()) || lkpAlumneInscripcion(i).nombre.toLowerCase().includes(filtro.toLowerCase())).map((a) => (   // sortBy: activas primero
          <CartaInscripcion key={a._id} inscripcion={a} />
        ))} */}
      </ul>
    </div>
  );
}