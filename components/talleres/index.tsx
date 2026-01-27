import { Taller } from "../../lib/api";
import { CartaTaller } from "./taller";
import { Lista } from "../general/display/lista";
import { useState, useContext } from "react";
import { Boton } from "../general/input/boton";
import { ModalNuevoTaller } from "../general/modales/modalNuevoTaller";
import { AppContext } from "../context";
import { FlexR } from "../general/display/flexR";
import { sortBy } from "lodash";
import { Icon } from '@iconify/react';

export default function Talleres() {
  const { talleres } = useContext(AppContext);

  const [agregando, setAgregando] = useState(false)
  const [filtro, setFiltro] = useState('');

  const filtrarPorNombreOProfe = (t: Taller) => t.nombre.toLowerCase().includes(filtro.toLowerCase()) || t.profe.toLowerCase().includes(filtro.toLowerCase())
  const filtrarInactivos = (t: Taller) => t.activo !== false

  const cerrarModal = () => setAgregando(false)
  const abrirModal = () => setAgregando(true)

  const talleres_mostrados = sortBy(talleres
    .filter(filtrarPorNombreOProfe)
    .filter(filtrarInactivos), t => t.nombre)

  return (
    <Lista titulo="Talleres" bg="burbujas" >
      {agregando && <ModalNuevoTaller cerrar={cerrarModal} />}

      {/* Menú */}
        <div className="flex bg-white  p-4 rounded-xl items-center mx-6 justify-between">
          <p className="flex gap-2 font-bold"> <Icon className="h-5 w-5" icon={"mingcute:search-line"} /> 
          Buscar:
          <input className="border-b-2" value={filtro} onChange={e => setFiltro(e.target.value)} />
          </p>
        <Boton iconol={<Icon className="h-5 w-5" icon={"ic:round-plus"}/>} texto="Agregar taller" color="indigo" onClick={abrirModal} addons="mx-5" />
          </div>
      
      {talleres && talleres_mostrados.map((a) => (
        <CartaTaller key={a._id} taller={a} />
      ))}
    </Lista>
  );
}