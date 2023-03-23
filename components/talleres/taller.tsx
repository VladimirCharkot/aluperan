import { useEffect, useState } from "react";
import { Taller } from "../../lib/api";
import { Carta } from "../general/display/carta";
import { InfoTaller } from './info';
import { EditarTaller } from './editar';

import { Controles } from "../general/display/controles";
import { Boton } from "../general/input/boton";

interface CartaTallerProps {
  taller: Taller
}

export const CartaTaller = ({ taller }: CartaTallerProps) => {

  const [editing, setEditing] = useState(false);
  const [tall, setTall] = useState(taller);

  useEffect(() => {
    setTall(tall)
  }, [taller])

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