import { Movimiento } from "../../lib/api";
import { CartaBalance } from "./balance";
import { ModalMovimiento } from "../general/modalMovimientos";

import { Lista } from "../general/lista";
import { Carta } from "../general/carta";
import { Boton } from "../general/boton";
import { useState } from "react";

interface MovimientosProps {
  movimientos: Movimiento[]
}


export default function Movimientos({ movimientos }: MovimientosProps) {
  const [ingresando, setIngresando] = useState(false);

  return (
    <Lista titulo="Movimientos" bg="grilla">
      {ingresando && <ModalMovimiento cerrar={() => setIngresando(false)}/>}
      <Carta>
        <Boton texto="Ingresar" color="indigo" onClick={() => setIngresando(true)}/>
        <CartaBalance movimientos={movimientos} />
      </Carta>
    </Lista>
  );
}