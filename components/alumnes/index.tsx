import { Alumne } from "../../lib/api";
import { CartaAlumne } from "./alumne";
import { Lista } from "../general/lista";

interface AlumnesProps {
  alumnes: Alumne[]
}

export default function Alumnes({ alumnes }: AlumnesProps) {

  return (
      <Lista titulo="Alumnes" bg="tateti" >
        {alumnes.map((a) => (
          <CartaAlumne key={a._id} alumne={a} />
        ))}
      </Lista>
  );
}




