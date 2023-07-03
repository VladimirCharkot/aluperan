import { Alumne } from "../../lib/api"
import { useBackend } from "../context/backend"
import { P } from "../general/display/p"

interface PagosAlumneProps {
  alumne: Alumne
}

export const PagosAlumne = ({ alumne }: PagosAlumneProps) => {
  const { lkpPagosAlumne } = useBackend()
  const pagos = lkpPagosAlumne(alumne)
  return <>
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

  </>
}