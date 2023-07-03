import { find } from "lodash"
import { MovimientoClaseSuelta, MovimientoInscripcion, Taller } from "../../../lib/api"
import { isInMonth } from "../../../lib/utils"
import { useBackend } from "../../context/backend"
import { P } from "../../general/display/p"
import { Boton } from "../../general/input/boton"
import { setEnvironmentData } from "worker_threads"
import { useEffect, useState } from "react"
import { ModalNuevoPagoTaller } from "../../general/modales/modalNuevoPagoTaller"

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

  useEffect(() => {
    console.log('-----------------')
    console.log(taller.nombre)
    console.log(`Pagos taller:`)
    console.log(lkpPagosTaller(taller))
    console.log(`Pagos este mes:`)
    console.log(pagosMes)
    console.log('-----------------')
  }, [mes])

  const [ingresandoPago, setIngresandoPago] = useState(false)

  const inscripciones = lkpInscripcionesTaller(taller).filter(i => i.activa)
  const pagosInscripciones = pagosMes.filter(m => m.razon == 'inscripcion') as MovimientoInscripcion[]
  const pagosClasesSueltas = pagosMes.filter(m => m.razon == 'clase suelta') as MovimientoClaseSuelta[]

  return (
    <>
      {ingresandoPago && <ModalNuevoPagoTaller cerrar={() => setIngresandoPago(false)} taller={taller}/>}
      <div className="grid my-4" style={{gridTemplateColumns: '16px repeat(4, 1fr)'}}>
        <p></p>
        <P>Alumne</P>
        <P>Pago</P>
        <P>Medio</P>
        <P>Fecha</P>

        {inscripciones.map(i => {
          // const pago = find(pagosInscripciones, p => p.inscripcion == i._id)
          const pagos = pagosInscripciones.filter(p => p.inscripcion == i._id)
          const nombre = lkpAlumneInscripcion(i).nombre
          return pagos.length == 1 ? <>
            <p className="text-sm text-center">✓</p>
            <p className="text-sm">{nombre}</p>
            <p className="text-sm">${pagos[0].monto}</p>
            <p className="text-sm">{pagos[0].medio}</p>
            <p className="text-sm">{pagos[0].fecha.toLocaleDateString("es-ES")}</p>
          </> : 
          pagos.length == 0 ? <>
            <p className="text-sm text-center">✗</p>
            <p className="text-sm">{nombre}</p>
            <p className="text-sm">-</p>
            <p className="text-sm">-</p>
            <p className="text-sm">-</p> 
          </> : 
          pagos.map(p => <>
            <p className="text-sm text-center">!</p>
            <p className="text-sm">{nombre}</p>
            <p className="text-sm">${p.monto}</p>
            <p className="text-sm">{p.medio}</p>
            <p className="text-sm">{p.fecha.toLocaleDateString("es-ES")}</p>
          </>)
        })}
        
        { [pagosClasesSueltas.map(p => <>
            <p className="text-sm text-center">+</p>
            <p className="text-sm">{lkpAlumne(p.alumne).nombre}</p>
            <p className="text-sm">${p.monto}</p>
            <p className="text-sm">{p.medio}</p>
            <p className="text-sm">{p.fecha.toLocaleDateString("es-ES")}</p> 
        </>)] }
        
        <>
            <p className="text-sm"></p>
            <p className="text-sm border-t">Total:</p>
            <p className="text-sm border-t">${pagosMes.reduce((total, pago) => pago.monto + total, 0)}</p>
            <p className="text-sm border-t"></p>
            <p className="text-sm border-t"></p> 
          </>

      </div>

      <Boton texto="Ingresar pago" color="emerald" onClick={() => { setIngresandoPago(true) }}/>

      <hr />
    </>
  )
}