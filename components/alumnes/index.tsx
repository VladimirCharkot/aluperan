import { useState } from "react";
import { Alumne } from "../../lib/api";
import { CartaAlumne } from "./alumne";
import { Lista } from "../general/display/lista";
import { Boton } from "../general/input/boton";
import { ModalNuevoAlumne } from "../general/modales/modalNuevoAlumne";
import { sortBy } from "lodash";
import { useBackend } from "../context/backend";

interface AlumnesProps {
  alumnes: Alumne[]
}

export default function Alumnes() {
  const [agregando, setAgregando] = useState(false)
  const [filtro, setFiltro] = useState('');
  const { alumnes } = useBackend();

  const alumnes_mostrados = sortBy(alumnes
    .filter(a => a.nombre.toLowerCase().includes(filtro.toLowerCase()))
    .filter(a => a.activo !== false), a => a.nombre)

  return (
      <Lista titulo="Alumnes" bg="tateti" >
        {agregando && <ModalNuevoAlumne cerrar={() => setAgregando(false)}/>}
        <div className="flex justify-between">
          <Boton texto="Agregar" color="indigo" onClick={() => { setAgregando(true) }} addons="mx-6"/>
          <div className="flex items-center"><p>Buscar:</p><input className="mx-6" value={filtro} onChange={e => setFiltro(e.target.value)}/></div>
        </div>
        {alumnes && alumnes_mostrados.map((a) => (
          <CartaAlumne key={a._id} alumne={a} />
        ))}
      </Lista>
  );
}




