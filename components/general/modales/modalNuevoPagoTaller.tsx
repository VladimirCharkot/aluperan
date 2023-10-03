import { getMonth, startOfMonth } from "date-fns"
import { capitalize, find, sortBy } from "lodash"
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react"

import { Alumne, Inscripcion, MedioDePago, MovimientoClaseSueltaPost, MovimientoInscripcionPost, MovimientoPost, Taller } from "../../../lib/api"
import { nombres_meses } from "../../../lib/utils"
import { useBackend } from "../../context/backend";

import { Modal } from "../display/modal"
import { P } from "../display/p"
import { Row } from "../display/row"
import { PError } from "../display/perror"

import { Boton } from "../input/boton"
import { Select } from "../input/select"
import { NumberInput } from "../input/numberInput"
import { DatePick } from "../input/date"
import { Check } from "../input/checkbox"

interface ModalNuevoPagoInscripcionInterface {
  cerrar: () => void,
  taller: Taller
}

export type Handler = ChangeEventHandler<HTMLSelectElement>
const medios: MedioDePago[] = ['efectivo', 'mercadopago', 'otro']

export const ModalNuevoPagoTaller = ({ cerrar, taller }: ModalNuevoPagoInscripcionInterface) => {
  const { movimientos, crearMovimiento, lkpAlumnesTaller, lkpInscripcionAlumneTaller } = useBackend()
  const alumnesTaller = sortBy(lkpAlumnesTaller(taller), a => a.nombre)

  const ahora = new Date()

  const [razon, setRazon] = useState<string>('inscripcion')
  const [medio, setMedio] = useState<MedioDePago>('efectivo')
  const [detalle, setDetalle] = useState('')
  const [monto, setMonto] = useState(0)

  const [alumne, setAlumne] = useState<Alumne>();

  const [hayError, setHayError] = useState(false)

  const [mesActual, setMesActual] = useState(true)
  const [mes, setMes] = useState(startOfMonth(ahora))

  const [ocasionHoy, setOcasionHoy] = useState(true)
  const [ocasion, setOcasion] = useState(new Date())

  const msgInscripcion = () => alumne && `Pago de inscripción de ${alumne.nombre} a ${taller.nombre} para el mes de ${nombres_meses[mes.getMonth()]}`
  const msgClaseSuelta = () => alumne && `Pago de clase suelta de ${alumne.nombre} a ${taller.nombre} el día ${ocasion.toLocaleDateString('es-ES')}` 

  useEffect(() => {
    if (razon == 'inscripcion' && alumne) setDetalle(msgInscripcion() ?? '')
    if (razon == 'clase suelta' && alumne) setDetalle(msgClaseSuelta() ?? '') 
  }, [razon, mes, ocasion, alumne])

  const postMovimiento = () => {

    let movimiento
    if (razon == 'inscripcion' && alumne) movimiento = {
      monto, medio, detalle, razon, fecha: ahora,
      inscripcion: lkpInscripcionAlumneTaller(alumne, taller)._id, mes, taller: taller._id, alumne: alumne._id 
    }

    if (razon == 'clase suelta' && alumne) movimiento = {
      monto, medio, detalle, razon, fecha: ahora,
      taller: taller._id, alumne: alumne._id, ocasion
    }

    console.log(`Posteando...`)
    console.log(movimiento)

    console.log(`Array de movimientos antes:`)
    console.log(movimientos)

    crearMovimiento(movimiento).then(cerrar)

  }

  const valido = !hayError && monto != 0 && detalle.length > 0 && !!alumne &&
    ((razon == 'inscripcion' && !!mes) || 
     (razon == 'clase suelta') && !!ocasion)

  const opts_meses = nombres_meses.map((m, i) => ({ v: i, txt: capitalize(m) }))
  const opts_medios = medios.map(m => ({ v: m, txt: capitalize(m) }))

  return <Modal cerrar={cerrar}>

    <P>Alumne</P>
    <Select onChange={e => setAlumne(find(alumnesTaller, a => a._id == e.target.value))} opts={[{v: undefined, txt: 'Seleccionar...'}, ...alumnesTaller.map(a => ({ v: a._id, txt: a.nombre }))]} />

    <P>Razon</P>
    <Select onChange={e => setRazon(e.target.value)} opts={[{ v: 'inscripcion', txt: 'Inscripcion' }, { v: 'clase suelta', txt: 'Clase suelta' }]}></Select>

    <Row>
      <P>Monto:</P>
      <NumberInput value={monto} update={setMonto} setNaN={setHayError} />
    </Row>

    {razon == 'inscripcion' && <>
      <Row>
        <P>Mes actual ({nombres_meses[mes.getMonth()]})</P>
        <Check checked={mesActual} onClick={() => {
          setMesActual(!mesActual)
          setMes(startOfMonth(new Date()))
        }}/>
      </Row>

      {!mesActual && <Select onChange={e => { setMes(new Date(ahora.getFullYear(), parseInt(e.target.value))) }} opts={opts_meses} />}
    </>}


    {razon == 'clase suelta' && <>
      <Row>
        <P>Hoy</P>
        <Check checked={ocasionHoy} onClick={() => {
          setOcasionHoy(!ocasionHoy)
          setOcasion(new Date())
        }} />
      </Row>

      {!ocasionHoy && <DatePick fecha={ocasion} setFecha={setOcasion} shiftHoras={3} />}
    </>}

    <P>Medio:</P>
    <Select onChange={e => setMedio(e.target.value as MedioDePago)} opts={opts_medios} />

    <P>Detalle:</P>
    <P>{detalle}</P>

    <Boton texto="Agregar" color="emerald" activo={valido} onClick={postMovimiento} />

    {hayError && <PError>Monto invalido</PError>}

  </Modal>
}