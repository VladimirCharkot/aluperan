import { useEffect, useState } from "react";
import { Taller } from "../../../lib/api";
import { useBackend } from "../../context/backend";
import { Boton } from "../../general/input/boton";
import { ModalPasarLista } from "../../general/modales/modalPasarLista";
import { GrillaAsistencias } from "./grillaAsistencias";

interface AsistenciasProps {
  taller: Taller,
  mes: Date
}

export const Asistencias = ({ taller, mes }: AsistenciasProps) => {
  const { traerAsistencias } = useBackend();

  useEffect(() => { traerAsistencias(taller._id, mes) }, [mes])

  const [pasandoLista, setPasandoLista] = useState(false);

  const abrirLista = () => setPasandoLista(true)
  const cerrarLista = () => setPasandoLista(false)

  return <>
    {pasandoLista && <ModalPasarLista taller={taller} cerrar={cerrarLista} />}
    <GrillaAsistencias taller={taller} mes={mes} />
      <Boton texto="Pasar lista" color="emerald" onClick={abrirLista} />
    <hr />
  </>
}