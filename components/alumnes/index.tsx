import { Alumne } from "../../lib/api";
import { CartaAlumne } from "./alumne";
import { Lista } from "../general/lista";
import { Boton } from "../general/boton";
import { ModalNuevoAlumne } from "../general/modalNuevoAlumne";
import { useEffect, useState } from "react";

interface AlumnesProps {
  alumnes: Alumne[]
}

export default function Alumnes({ alumnes }: AlumnesProps) {
  const [agregando, setAgregando] = useState(false)
  useEffect(() => {
    console.log(alumnes)
  }, [])
  

  return (
      <Lista titulo="Alumnes" bg="tateti" >
        {agregando && <ModalNuevoAlumne cerrar={() => setAgregando(false)}/>}
        <Boton texto="Agregar" color="indigo" onClick={() => { setAgregando(true) }} addons="mx-6"/>
        {alumnes.map((a) => (
          <CartaAlumne key={a._id} alumne={a} />
        ))}
      </Lista>
  );
}




