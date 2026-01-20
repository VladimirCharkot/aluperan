import { Alumne, Inscripcion, MovimientoClaseSuelta, MovimientoInscripcion, Taller } from "../../../lib/api"
import { isInMonth } from "../../../lib/utils"
import { useBackend } from "../../context/backend"
import { P } from "../../general/display/p"
import { Boton } from "../../general/input/boton"
import { useEffect, useState } from "react"
import { ModalNuevoPagoTaller } from "../../general/modales/modalNuevoPagoTaller"
import { Check } from "../../general/input/checkbox"

interface PagosProps {
  taller: Taller,
  mes: Date
}

export const Pagos = ({ taller, mes }: PagosProps) => {

  const { lkpPagosTaller, lkpAlumne, lkpInscripcionesTaller, lkpAlumneInscripcion, lkpAsistenciasAlumneTallerMes, traerAsistencias } = useBackend()

  const pagosMes = lkpPagosTaller(taller).filter(p =>
    (p.razon == 'clase suelta' && isInMonth(p.ocasion, mes))
    || (p.razon == 'inscripcion' && isInMonth(p.mes, mes))
  )

  const [ingresandoPago, setIngresandoPago] = useState(false)
  const [verInactivas, setVerInactivas] = useState(false)

  const inscripciones = lkpInscripcionesTaller(taller) as Inscripcion[]
  const inscripcionesActivas = lkpInscripcionesTaller(taller).filter(i => i.activa)
  const inscripcionesInactivas = lkpInscripcionesTaller(taller).filter(i => !i.activa)
  const pagosInscripciones = pagosMes.filter(m => m.razon == 'inscripcion') as MovimientoInscripcion[]
  const pagosClasesSueltas = pagosMes.filter(m => m.razon == 'clase suelta') as MovimientoClaseSuelta[]

  const pagosInactivas = pagosInscripciones
    .filter(p => inscripcionesInactivas.map(i => i._id).includes(p.inscripcion))
  const montoInactivas = pagosInactivas.reduce((acc, p) => acc + p.monto, 0)

  // Traer asistencias de la DB al cambiar mes
  useEffect(() => {
    inscripciones.forEach(i => traerAsistencias(taller._id, mes))
  }, [mes, taller])

  return (
    <>
      {ingresandoPago && <ModalNuevoPagoTaller cerrar={() => setIngresandoPago(false)} taller={taller} />}
      {/* <div className="text-sm grid my-4" style={{ gridTemplateColumns: '16px repeat(6, 1fr)' }}> */}
      <div className="text-sm grid my-4 gap-x-6" style={{ gridTemplateColumns: '16px 1fr 90px 90px 90px 120px 1fr' }}>
        <p></p>
        <p className="p-4 ">Alumne</p>
        <p className="p-4 text-center">Asistencias</p>
        <p className="p-4 text-center">Ficha</p>
        <p className="p-4 text-right">Pago</p>
        <p className="p-4 ">Medio</p>
        <p className="p-4 text-left">Fecha</p>

        {(verInactivas ? inscripciones : inscripcionesActivas).map(
          // Puede haber varios pagos para una misma inscripción en el mes
          insc => <FilaInscripcion key={insc._id} inscripcion={insc} pagos={pagosInscripciones.filter(p => p.inscripcion == insc._id)} taller={taller} mes={mes} />
        )}

        {/* Clases sueltas */}
        {[pagosClasesSueltas.map(p => <>
          <p className="text-center">+</p>
          <p className="">{lkpAlumne(p.alumne).nombre}</p>
          <p className="text-center">{lkpAsistenciasAlumneTallerMes(taller, { _id: p.alumne } as Alumne, mes).length}</p>
          <p className="text-center">{lkpAlumne(p.alumne).ficha ? '✓' : '✗'}</p>
          <p className="text-right">${p.monto}</p>
          <p className="text-left">{p.medio}</p>
          <p className="text-left">{p.fecha.toLocaleDateString("es-ES")}</p>
        </>)]}

        {/* Inscripciones inactivas header */}
        {!verInactivas && <>
          <p className="text-center">♱</p>
          <p className="">Inscripciones inactivas</p>
          <p className="text-center"></p>
          <p className="text-center"></p>
          <p className="text-right">${montoInactivas}</p>
          <p className=""></p>
          <p className="text-left"></p>
        </>}

        {/* Total */}
        <>
          <p className=""></p>
          <p className=""></p>
          <p className=""></p>
          <p className="border-t"></p>
          <p className="text-right border-t flex gap-8 justify-end">
            <span>Total:</span>
            <span>${pagosMes.reduce((total, pago) => pago.monto + total, 0)}</span></p>
          <p className="border-t"></p>
          <p className="border-t"></p>
        </>

      </div>

      <div className="flex justify-between">
        <Boton texto="Ingresar pago" color="emerald" onClick={() => { setIngresandoPago(true) }} />
        <div>
          <label className="p-2">Ver inactivas</label>
          <Check checked={verInactivas} onClick={() => setVerInactivas(!verInactivas)} />
        </div>
      </div>

      <hr />
    </>
  )
}

function Fila({ cols }: { cols: [string, string, string, string, string, string, string] }) {
  return <>
    <span className="text-center">{cols[0]}</span>
    <span className="">{cols[1]}</span>
    <span className="text-center">{cols[2]}</span>
    <span className="text-center">{cols[3]}</span>
    <span className="text-right">{cols[4]}</span>
    <span className="text-left">{cols[5]}</span>
    <span className="text-left">{cols[6]}</span>
  </>
}

function FilaInscripcion({ pagos, inscripcion, taller, mes }: { pagos?: MovimientoInscripcion[], inscripcion: Inscripcion, taller: Taller, mes: Date }) {

  const { lkpAlumneInscripcion, lkpAsistenciasAlumneTallerMes } = useBackend()

  const alum = lkpAlumneInscripcion(inscripcion)
  const asistencias = lkpAsistenciasAlumneTallerMes(taller, alum, mes).length

  const nombre = alum.nombre
  const ficha = alum.ficha ? '✓' : '✗'
  const nombreDisplay = nombre + (inscripcion.activa ? "" : "♱")

  if (!pagos || pagos.length == 0)
    return <Fila cols={['✗', nombreDisplay, asistencias.toString(), ficha, '-', '-', '-']} />

  if (pagos.length == 1)
    return <Fila cols={['✓', nombreDisplay, asistencias.toString(), ficha, `$${pagos[0].monto}`, pagos[0].medio, pagos[0].fecha.toLocaleDateString("es-ES")]} />

  // Varios pagos, varias filas
  return pagos.map(p => <Fila cols={['!', nombreDisplay, asistencias.toString(), ficha, `$${p.monto}`, p.medio, p.fecha.toLocaleDateString("es-ES")]} />)

}
