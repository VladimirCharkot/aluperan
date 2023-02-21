import axios from "axios"
import { getMonth } from "date-fns"
import { capitalize, findLast, last } from "lodash"
import { ChangeEventHandler, useContext, useEffect, useState } from "react"
import { Inscripcion, MedioDePago, Movimiento } from "../../lib/api"
import { nombres_meses } from "../../lib/utils"
import { AppContext } from "../context"
import { Boton } from "./boton"
import { Modal } from "./modal"

interface ModalNuevoPagoInscripcionInterface {
  cerrar: () => void,
  inscripcion: Inscripcion
}

export type Handler = ChangeEventHandler<HTMLSelectElement>
const medios: MedioDePago[] = ['efectivo', 'mercadopago', 'otro']

export const ModalNuevoPagoInscripcion = ({ cerrar, inscripcion }: ModalNuevoPagoInscripcionInterface) => {
  const { setMovimientos } = useContext(AppContext)

  const [mesActual, setMesActual] = useState(true)
  const [mes, setMes] = useState(getMonth(new Date()))

  const [movimiento, setMovimiento] = useState<Movimiento>({
    monto: last(inscripcion.tarifas)!.monto,
    medio: 'efectivo',
    fecha: new Date(),
    detalle: `Pago de ${inscripcion.alumne.nombre} por ${inscripcion.taller.nombre} para el mes de ${nombres_meses[mes]}`,
    razon: "inscripcion",
    inscripcion: inscripcion._id
  })

  const updateMedio = (m: MedioDePago) => setMovimiento(mov => ({ ...mov, medio: m }))
  const updateDetalle = (d: string) => setMovimiento(mov => ({ ...mov, detalle: d }))
  const updateTarifa = (t: number) => setMovimiento(mov => ({...mov, monto: t}))

  useEffect(() => {
    updateDetalle(`Pago de ${inscripcion.alumne.nombre} por ${inscripcion.taller.nombre} para el mes de ${nombres_meses[mes]}`)
  }, [mes])

  const agregarMovimiento = () => {
    axios.post('/api/movimientos', movimiento).then(r => {
      setMovimientos(ms => [...ms, movimiento])
      cerrar()
    })
  }

  return <Modal>
    <div className='p-8 bg-white rounded-md m-6 border relative flex flex-col z-20'>

      <p className='p-4 pb-0'>Monto:</p>
      <p className='p-4 pb-0'>{movimiento.monto}</p>

      <div className="flex flex-row">
        <p className='p-4'>Mes actual</p>
        <input className="width-min" type="checkbox" checked={mesActual} onClick={() => {
          setMesActual(!mesActual)
          setMes(getMonth(new Date()))
          }} />
      </div>

      {!mesActual && <select className='p-4' onChange={e => {
        setMes(parseInt(e.target.value))
      }}>
        {nombres_meses.map((m, i) => <option key={m} value={i}>{capitalize(m)}</option>)}
      </select>}

      <p className='p-4'>Medio:</p>
      <select className='p-4' onChange={e => updateMedio(e.target.value as MedioDePago)}>
        {medios.map(m => <option key={m} value={movimiento.medio}>{capitalize(m)}</option>)}
      </select>

      <p className='p-4'>Detalle:</p>
      <p className='p-4'>{movimiento.detalle}</p>

      <Boton texto="Agregar" color="emerald" onClick={agregarMovimiento} />

    </div>
  </Modal>
}