import { capitalize, sortBy } from "lodash";
import { Movimiento } from "../../lib/api";
import { format_curr } from "../../lib/utils";
import { Boton } from "../general/input/boton";
import { useBackend } from "../context/backend";

export interface CartaBalanceProps {
  movimientos: Movimiento[],
  borrando?: boolean
}

export const CartaBalance = ({ movimientos, borrando }: CartaBalanceProps) => {

  const Header = ({ children }: any) => <div className="text-xl">{children}</div>
  const { eliminarMovimiento } = useBackend()

  return (
    <div className={`grid ${borrando ? "grid-cols-8" : "grid-cols-7"} p-2 m-2`}>
      {/* <Header>Fecha</Header>
        <Header>Medio</Header>
        <Header>Movimiento</Header>
        <Header>Balance</Header>
        <div className="col-span-3 text-xl">Detalle</div>
        {borrando && <div className="text-xl w-5"></div>} */}

      {sortBy(movimientos, m => m.fecha).map((m, i) => {
        const cn = m.medio == '-' ? 'text-gray-300 text-sm' : ''
        return (<>
          <div className={cn}>{new Date(m.fecha).toLocaleDateString('es-ES')}</div>
          <div className={cn}>{capitalize(m.medio)}</div>
          <div className={cn}>{format_curr(m.monto)}</div>
          <div className={cn}>{format_curr(movimientos.slice(0, i + 1).reduce((total, m) => total + m.monto, 0))}</div>
          <div className={cn +' col-span-3'}>{m.detalle}</div>
          {borrando && (m._id != '' ? <Boton addons="h-8" texto="X" color="red" onClick={() => {
            eliminarMovimiento(m)
          }} /> : <div className="w-5" />)}
        </>)
      }
      )}
    </div>
  )
}