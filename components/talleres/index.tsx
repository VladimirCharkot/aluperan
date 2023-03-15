import { Taller } from "../../lib/api";
import { CartaTaller } from "./taller";
import { Lista } from "../general/display/lista";
import { useState, useContext } from "react";
import { Boton } from "../general/input/boton";
import { ModalNuevoTaller } from "../general/modales/modalNuevoTaller";
import { AppContext } from "../context";
import { FlexR } from "../general/display/flexR";

export default function Talleres() {
  const { talleres } = useContext(AppContext);

  const [agregando, setAgregando] = useState(false)
  const [filtro, setFiltro] = useState('');

  const cerrarModal = () => setAgregando(false)
  const abrirModal = () => setAgregando(true)

  const talleres_mostrados = talleres.filter(t => t.nombre.toLowerCase().includes(filtro.toLowerCase()) || t.profe.toLowerCase().includes(filtro.toLowerCase()))

  return (
    <Lista titulo="Talleres" bg="burbujas" >
      {agregando && <ModalNuevoTaller cerrar={cerrarModal} />}
      <FlexR justify="between">
        <Boton texto="Agregar" color="indigo" onClick={abrirModal} addons="mx-5" />
        <FlexR>
          <p>Buscar:</p>
          <input className="mx-6" value={filtro} onChange={e => setFiltro(e.target.value)} />
        </FlexR>
      </FlexR>
      {talleres && talleres_mostrados.map((a) => (
        <CartaTaller key={a._id} taller={a} />
      ))}
    </Lista>
  );
}