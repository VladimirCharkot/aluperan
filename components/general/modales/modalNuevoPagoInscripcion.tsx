import axios from "axios"
import { getMonth } from "date-fns"
import { capitalize, last } from "lodash"
import { ChangeEventHandler, useEffect, useState } from "react"

import { Inscripcion, MedioDePago, MovimientoPost } from "../../../lib/api"
import { nombres_meses } from "../../../lib/utils"
import { useBackend } from "../../context/backend";

import { Modal } from "../display/modal"
import { P } from "../display/p"
import { Row } from "../display/row"
import { PError } from "../display/perror"

import { Boton } from "../input/boton"
import { Select } from "../input/select"
import { NumberInput } from "../input/numberInput"

interface ModalNuevoPagoInscripcionInterface {
  cerrar: () => void,
  inscripcion: Inscripcion
}

export type Handler = ChangeEventHandler<HTMLSelectElement>
const medios: MedioDePago[] = ['efectivo', 'mercadopago', 'otro']

export const ModalNuevoPagoInscripcion = ({ cerrar, inscripcion }: ModalNuevoPagoInscripcionInterface) => {
  const { crearMovimiento } = useBackend()

  const ahora = new Date()

  const [mesActual, setMesActual] = useState(true)
  const [hayError, setHayError] = useState(false)
  const [mes, setMes] = useState(getMonth(ahora))

  const [movimiento, setMovimiento] = useState<MovimientoPost>({
    monto: last(inscripcion.tarifas)!.monto,
    medio: 'efectivo',
    fecha: ahora,
    detalle: `Pago de ${inscripcion.alumne.nombre} por ${inscripcion.taller.nombre} para el mes de ${nombres_meses[mes]}`,
    razon: "inscripcion",
    inscripcion: inscripcion._id,
    mes: new Date(ahora.getFullYear(), mes)
  })

  const updateMedio = (m: MedioDePago) => setMovimiento(mov => ({ ...mov, medio: m }))
  const updateDetalle = (d: string) => setMovimiento(mov => ({ ...mov, detalle: d }))
  const updateTarifa = (t: number) => setMovimiento(mov => ({ ...mov, monto: t }))

  useEffect(() => {
    updateDetalle(`Pago de ${inscripcion.alumne.nombre} por ${inscripcion.taller.nombre} para el mes de ${nombres_meses[mes]}`)
  }, [mes])

  const postMovimiento = () => { crearMovimiento(movimiento).then(cerrar) } 

  const valido = !hayError
  const opts_meses = nombres_meses.map((m, i) => ({v: i, txt: capitalize(m)}))
  const opts_medios = medios.map(m => ({v: m, txt: capitalize(m)}))

  return <Modal cerrar={ cerrar }>
      <Row>
        <P>Monto:</P>
        <NumberInput value={movimiento.monto} update={updateTarifa} setNaN={setHayError} />
      </Row>

      <Row>
        <P>Mes actual</P>
        <input className="width-min" type="checkbox" checked={mesActual} onClick={() => {
          setMesActual(!mesActual)
          setMes(getMonth(new Date()))
        }} />
      </Row>

      {!mesActual && <Select onChange={e => { setMes(parseInt(e.target.value)) }} opts={opts_meses} />}

      <P>Medio:</P>      
      <Select onChange={e => updateMedio(e.target.value as MedioDePago)} opts={opts_medios} />

      <P>Detalle:</P>
      <P>{movimiento.detalle}</P>

      <Boton texto="Agregar" color="emerald" activo={valido} onClick={postMovimiento} />

      {hayError && <PError>Monto invalido</PError>}

  </Modal>
}