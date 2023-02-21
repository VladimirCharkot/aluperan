import { useState } from "react";
import { Taller } from "../../lib/api";
import { Carta } from "../general/carta";
import { InfoTaller } from './info';
import { EditarTaller } from './editar';

import { Controles } from "../general/controles";
import { Boton } from "../general/boton";

interface CartaTallerProps {
  taller: Taller
}

export const CartaTaller = ({ taller }: CartaTallerProps) => {

  const [editing, setEditing] = useState(false);
  const [tall, setTall] = useState(taller);

  return (
    <Carta>
      {!editing && <InfoTaller taller={tall} />}
      {editing && <EditarTaller taller={tall} setTaller={setTall} setEditing={setEditing} />}

      <Controles>
      {!editing && <Boton color="indigo" texto="Editar" onClick={() => { setEditing(true); }} />}
      </Controles>
    </Carta>

  )
}