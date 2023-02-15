import { Taller } from "../../lib/api";
import { CartaTaller } from "./taller";
import { Lista } from "../general/lista";
import { useState } from "react";
import { Boton } from "../general/boton";
import { ModalNuevoTaller } from "../general/modalNuevoTaller";

interface TalleresProps {
  talleres: Taller[]
}

export default function Talleres({ talleres }: TalleresProps) {
  const [agregando, setAgregando] = useState(false)

  return (
    <Lista titulo="Talleres" bg="burbujas" >
      {agregando && <ModalNuevoTaller cerrar={() => setAgregando(false) }/>}
      <Boton texto="Agregar" color="indigo" onClick={() => setAgregando(true)} addons="mx-5" />
      {talleres.map((a) => (
        <CartaTaller key={a._id} taller={a} />
      ))}
    </Lista>
  );
}