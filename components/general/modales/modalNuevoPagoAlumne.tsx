import { startOfMonth } from "date-fns"
import { capitalize, find, sortBy } from "lodash"
import { ChangeEventHandler, useEffect, useState } from "react"

import { Alumne, MedioDePago, Taller } from "../../../lib/api"
import { nombres_meses } from "../../../lib/utils"
import { useBackend } from "../../context/backend"

import { Modal } from "../display/modal"
import { P } from "../display/p"
import { Row } from "../display/row"
import { PError } from "../display/perror"

import { Boton } from "../input/boton"
import { Select } from "../input/select"
import { NumberInput } from "../input/numberInput"
import { DatePick } from "../input/date"
import { Check } from "../input/checkbox"

interface ModalNuevoPagoAlumneInterface {
  cerrar: () => void,
  alumne: Alumne
}

export type Handler = ChangeEventHandler<HTMLSelectElement>
const medios: MedioDePago[] = ['efectivo', 'mercadopago', 'otro']

export const ModalNuevoPagoAlumne = ({ cerrar, alumne }: ModalNuevoPagoAlumneInterface) => {
  const { movimientos, crearMovimiento, lkpTalleresAlumne, lkpInscripcionAlumneTaller, lkpInscripcionesAlumne } = useBackend()
  console.log(lkpTalleresAlumne(alumne))
  console.log(lkpInscripcionesAlumne(alumne))
  const talleresAlumne = sortBy(lkpTalleresAlumne(alumne), a => a.nombre)

  const ahora = new Date()

  const [razon, setRazon] = useState<string>('inscripcion')
  const [medio, setMedio] = useState<MedioDePago>('efectivo')
  const [detalle, setDetalle] = useState('')
  const [monto, setMonto] = useState(0)

  const [taller, setTaller] = useState<Taller>();

  const [hayError, setHayError] = useState(false)

  const [mesActual, setMesActual] = useState(true)
  const [mes, setMes] = useState(startOfMonth(ahora))

  const [ocasionHoy, setOcasionHoy] = useState(true)
  const [ocasion, setOcasion] = useState(new Date())

  const msgInscripcion = () => taller && `Pago de inscripción de ${alumne.nombre} a ${taller.nombre} para el mes de ${nombres_meses[mes.getMonth()]}`
  const msgClaseSuelta = () => taller && `Pago de clase suelta de ${alumne.nombre} a ${taller.nombre} el día ${ocasion.toLocaleDateString('es-ES')}` 

  useEffect(() => {
    if (razon == 'inscripcion' && taller) setDetalle(msgInscripcion() ?? '')
    if (razon == 'clase suelta' && taller) setDetalle(msgClaseSuelta() ?? '') 
  }, [razon, mes, ocasion, taller])

  const postMovimiento = () => {

    let movimiento
    if (razon == 'inscripcion' && taller) movimiento = {
      monto, medio, detalle, razon, fecha: ahora,
      inscripcion: lkpInscripcionAlumneTaller(alumne, taller)._id, mes, taller: taller._id, alumne: alumne._id 
    }

    if (razon == 'clase suelta' && taller) movimiento = {
      monto, medio, detalle, razon, fecha: ahora,
      taller: taller._id, alumne: alumne._id, ocasion
    }

    console.log(`Posteando...`)
    console.log(movimiento)

    console.log(`Array de movimientos antes:`)
    console.log(movimientos)

    crearMovimiento(movimiento).then(() => {console.log(`Array de movimientos despues:`);  console.log(movimientos); cerrar()})

  }

  const valido = !hayError && monto != 0 && detalle.length > 0 && !!alumne &&
    ((razon == 'inscripcion' && !!mes) || 
     (razon == 'clase suelta') && !!ocasion)

  const opts_meses = nombres_meses.map((m, i) => ({ v: i, txt: capitalize(m) }))
  const opts_medios = medios.map(m => ({ v: m, txt: capitalize(m) }))

  return <Modal cerrar={cerrar}>

    <P>Taller</P>
    <Select onChange={e => setTaller(find(talleresAlumne, t => t._id == e.target.value))} opts={[{v: undefined, txt: 'Seleccionar...'}, ...talleresAlumne.map(t => ({ v: t._id, txt: t.nombre }))]} />

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