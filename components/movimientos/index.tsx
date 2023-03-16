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
import { Select } from "../general/input/select";

interface MovimientosProps {
  movimientos: Movimiento[]
}

export default function Movimientos() {

  const { movimientos } = useContext(AppContext);

  const [ingresando, setIngresando] = useState(false);
  const [desde, setDesde] = useState(startOfMonth(new Date()))
  const [hasta, setHasta] = useState(endOfMonth(new Date()))
  const [medio, setMedio] = useState('todos')
  const [direccion, setDireccion] = useState('ambas')

  const opcs_direccion = [
    {v: 'ambas', txt: 'Todas'},
    {v: 'entrada', txt: 'Entrada'},
    {v: 'salida', txt: 'Salida'}
  ]

  const opcs_medios = [
    { v: 'todos', txt: 'Todos' },
    { v: 'efectivo', txt: 'Efectivo' },
    { v: 'mercadopago', txt: 'MecadoPago' },
    { v: 'otro', txt: 'Otro' }
  ]

  const antes = (m: Movimiento) => isBefore(new Date(m.fecha), desde)
  const despues = (m: Movimiento) => isAfter(new Date(m.fecha), hasta)


  const entre_fechas = (m: Movimiento) => {
    const f = new Date(m.fecha)
    return (isBefore(f, hasta) && isAfter(f, desde)) || isEqual(f, desde) || isEqual(f, hasta)
  }

  const con_medio = (m: Movimiento) => {
    return medio == 'todos' || m.medio == medio
  }
  const otro_medio = (m: Movimiento) => {
    return medio != 'todos' && m.medio != medio
  }

  const con_direccion = (m: Movimiento) => {
    return direccion == 'ambas' || (direccion == 'entrada' ? m.monto > 0 : m.monto < 0)
  }

  const otra_direccion = (m: Movimiento) => {
    return direccion != 'ambas' && (direccion == 'entrada' ? m.monto < 0 : m.monto > 0)
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
  const otros_medios: MovimientoGenerico = {
    medio: '-',
    fecha: new Date(),
    razon: 'otra',
    monto: movimientos.filter(entre_fechas).filter(otro_medio).reduce((prev, curr) => prev + curr.monto, 0),
    detalle: '[Otros medios]'
  }
  const otras_direcciones: MovimientoGenerico = {
    medio: '-',
    fecha: new Date(),
    razon: 'otra',
    monto: movimientos.filter(entre_fechas).filter(otra_direccion).reduce((prev, curr) => prev + curr.monto, 0),
    detalle: direccion == 'entrada' ? '[Salidas]' : '[Entradas]'
  }
  

  const movimientos_en_rango = sortBy([
    anteriores,
    ...movimientos.filter(entre_fechas).filter(con_medio).filter(con_direccion),
    ...(medio != 'todos' ? [otros_medios] : []),
    ...(direccion != 'ambas' ? [otras_direcciones] : []),
    posteriores
  ], m => m.fecha)

  return (
    <Lista titulo="Movimientos" bg="grilla">
      <div className="mx-6 flex justify-between w-72">
        <div><p>Desde:</p><input type="date" value={desde.toISOString().split("T")[0]} onChange={e => setDesde(new Date(e.target.value))} /></div>
        <div><p>Hasta:</p><input type="date" value={hasta.toISOString().split("T")[0]} onChange={e => setHasta(new Date(e.target.value))} /></div>
        <Select opts={opcs_medios} onChange={e => setMedio(e.target.value)} />
        <Select opts={opcs_direccion} onChange={e => setDireccion(e.target.value)} />
      </div>
      {ingresando && <ModalMovimiento cerrar={() => setIngresando(false)} />}
      <Carta>
        <Boton texto="Ingresar" color="indigo" onClick={() => setIngresando(true)} />
        <CartaBalance movimientos={movimientos_en_rango} />
      </Carta>
    </Lista>
  );
}