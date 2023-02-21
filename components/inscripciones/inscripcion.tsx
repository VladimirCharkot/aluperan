import { useState } from "react";
import { last } from "lodash";
import { Inscripcion, MovimientoMongo } from "../../lib/api";
import { balance_inscripcion, format_curr } from "../../lib/utils";
import { CartaBalance } from "../movimientos/balance";
import { Status } from "../general/status";
import { Boton } from "../general/boton";
import { ModalNuevoPagoInscripcion } from "../general/modalNuevoPagoInscripcion";
import { Controles } from "../general/controles";

interface CartaInscripcionProps {
  inscripcion: Inscripcion
}

export const CartaInscripcion = ({ inscripcion }: CartaInscripcionProps) => {
  const [ingresandoPago, setIngresandoPago] = useState(false);
  const [viendoMovimientos, setViendoMovimientos] = useState(false);
  const movimientos = balance_inscripcion(inscripcion);

  return (
    <li className="inscripcion p-8 bg-white/50 rounded-md m-6 
                   border">
      <h2 className="text-2xl"><Status activo={inscripcion.activa} />{inscripcion.titulo}</h2>
      <hr />

      <p className="px-2">{`Iniciada: ${new Date(inscripcion.iniciada).toLocaleDateString('es-ES')}`}</p>
      {inscripcion.baja && <p className="px-2">{`Baja: ${new Date(inscripcion.baja).toLocaleDateString('es-ES')}`}</p>}

      <p className="px-2">{`Tarifa vigente: $${last(inscripcion.tarifas)?.monto ?? '?!'}`}</p>

      <hr className="my-2" />
      <p className="px-2 text-lg">Historial de tarifas:</p>
      <div className="grid grid-cols-4 p-2">
        {inscripcion.tarifas.map(t => <>
          <p>{new Date(t.iniciada).toLocaleDateString('es-ES')}</p>
          <p>${t.monto}</p>
        </>)}
      </div>
      <hr className="my-2" />

      {inscripcion.pagos && <>
        <p className="px-2">{`Balance: ${format_curr(movimientos.reduce((total, m) => total + m.monto, 0))}`}</p>
        {viendoMovimientos && <CartaBalance movimientos={movimientos as unknown as MovimientoMongo[]} />}
      </>}

      <Controles>
      <Boton addons="m-4" texto={viendoMovimientos ? "Ocultar balance" : "Ver balance"} color="indigo" onClick={() => setViendoMovimientos(!viendoMovimientos)}/>
        <Boton addons="m-4" texto="Ingresar pago" color="emerald" onClick={() => setIngresandoPago(!ingresandoPago)}/>
        {ingresandoPago && <ModalNuevoPagoInscripcion cerrar={() => setIngresandoPago(false)} inscripcion={inscripcion} />}
      </Controles>
      <p className="text-xs">{inscripcion._id}</p>
    </li>
  )
}
