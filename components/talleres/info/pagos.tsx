import { Inscripcion, MovimientoClaseSuelta, MovimientoInscripcion, Taller } from "../../../lib/api"
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

  const { lkpPagosTaller, lkpAlumne, lkpInscripcionesTaller, lkpAlumneInscripcion } = useBackend()
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

  // useEffect(() => {
  //   //@ts-ignore
  //   window.isInMonth = isInMonth
  //   console.log('-----------------')
  //   console.log(taller.nombre)
  //   console.log(mes)
  //   console.log(`Pagos taller:`)
  //   console.log(lkpPagosTaller(taller))
  //   console.log(`Pagos este mes:`)
  //   console.log(pagosMes)
  //   console.log(`Inscripciones:`)
  //   console.log(inscripciones)
  //   console.log('-----------------')
  // }, [mes])


  return (
    <>
      {ingresandoPago && <ModalNuevoPagoTaller cerrar={() => setIngresandoPago(false)} taller={taller} />}
      <div className="grid my-4" style={{ gridTemplateColumns: '16px repeat(5, 1fr)' }}>
        <p></p>
        <P>Alumne</P>
        <P>Ficha médica</P>
        <P>Pago</P>
        <P>Medio</P>
        <P>Fecha</P>

        {(verInactivas ? inscripciones : inscripcionesActivas).map(i => {
          const pagos = pagosInscripciones.filter(p => p.inscripcion == i._id)
          const alum = lkpAlumneInscripcion(i)
          const nombre = alum.nombre
          const ficha = alum.ficha
          return pagos.length == 1 ? <>
            <p className="text-sm text-center">✓</p>
            <p className="text-sm">{nombre} {i.activa ? "" : "♱"}</p>
            <p className="text-sm">{ ficha ? '✓' : '✗' }</p>
            <p className="text-sm">${pagos[0].monto}</p>
            <p className="text-sm">{pagos[0].medio}</p>
            <p className="text-sm">{pagos[0].fecha.toLocaleDateString("es-ES")}</p>
          </> :
            pagos.length == 0 ? <>
              <p className="text-sm text-center">✗</p>
              <p className="text-sm">{nombre} {i.activa ? "" : "♱"}</p>
              <p className="text-sm">{ ficha ? '✓' : '✗' }</p>
              <p className="text-sm">-</p>
              <p className="text-sm">-</p>
              <p className="text-sm">-</p>
            </> :
              pagos.map(p => <>
                <p className="text-sm text-center">!</p>
                <p className="text-sm">{nombre} {i.activa ? "" : "♱"}</p>
                <p className="text-sm">{ ficha ? '✓' : '✗' }</p>
                <p className="text-sm">${p.monto}</p>
                <p className="text-sm">{p.medio}</p>
                <p className="text-sm">{p.fecha.toLocaleDateString("es-ES")}</p>
              </>)
        })}

        {[pagosClasesSueltas.map(p => <>
          <p className="text-sm text-center">+</p>
          <p className="text-sm">{ lkpAlumne(p.alumne).nombre }</p>
          <p className="text-sm">{ lkpAlumne(p.alumne).ficha ? '✓' : '✗'}</p>
          <p className="text-sm">${p.monto}</p>
          <p className="text-sm">{p.medio}</p>
          <p className="text-sm">{p.fecha.toLocaleDateString("es-ES")}</p>
        </>)]}

        {!verInactivas && <>
          <p className="text-sm text-center">♱</p>
          <p className="text-sm">Inscripciones inactivas</p>
          <p className="text-sm"></p>
          <p className="text-sm">${montoInactivas}</p>
          <p className="text-sm"></p>
          <p className="text-sm"></p> 
        </>}

        <>
          <p className="text-sm"></p>
          <p className="text-sm"></p>
          <p className="text-sm border-t">Total:</p>
          <p className="text-sm border-t">${pagosMes.reduce((total, pago) => pago.monto + total, 0)}</p>
          <p className="text-sm border-t"></p>
          <p className="text-sm border-t"></p>
        </>

      </div>

      <div className="flex justify-between">
        <Boton texto="Ingresar pago" color="emerald" onClick={() => { setIngresandoPago(true) }} />
        <div>
          <label className="p-2">Ver inactivas</label>
          <Check checked={verInactivas} onClick={() => setVerInactivas(!verInactivas)}/>
        </div>
      </div>

      <hr />
    </>
  )
}