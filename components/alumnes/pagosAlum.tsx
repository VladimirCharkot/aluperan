import { useState } from "react"
import { Alumne } from "../../lib/api"
import { useBackend } from "../context/backend"
import { P } from "../general/display/p"
import { Boton } from "../general/input/boton"
import { ModalNuevoPagoAlumne } from "../general/modales/modalNuevoPagoAlumne"

interface PagosAlumneProps {
  alumne: Alumne
}

export const PagosAlumne = ({ alumne }: PagosAlumneProps) => {
  const { lkpPagosAlumne } = useBackend()
  const [ ingresandoPago, setIngresandoPago ] = useState(false)
  const pagos = lkpPagosAlumne(alumne)
  return <>
    {ingresandoPago && <ModalNuevoPagoAlumne alumne={alumne} cerrar={ () => setIngresandoPago(false) }/>}
    <div className="grid my-4" style={{ gridTemplateColumns: '16px repeat(3, 1fr) 6fr' }}>
      <p></p>
      <P>Pago</P>
      <P>Medio</P>
      <P>Fecha</P>
      <P>Detalle</P>
    { [pagos.map(p => <>
            <p className="text-sm">{p.razon == 'clase suelta' ? '+' : '✓'}</p>
            <p className="text-sm">${p.monto}</p>
            <p className="text-sm">{p.medio}</p>
            <p className="text-sm">{p.fecha.toLocaleDateString("es-ES")}</p> 
            <p className="text-sm">{p.detalle}</p>
        </>)] }
    </div>
    <Boton texto="Ingresar Pago" color="emerald" onClick={() => {setIngresandoPago(true)}}/>

  </>
}