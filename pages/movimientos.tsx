import { get_movimientos } from "../lib/movimientos";
import { MovimientoType } from "../lib/movimientos";

const serialize = (obj: any[]) => JSON.parse(JSON.stringify(obj))

interface MovimientosProps {
  movimientos: MovimientoType[]
}

export async function getServerSideProps() {
  return { props: { movimientos: serialize(await get_movimientos()) } }
}

export default function Movimientos({ movimientos }: MovimientosProps) {
  return (
    <div className="h-screen grilla w-full overflow-y-scroll">
      <h1 className="text-3xl p-4 text-rye">Movimientos</h1>
      <Balance movimientos={movimientos}/>
    </div>
  );
}

export interface BalanceProps {
  movimientos: MovimientoType[]
}

export const format_curr = (amnt: number) => amnt >= 0 ? `$${amnt}` : `-$${Math.abs(amnt)}`

export const Balance = ({ movimientos }: BalanceProps) => {

  return (
    <div className="grid grid-cols-4 m-5 bg-white/50 rounded-md p-5">
      <div className="text-2xl">Fecha</div>
      <div className="text-2xl">Movimiento</div>
      <div className="text-2xl">Balance</div>
      <div className="text-2xl">Detalle</div>

      {movimientos.map((m, i) =>
      (<>
        <div>{new Date(m.fecha).toLocaleDateString()}</div>
        <div>{format_curr(m.monto)}</div>
        <div>{format_curr(movimientos.slice(0, i + 1).reduce((total, m) => total + m.monto, 0))}</div>
        <div>{m.detalle}</div>
      </>)
      )}
    </div>
  )
}