import { Inscripcion } from "../../lib/api";
import { CartaInscripcion } from "./inscripcion";
import { sortBy } from "lodash";

interface InscripcionesProps {
  inscripcion: Inscripcion[]
}

export default function Inscripciones({ inscripcion }: InscripcionesProps) {
  return (
    <div className="h-screen cruces w-full overflow-y-scroll">
      <h1 className="text-3xl p-4 text-rye">Inscripciones</h1>
      <ul>
        {sortBy(inscripcion, i => !i.activa).map((a) => (   // sortBy: activas primero
          <CartaInscripcion key={a._id} inscripcion={a} />
        ))}
      </ul>
    </div>
  );
}