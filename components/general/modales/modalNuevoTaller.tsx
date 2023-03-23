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
    setTaller(t => ({...t, horarios: replaceAt(t.horarios, i, { dia: e.target.value as DiaSemana, hora: t.horarios[i].hora })}))
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

      <P>Nombre:</P>
      <TextInput value={taller.nombre} onChange={updateNombre} />

      <P>Profe:</P>
      <TextInput value={taller.profe} onChange={updateProfe} />

      <P>Horarios:</P>
      {taller.horarios.map((h, i) =>
        <Grid2>
          <Select onChange={updateDia(i)} opts={opcs_dias} />
          <Select onChange={updateHora(i)} opts={opcs_horarios} />
        </Grid2>)
      }
      <Boton texto="+Horario" color="emerald" onClick={agregarHorario} />

      <P>Precios:</P>
      {range(taller.horarios.length + 1).map(i =>
        <Grid2>
          <P>{dias_semana[i]}</P>
          <NumberInput value={taller.precios[i]} update={updatePrecio(i)} setNaN={setPrecioNaN} />
        </Grid2>)
      }

      <Boton texto="Agregar" color="indigo" activo={valido} onClick={postTaller} />

      {precioNaN && <PError>El precio es incorrecto</PError>}

    </Modal>
  )
}