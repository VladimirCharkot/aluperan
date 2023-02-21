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
  const [filtro, setFiltro] = useState('');

  return (
    <Lista titulo="Talleres" bg="burbujas" >
      {agregando && <ModalNuevoTaller cerrar={() => setAgregando(false)} />}
      <div className="flex justify-between">
        <Boton texto="Agregar" color="indigo" onClick={() => setAgregando(true)} addons="mx-5" />
        <div className="flex items-center"><p>Buscar:</p><input className="mx-6" value={filtro} onChange={e => setFiltro(e.target.value)} /></div>
      </div>
      {talleres.filter(t => t.nombre.toLowerCase().includes(filtro.toLowerCase()) || t.profe.toLowerCase().includes(filtro.toLowerCase())).map((a) => (
        <CartaTaller key={a._id} taller={a} />
      ))}
    </Lista>
  );
}