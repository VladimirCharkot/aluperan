import { ChangeEventHandler, useEffect } from "react";
import { Modal } from "./modal";
import { Boton } from "./boton";
import { AppContext } from "../context";
import { TextInput } from "./textInput";
import { NumberInput } from "./numberInput";
import axios from "axios";
import { useContext, useState } from "react";
import { DiaSemana, Horario, TallerMongo } from "../../lib/api";
import { dias, horarios, dias_semana } from "../../lib/utils";
import { entries, every, range } from "lodash";

interface ModalNuevoTallerProps {
  cerrar: () => void
}

export type HandlerText = ChangeEventHandler<HTMLInputElement>
export type HandlerSelect = ChangeEventHandler<HTMLSelectElement>

export const ModalNuevoTaller = ({ cerrar }: ModalNuevoTallerProps) => {

  const { setTalleres } = useContext(AppContext)

  const [taller, setTaller] = useState<Omit<TallerMongo, "_id">>({
    nombre: '',
    profe: '',
    horarios: [],
    precios: [0]
  })

  const [precioNaN, setPrecioNaN] = useState(false)

  const updateNombre: HandlerText = e => setTaller(t => ({ ...t, nombre: e.target.value }))
  const updateProfe: HandlerText = e => setTaller(t => ({ ...t, profe: e.target.value }))
  const updatePrecio: (i: number) => (n: number) => void = i => n => {
    setTaller(t => ({
      ...t,
      precios: [...t.precios.slice(0, i), n, ...t.precios.slice(i + 1)]
    }))
  }
  const updateDia: (i: number) => HandlerSelect = i => e => {
    setTaller(t => ({
      ...t,
      horarios: [
        ...t.horarios.slice(0, i),
        { dia: e.target.value as DiaSemana, hora: t.horarios[i].hora },
        ...t.horarios.slice(i + 1)
      ]
    }))
  }
  const updateHora: (i: number) => HandlerSelect = i => e => {
    setTaller(t => ({
      ...t,
      horarios: [
        ...t.horarios.slice(0, i),
        { dia: t.horarios[i].dia, hora: e.target.value },
        ...t.horarios.slice(i + 1)
      ]
    }))
  }

  const agregarHorario = () => {
    setTaller(t => ({ ...t, horarios: [...t.horarios, { dia: 'lun', hora: '9:00' }] }))
    setTaller(t => ({ ...t, precios: [...t.precios, 0] }))
  }

  const agregarTaller = () => {
    axios.post('/api/talleres', taller).then(r => {
      if (r.status == 200) {
        setTalleres(ts => [...ts, { ...taller, _id: r.data.id, inscripciones: [] }])
        cerrar()
      }
    })
  }

  const valido = taller.nombre && taller.profe && taller.horarios.length > 0 && taller.precios.length == taller.horarios.length + 1 && every(taller.precios, p => p > 0)

  return (
    <Modal>
      <div className='p-8 bg-white rounded-md m-6 border relative flex flex-col z-20'>

        <p className='p-4'>Nombre:</p>
        <TextInput value={taller.nombre} onChange={updateNombre} />

        <p className='p-4'>Profe:</p>
        <TextInput value={taller.profe} onChange={updateProfe} />

        <p className='p-4'>Horarios:</p>
        {taller.horarios.map((h, i) => <div key={i} className="grid grid-cols-2">
          <select className="p-2 m-2" onChange={updateDia(i)}>
            {entries(dias).map(([v, txt]) => <option key={v} value={v}>{txt}</option>)}
          </select>
          <select className="p-2 m-2" onChange={updateHora(i)}>
            {horarios.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>)}
        <Boton texto="+Horario" color="emerald" onClick={agregarHorario} />

        <p className='p-4'>Precios:</p>
        {range(taller.horarios.length + 1).map(i => <div key={i} className="grid grid-cols-2">
          <p className='p-4'>{dias_semana[i]}</p>
          <NumberInput value={taller.precios[i]} update={updatePrecio(i)} setNaN={setPrecioNaN} />
        </div>)}

        <Boton texto="Agregar" color={valido ? "indigo" : "gray"} onClick={() => {
          if (valido) { agregarTaller() }
        }} />

        {precioNaN && <p className="text-xs text-red-400">El precio es incorrecto</p>}
      </div>
    </Modal>
  )
}