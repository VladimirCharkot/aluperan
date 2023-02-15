import { Movimiento } from "../../lib/api";
import { format_curr } from "../../lib/utils";

import { Carta } from "../general/carta";

export interface CartaBalanceProps {
  movimientos: Movimiento[]
}

export const CartaBalance = ({ movimientos }: CartaBalanceProps) => {

  const Header = ({ children }: any) => <div className="text-2xl">{children}</div>

  return (
      <div className="grid grid-cols-4 p-2 m-2">
        <Header>Fecha</Header>
        <Header>Movimiento</Header>
        <Header>Balance</Header>
        <Header>Detalle</Header>

        {movimientos.map((m, i) =>
        (<>
          <div>{new Date(m.fecha).toLocaleDateString('es-ES')}</div>
          <div>{format_curr(m.monto)}</div>
          <div>{format_curr(movimientos.slice(0, i + 1).reduce((total, m) => total + m.monto, 0))}</div>
          <div>{m.detalle}</div>
        </>)
        )}
      </div>
  )
}