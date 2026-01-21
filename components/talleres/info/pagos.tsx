import { Alumne, Inscripcion, MovimientoClaseSuelta, MovimientoInscripcion, Taller } from "../../../lib/api"
import { isInMonth } from "../../../lib/utils"
import { useBackend } from "../../context/backend"
import { Boton } from "../../general/input/boton"
import { useEffect, useState } from "react"
import { ModalNuevoPagoTaller } from "../../general/modales/modalNuevoPagoTaller"
import { Check } from "../../general/input/checkbox"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Icon } from "@iconify/react"

interface PagosProps {
  taller: Taller,
  mes: Date
}

export const Pagos = ({ taller, mes }: PagosProps) => {
  const { 
    lkpPagosTaller, 
    lkpAlumne, 
    lkpInscripcionesTaller, 
    lkpAlumneInscripcion, 
    lkpAsistenciasAlumneTallerMes, 
    traerAsistencias 
  } = useBackend()

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

  const totalPagos = pagosMes.reduce((total, pago) => pago.monto + total, 0)

  // Traer asistencias de la DB al cambiar mes
  useEffect(() => {
    inscripciones.forEach(i => traerAsistencias(taller._id, mes))
  }, [mes, taller])

  return (
    <>
      {ingresandoPago && <ModalNuevoPagoTaller cerrar={() => setIngresandoPago(false)} taller={taller} />}
      
      <Table className="my-4">
        <TableHeader>
          <TableRow className="font-bold text-lg">
            <TableHead className=""></TableHead>
            <TableHead className="font-bold">Alumne</TableHead>
            <TableHead className="text-center">Asistencias</TableHead>
            <TableHead className="text-center">Ficha</TableHead>
            <TableHead className="text-right">Pago</TableHead>
            <TableHead className="text-center">Medio</TableHead>
            <TableHead>Fecha</TableHead>
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {/* Inscripciones */}
          {(verInactivas ? inscripciones : inscripcionesActivas).flatMap(insc => {
            const alum = lkpAlumneInscripcion(insc)
            const asistencias = lkpAsistenciasAlumneTallerMes(taller, alum, mes).length
            const nombreDisplay = alum.nombre + (insc.activa ? "" : " Ø")
            const ficha = alum.ficha ? '✓' : '✗'
            const pagosInsc = pagosInscripciones.filter(p => p.inscripcion == insc._id)

            // Sin pagos
            if (pagosInsc.length === 0) {
              return (
                <TableRow key={insc._id}>
                  <TableCell className="text-center text-rose-500">✗</TableCell>
                  <TableCell className={`${insc.activa?'':'bg-rose-100 text-rose-500'}`}>{nombreDisplay}</TableCell>
                  <TableCell className="text-center">{asistencias}</TableCell>
                  <TableCell className={`text-center ${alum.ficha? 'text-emerald-500':'text-red-500'}`}>{ficha}</TableCell>
                  <TableCell className="text-right">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center"></TableCell>
                </TableRow>
              )
            }

            // Con pagos (uno o varios)
            return pagosInsc.map((pago, idx) => (
              <TableRow key={`${insc._id}-${idx}`}>
                <TableCell className="text-center text-emerald-500">{pagosInsc.length === 1 ? '✓' : '!'}</TableCell>
                <TableCell>{nombreDisplay}</TableCell>
                <TableCell className="text-center">{asistencias}</TableCell>
                <TableCell className={`text-center ${alum.ficha? 'text-emerald-500':'text-red-500'}`}>{ficha}</TableCell>
                <TableCell className="text-right">${pago.monto}</TableCell>
                <TableCell className="text-center">{pago.medio}</TableCell>
                <TableCell >{pago.fecha.toLocaleDateString("es-ES")}</TableCell>
              </TableRow>
            ))
          })}

          {/* Clases sueltas */}
          {pagosClasesSueltas.map((p, idx) => {
            const alumne = lkpAlumne(p.alumne)
            const asistencias = lkpAsistenciasAlumneTallerMes(taller, { _id: p.alumne } as Alumne, mes).length
            
            return (
              <TableRow key={`clase-suelta-${idx}`}>
                <TableCell className="text-center">+</TableCell>
                <TableCell>{alumne.nombre}</TableCell>
                <TableCell className="text-center">{asistencias}</TableCell>
                <TableCell className={`text-center ${alumne.ficha? 'text-emerald-500':'text-rose-500'}`}>{alumne.ficha ? '✓' : '✗'}</TableCell>
                <TableCell className="text-right">${p.monto}</TableCell>
                <TableCell className="text-center">{p.medio}</TableCell>
                <TableCell>{p.fecha.toLocaleDateString("es-ES")}</TableCell>
              </TableRow>
            )
          })}

          {/* Inscripciones inactivas */}
          {!verInactivas && pagosInactivas.length > 0 && (
            <TableRow className="">
              <TableCell className="text-center"><Icon className="text-rose-500" icon={"icomoon-free:blocked"}/></TableCell>
              <TableCell>Inscripciones inactivas</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="text-right">${montoInactivas}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          )}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="text-right text-lg font-semibold">Total:</TableCell>
            <TableCell className="text-right font-semibold">${totalPagos}</TableCell>
            <TableCell colSpan={2}></TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <div className="flex justify-between mt-4">
        <Boton texto="Ingresar pago" color="emerald" onClick={() => setIngresandoPago(true)} />
        <div className="flex items-center gap-2">
          <label>Ver inscripciones inactivas</label>
          <Check checked={verInactivas} onClick={() => setVerInactivas(!verInactivas)} />
        </div>
      </div>

    </>
  )
}