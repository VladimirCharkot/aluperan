import { last } from "lodash";
import { Inscripcion } from "../../lib/api";
import { balance_inscripcion, format_curr } from "../../lib/utils";
import { CartaBalance } from "../movimientos/balance";
import { Status } from "../general/status";

interface CartaInscripcionProps {
  inscripcion: Inscripcion
}

export const CartaInscripcion = ({ inscripcion }: CartaInscripcionProps) => {

  const movimientos = balance_inscripcion(inscripcion);

  return (
    <li className="inscripcion p-8 bg-white/50 rounded-md m-6 
                   border">
      <h2 className="text-2xl"><Status activo={inscripcion.activa} />{`${inscripcion.alumne.nombre} - ${inscripcion.titulo}`}</h2>
      <hr />

      <p className="px-2">{`Iniciada: ${new Date(inscripcion.iniciada).toLocaleDateString('es-ES')}`}</p>
      {inscripcion.baja && <p className="px-2">{`Baja: ${new Date(inscripcion.baja).toLocaleDateString('es-ES')}`}</p>}

      <p className="px-2">{`Tarifa vigente: $${last(inscripcion.tarifas)?.monto ?? '?!'}`}</p>

      <p className="px-2">Historial de tarifas:</p>
      <div className="grid grid-cols-4 p-2">
        {inscripcion.tarifas.map(t => <>
          <p>{new Date(t.iniciada).toLocaleDateString('es-ES')}</p>
          <p>${t.monto}</p>
        </>)}
      </div>

      {inscripcion.pagos && <>
        <p className="px-2">{`Balance: ${format_curr(movimientos.reduce((total, m) => total + m.monto, 0))}`}</p>
        <CartaBalance movimientos={movimientos} />
      </>}

      <p className="text-xs">{inscripcion._id}</p>
    </li>
  )
}
