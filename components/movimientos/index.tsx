import { Movimiento, MovimientoGenerico } from "../../lib/api";
import { CartaBalance } from "./balance";
import { ModalMovimiento } from "../general/modalMovimientos";
import { startOfMonth, endOfMonth, isBefore, isAfter, isEqual } from "date-fns";

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
        <div><p>Desde:</p><input type="date" value={desde.toISOString().split("T")[0]} onChange={e => setDesde(new Date(e.target.value))}/></div>
        <div><p>Hasta:</p><input type="date" value={hasta.toISOString().split("T")[0]} onChange={e => setHasta(new Date(e.target.value))}/></div>
      </div>
      {ingresando && <ModalMovimiento cerrar={() => setIngresando(false)}/>}
      <Carta>
        <Boton texto="Ingresar" color="indigo" onClick={() => setIngresando(true)}/>
        <CartaBalance movimientos={movimientos_en_rango} />
      </Carta>
    </Lista>
  );
}