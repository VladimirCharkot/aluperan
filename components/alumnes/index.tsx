import { Alumne } from "../../lib/api";
import { CartaAlumne } from "./alumne";
import { Lista } from "../general/lista";
import { Boton } from "../general/boton";
import { ModalNuevoAlumne } from "../general/modalNuevoAlumne";
import { useEffect, useState } from "react";
import { TextInput } from "../general/textInput";

interface AlumnesProps {
  alumnes: Alumne[]
}

export default function Alumnes({ alumnes }: AlumnesProps) {
  const [agregando, setAgregando] = useState(false)
  const [filtro, setFiltro] = useState('');

  return (
      <Lista titulo="Alumnes" bg="tateti" >
        {agregando && <ModalNuevoAlumne cerrar={() => setAgregando(false)}/>}
        <div className="flex justify-between">
          <Boton texto="Agregar" color="indigo" onClick={() => { setAgregando(true) }} addons="mx-6"/>
          <div className="flex items-center"><p>Buscar:</p><input className="mx-6" value={filtro} onChange={e => setFiltro(e.target.value)}/></div>
        </div>
        {alumnes.filter(a => a.nombre.toLowerCase().includes(filtro.toLowerCase())).map((a) => (
          <CartaAlumne key={a._id} alumne={a} />
        ))}
      </Lista>
  );
}




