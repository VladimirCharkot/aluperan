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
import { P } from "../general/display/p";
import { DatePick } from "../general/input/date";
import { Controles } from "../general/display/controles";

interface MovimientosProps {
  movimientos: Movimiento[]
}

export default function Movimientos() {

  const { movimientos } = useContext(AppContext);

  const [ingresando, setIngresando] = useState(false);
  const [borrando, setBorrando] = useState(false);

  const [desde, setDesde] = useState(startOfMonth(new Date()))
  const [hasta, setHasta] = useState(endOfMonth(new Date()))
  const [medio, setMedio] = useState('todos')
  const [direccion, setDireccion] = useState('ambas')

  const total_en_caja = movimientos.reduce((prev, curr) => prev + curr.monto, 0)

  const opcs_direccion = [
    { v: 'ambas', txt: 'Todas' },
    { v: 'entrada', txt: 'Entrada' },
    { v: 'salida', txt: 'Salida' }
  ]

  const opcs_medios = [
    { v: 'todos', txt: 'Todos' },
    { v: 'efectivo', txt: 'Efectivo' },
    { v: 'mercadopago', txt: 'MecadoPago' },
    { v: 'otro', txt: 'Otro' }
  ]

  const antes = (m: Movimiento) => isBefore(m.fecha, desde)
  const despues = (m: Movimiento) => isAfter(m.fecha, hasta)
  const entre_fechas = (m: Movimiento) => (isBefore(m.fecha, hasta) && isAfter(m.fecha, desde)) || isEqual(m.fecha, desde) || isEqual(m.fecha, hasta)

  const con_medio = (m: Movimiento) => medio == 'todos' || m.medio == medio
  const otro_medio = (m: Movimiento) => medio != 'todos' && m.medio != medio
  const con_direccion = (m: Movimiento) => direccion == 'ambas' || (direccion == 'entrada' ? m.monto > 0 : m.monto < 0)
  const otra_direccion = (m: Movimiento) => direccion != 'ambas' && (direccion == 'entrada' ? m.monto < 0 : m.monto > 0)

  const anteriores: Movimiento = {
    _id: '',
    medio: '-',
    fecha: desde,
    razon: 'otra',
    monto: movimientos.filter(antes).reduce((prev, curr) => prev + curr.monto, 0),
    detalle: '[Movimientos anteriores]'
  }
  const posteriores: Movimiento = {
    _id: '',
    medio: '-',
    fecha: new Date(),
    razon: 'otra',
    monto: movimientos.filter(despues).reduce((prev, curr) => prev + curr.monto, 0),
    detalle: '[Movimientos posteriores]'
  }
  const otros_medios: Movimiento = {
    _id: '',
    medio: '-',
    fecha: new Date(),
    razon: 'otra',
    monto: movimientos.filter(entre_fechas).filter(otro_medio).reduce((prev, curr) => prev + curr.monto, 0),
    detalle: '[Otros medios]'
  }
  const otras_direcciones: Movimiento = {
    _id: '',
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
        <div className="mx-2"><p>Desde:</p><DatePick fecha={desde} setFecha={setDesde} /></div>
        <div className="mx-2"><p>Hasta:</p><DatePick fecha={hasta} setFecha={setHasta} /></div>
        {/* <div className="mx-2"><p>Desde:</p><input type="date" value={desde.toISOString().split("T")[0]} onChange={e => setDesde(new Date(e.target.value))} /></div> */}
        {/* <div className="mx-2"><p>Hasta:</p><input type="date" value={hasta.toISOString().split("T")[0]} onChange={e => setHasta(new Date(e.target.value))} /></div> */}
        <div className="mx-2"><p>Medios:</p><Select opts={opcs_medios} onChange={e => setMedio(e.target.value)} /></div>
        <div className="mx-2"><p>Dirección:</p><Select opts={opcs_direccion} onChange={e => setDireccion(e.target.value)} /></div>
      </div>
      {ingresando && <ModalMovimiento cerrar={() => setIngresando(false)} />}
      <Carta>
        <Controles>
          <Boton texto="Ingresar" color="indigo" onClick={() => setIngresando(true)} />
          <Boton texto={borrando ? "Listo" : "Borrar"} color="red" onClick={() => setBorrando(!borrando)} />
        </Controles>
        <CartaBalance movimientos={movimientos_en_rango} borrando={borrando} />
        <P>Total en caja: ${total_en_caja}</P>
      </Carta>
    </Lista>
  );
}