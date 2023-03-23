import { Dispatch, SetStateAction, ChangeEventHandler, useState, useEffect } from "react"
import { Taller } from "../../lib/api"
import { dias, dias_semana } from "../../lib/utils"
import { range } from "lodash"
import axios from 'axios'

import { ModalHorario } from "../general/modales/modalHorarios"
import { Boton } from "../general/input/boton"
import { TextInput } from "../general/input/textInput"
import { TituloInput } from "../general/input/tituloInput"
import { useBackend } from "../context/backend"
import { ModalConfirmarBaja } from "../general/modales/modalConfirmarBaja"
import { FlexR } from "../general/display/flexR"

type Handler = ChangeEventHandler<HTMLInputElement>

interface EditarTallerProps {
  taller: Taller,
  setTaller: Dispatch<SetStateAction<Taller>>,
  setEditing: Dispatch<SetStateAction<boolean>>
}

export const EditarTaller = ({ taller, setTaller, setEditing }: EditarTallerProps) => {

  const [agregandoHorario, setAgregandoHorario] = useState(false);
  const [bajandoTaller, setBajandoTaller] = useState<boolean>(false);
  const [bajaConfirmada, setBajaConfirmada] = useState<boolean>(false);

  const { editarTaller } = useBackend()

  const updateNombre: Handler = e => setTaller(t => ({ ...t, nombre: e.target.value }))
  const updateProfe: Handler = e => setTaller(t => ({ ...t, profe: e.target.value }))
  const deleteInscripcion = (inscr: string) => setTaller(t => ({
    ...t,
    inscripciones: t.inscripciones.filter(i => i._id != inscr)
  }))
  const quitarHorario = (i: number) => setTaller(t => ({
    ...t,
    horarios: [...t.horarios.slice(0, i), ...t.horarios.slice(i + 1)]
  }))
  const updatePrecio = (dias: number, precio: number) => setTaller(t => ({
    ...t,
    precios: [...t.precios.slice(0, dias), precio, ...t.precios.slice(dias + 1)]
  }))

  const baja = (id: string) => axios.put('/api/inscripciones', { _id: id, activa: false }).then(
    r => { if (r.status == 200) deleteInscripcion(id) }
  )

  const update = () => axios.put('/api/talleres', taller).then(
    r => { setEditing(false); }
  )

  useEffect(() => {
    if (bajaConfirmada) editarTaller({_id: taller._id, activo: false}) 
  }, [bajaConfirmada])

  return (<>

    {agregandoHorario && <ModalHorario setTaller={setTaller} cerrar={() => setAgregandoHorario(false)} />}
    {bajandoTaller && <ModalConfirmarBaja nombre={taller.nombre} tipo="taller" cerrar={() => setBajandoTaller(false)} setConfirmado={setBajaConfirmada}/>}
    
    <FlexR justify="between">
      <TituloInput txt={taller.nombre} handler={updateNombre}/>
      <Boton texto="Dar de baja" color="red" onClick={() => setBajandoTaller(true)}/>
    </FlexR>
    
    <hr />

    <div className="grid grid-cols-2 gap-2 my-3">
      <p>Profe:</p>
      <TextInput value={taller.profe ?? ''} onChange={updateProfe} />
    </div>

    <p className="text-xl mt-3">Horarios:</p>
    {taller.horarios.map((h, i) => <div key={i} className="flex flex-row items-center justify-between my-2">
      <p>{dias[h.dia]} {h.hora}</p>
      <Boton color="red" texto="X" onClick={() => quitarHorario(i)} />
    </div>)}

    <Boton color="emerald" texto="Agregar horario" onClick={() => {
      setAgregandoHorario(true);
    }} />

    <p className="text-xl mt-3">Precios:</p>
    {range(taller.horarios.length + 1).map((i) => <div key={i} className="flex flex-row items-center justify-between my-2">
      <p>{dias_semana[i]}:</p>
      <TextInput value={taller.precios[i].toString()} onChange={(e) => updatePrecio(i, parseInt(e.target.value))} />
    </div>)}

    <p className="text-xl mt-3">Alumnes:</p>
    {taller.inscripciones.map(i => <div key={i._id} className="flex flex-row items-center justify-between my-2">
      <p>{i.alumne.nombre}</p>
      <Boton color="red" texto="Baja" onClick={() => baja(i._id)} />
    </div>)}

    <div className="flex flex-row-reverse">
      <Boton color="indigo" texto="Listo" onClick={update} />
    </div>
  </>)
}