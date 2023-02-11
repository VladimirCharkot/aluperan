import { Taller } from "../../lib/api";
import { CartaTaller } from "./taller";
import { Lista } from "../general/lista";

interface TalleresProps {
  talleres: Taller[]
}

export default function Talleres({ talleres }: TalleresProps) {
  return (
    <Lista titulo="Talleres" bg="burbujas" >
      {talleres.map((a) => (
        <CartaTaller key={a._id} taller={a} />
      ))}
    </Lista>
  );
}