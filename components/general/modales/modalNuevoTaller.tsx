import { entries, every, range, set } from "lodash";
import { useState, ChangeEventHandler } from "react";

import { Modal } from "../display/modal";
import { Grid2 } from "../display/grid2";
import { P } from '../display/p';
import { PError } from '../display/perror';

import { Boton } from "../input/boton";
import { TextInput } from "../input/textInput";
import { NumberInput } from "../input/numberInput";
import { Select } from "../input/select";

import { DiaSemana, TallerMongo } from "../../../lib/api";
import { dias, horarios, dias_semana } from "../../../lib/utils";
import { useBackend } from "../../context/backend";
import { Icon } from "@iconify/react";

interface ModalNuevoTallerProps {
  cerrar: () => void
}

export type HandlerText = ChangeEventHandler<HTMLInputElement>
export type HandlerSelect = ChangeEventHandler<HTMLSelectElement>

const replaceAt = (arr: any[], i: number, repl: any) => [...arr.slice(0, i), repl, ...arr.slice(i + 1)]

export const ModalNuevoTaller = ({ cerrar }: ModalNuevoTallerProps) => {

  const { crearTaller } = useBackend();

  const [taller, setTaller] = useState<Omit<TallerMongo, "_id" | "activo">>({
    nombre: '',
    profe: '',
    horarios: [],
    precios: [0],
    iniciado: new Date()
  })

  const [precioNaN, setPrecioNaN] = useState(false)

  const updateNombre: HandlerText = e => setTaller(t => ({ ...t, nombre: e.target.value }))
  const updateProfe: HandlerText = e => setTaller(t => ({ ...t, profe: e.target.value }))
  const updatePrecio: (i: number) => (n: number) => void = i => n => {
    setTaller(t => ({ ...t, precios: [...t.precios.slice(0, i), n, ...t.precios.slice(i + 1)] }))
  }
  const updateDia: (i: number) => HandlerSelect = i => e => {
    setTaller(t => ({ ...t, horarios: replaceAt(t.horarios, i, { dia: e.target.value as DiaSemana, hora: t.horarios[i].hora }) }))
  }
  const updateHora: (i: number) => HandlerSelect = i => e => {
    setTaller(t => ({ ...t, horarios: replaceAt(t.horarios, i, { dia: t.horarios[i].dia, hora: e.target.value }) }))
  }
  const agregarHorario = () => {
    setTaller(t => ({ ...t, horarios: [...t.horarios, { dia: 'lun', hora: '9:00' }] }))
    setTaller(t => ({ ...t, precios: [...t.precios, 0] }))
  }

  const postTaller = () => { crearTaller(taller).then(cerrar) }

  const opcs_dias = entries(dias).map(([v, txt]) => ({ v, txt }))
  const opcs_horarios = horarios.map(h => ({ v: h, txt: h }))

  const valido = !!taller.nombre && !!taller.profe && taller.horarios.length > 0 && taller.precios.length == taller.horarios.length + 1 && every(taller.precios, p => p > 0)

  return (
    <Modal cerrar={cerrar}>
      <h1 className="text-2xl mb-4">Nuevo taller</h1>
      <div className="flex flex-col items-center">
      <div className="flex flex-col gap-2">
        {/* Nombre de taller */}
        <div className="flex gap-2 items-center">
          <p className="text-lg">Nombre:</p>
          <TextInput value={taller.nombre} onChange={updateNombre} />
        </div>
        {/* Nombre de profe */}
        <div className="flex gap-2 items-center">
          <p className="text-lg">Profe:</p>
          <TextInput value={taller.profe} onChange={updateProfe} />
        </div>
        {/* Horarios */}
        <div className="flex flex-col items-center">
          <div className="w-full">
            <p className="text-lg">Horarios:</p>

            {taller.horarios.map((h, i) =>
              <Grid2>
                <Select onChange={updateDia(i)} opts={opcs_dias} />
                <Select onChange={updateHora(i)} opts={opcs_horarios} />
              </Grid2>)
            }
          </div>
          <Icon className="text-emerald-500 border border-emerald-500 rounded-full hover:scale-150 w-6 h-6" onClick={agregarHorario} icon={"line-md:plus"} />
        </div>
        {/* Precios */}
        <p className="text-lg">Precios:</p>
        <div className="mx-2 flex flex-col items-center">
          {range(taller.horarios.length + 1).map(i =>
            <div className="flex gap-2 items-center justify-between w-full">
              <p className="">{dias_semana[i]}:</p>
              <NumberInput value={taller.precios[i]} update={updatePrecio(i)} setNaN={setPrecioNaN} />
            </div>)
          }
        </div>
      </div>

      <Boton texto="Agregar" color="indigo" activo={valido} onClick={postTaller} />

      {precioNaN && <PError>El precio es incorrecto</PError>}
</div>
    </Modal>
  )
}