import { useState } from "react";
import { Alumne } from "../../lib/api";
import { InfoAlumne } from "./info";
import { EditarAlumne } from "./editar";

import { Carta } from "../general/carta";
import { Controles } from "../general/controles";
import { Boton } from "../general/boton";

interface AlumneProps {
  alumne: Alumne
}

export const CartaAlumne = ({ alumne }: AlumneProps) => {
  const [editing, setEditing] = useState(false);
  const [alum, setAlum] = useState(alumne);

  return (<Carta>
    {!editing && <InfoAlumne alumne={alum} />}
    {editing && <EditarAlumne alumne={alum} setAlum={setAlum} setEditing={setEditing} />}

    <Controles>
      {!editing && <Boton color="indigo" texto="Editar" onClick={() => { setEditing(true); }} />}
    </Controles>
  </Carta>)
}