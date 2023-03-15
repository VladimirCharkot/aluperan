import { useState, useContext } from "react";
import { sortBy } from "lodash";
import { Inscripcion } from "../../lib/api";
import { CartaInscripcion } from "./inscripcion";
import { AppContext } from "../context";

interface InscripcionesProps {
  inscripciones: Inscripcion[]
}

export default function Inscripciones() {
  const { inscripciones } = useContext(AppContext);

  const inscs = sortBy(sortBy(inscripciones, i => i.titulo), i => !i.activa)
  const [filtro, setFiltro] = useState('')

  return (
    <div className="h-screen cruces w-full overflow-y-scroll">
      <h1 className="text-3xl p-4 text-rye">Inscripciones</h1>
      <div className="flex justify-between">
        <div className="flex items-center mx-6 w-full"><p className="ml-auto">Buscar:</p><input className="mx-6 px-2" value={filtro} onChange={e => setFiltro(e.target.value)} /></div>
      </div>
      <ul>
        {inscs.filter(i => i.taller.nombre.toLowerCase().includes(filtro.toLowerCase()) || i.alumne.nombre.toLowerCase().includes(filtro.toLowerCase())).map((a) => (   // sortBy: activas primero
          <CartaInscripcion key={a._id} inscripcion={a} />
        ))}
      </ul>
    </div>
  );
}