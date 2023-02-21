import { Movimiento } from "../../lib/api";
import { CartaBalance } from "./balance";
import { ModalMovimiento } from "../general/modalMovimientos";
import { startOfMonth, endOfMonth, isBefore, isAfter } from "date-fns";

import { Lista } from "../general/lista";
import { Carta } from "../general/carta";
import { Boton } from "../general/boton";
import { useState } from "react";
import { sortBy } from "lodash";

interface MovimientosProps {
  movimientos: Movimiento[]
}

export default function Movimientos({ movimientos }: MovimientosProps) {
  const [ingresando, setIngresando] = useState(false);
  const [desde, setDesde] = useState(startOfMonth(new Date()))
  const [hasta, setHasta] = useState(endOfMonth(new Date()))

  return (
    <Lista titulo="Movimientos" bg="grilla">
      <div className="mx-6 flex justify-between w-72">
        <div><p>Desde:</p><input type="date" value={desde.toISOString().split("T")[0]} onChange={e => setDesde(new Date(e.target.value))}/></div>
        <div><p>Hasta:</p><input type="date" value={hasta.toISOString().split("T")[0]} onChange={e => setHasta(new Date(e.target.value))}/></div>
      </div>
      {ingresando && <ModalMovimiento cerrar={() => setIngresando(false)}/>}
      <Carta>
        <Boton texto="Ingresar" color="indigo" onClick={() => setIngresando(true)}/>
        <CartaBalance movimientos={sortBy(movimientos.filter(m => isBefore(new Date(m.fecha), hasta) && isAfter(new Date(m.fecha), desde)), m => m.fecha)} />
      </Carta>
    </Lista>
  );
}