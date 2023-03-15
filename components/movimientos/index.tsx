import { useContext, useState } from "react";
import { sortBy } from "lodash";
import { startOfMonth, endOfMonth, isBefore, isAfter, isEqual } from "date-fns";

import { Movimiento, MovimientoGenerico } from "../../lib/api";
import { CartaBalance } from "./balance";
import { ModalMovimiento } from "../general/modales/modalMovimientos";

import { Lista } from "../general/display/lista";
import { Carta } from "../general/display/carta";
import { Boton } from "../general/input/boton";
import { AppContext } from "../context";

interface MovimientosProps {
  movimientos: Movimiento[]
}

export default function Movimientos() {

  const { movimientos } = useContext(AppContext);

  const [ingresando, setIngresando] = useState(false);
  const [desde, setDesde] = useState(startOfMonth(new Date()))
  const [hasta, setHasta] = useState(endOfMonth(new Date()))

  const antes = (m: Movimiento) => isBefore(new Date(m.fecha), desde)
  const despues = (m: Movimiento) => isAfter(new Date(m.fecha), hasta)


  const entre_fechas = (m: Movimiento) => {
    const f = new Date(m.fecha)
    return (isBefore(f, hasta) && isAfter(f, desde)) || isEqual(f, desde) || isEqual(f, hasta)
  }

  const anteriores: MovimientoGenerico = {
    medio: '-',
    fecha: desde,
    razon: 'otra',
    monto: movimientos.filter(antes).reduce((prev, curr) => prev + curr.monto, 0),
    detalle: '[Movimientos anteriores]'
  }
  const posteriores: MovimientoGenerico = {
    medio: '-',
    fecha: new Date(),
    razon: 'otra',
    monto: movimientos.filter(despues).reduce((prev, curr) => prev + curr.monto, 0),
    detalle: '[Movimientos posteriores]'
  }
  const movimientos_en_rango = sortBy([anteriores, ...movimientos.filter(entre_fechas), posteriores], m => m.fecha)

  return (
    <Lista titulo="Movimientos" bg="grilla">
      <div className="mx-6 flex justify-between w-72">
        <div><p>Desde:</p><input type="date" value={desde.toISOString().split("T")[0]} onChange={e => setDesde(new Date(e.target.value))} /></div>
        <div><p>Hasta:</p><input type="date" value={hasta.toISOString().split("T")[0]} onChange={e => setHasta(new Date(e.target.value))} /></div>
      </div>
      {ingresando && <ModalMovimiento cerrar={() => setIngresando(false)} />}
      <Carta>
        <Boton texto="Ingresar" color="indigo" onClick={() => setIngresando(true)} />
        <CartaBalance movimientos={movimientos_en_rango} />
      </Carta>
    </Lista>
  );
}