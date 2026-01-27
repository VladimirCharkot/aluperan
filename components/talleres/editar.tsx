import { Dispatch, SetStateAction, ChangeEventHandler, useState, useEffect } from "react"
import { Taller } from "../../lib/api"
import { dias, dias_semana } from "../../lib/utils"
import { range } from "lodash"

import { ModalHorarioTaller } from "../general/modales/modalHorarioTaller"
import { Boton } from "../general/input/boton"
import { TextInput } from "../general/input/textInput"
import { TituloInput } from "../general/input/tituloInput"
import { useBackend } from "../context/backend"
import { ModalConfirmarBaja } from "../general/modales/modalConfirmarBaja"
import { FlexR } from "../general/display/flexR"
import { NumberInput } from "../general/input/numberInput"
import { Icon } from "@iconify/react"

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
  const [nanPorcentajeProfe, setNanPorcentajeProfe] = useState<boolean>(false);
  const [porcentajeCorrecto, setPorcentajeCorrecto] = useState<boolean>(false);

  const { editarTaller, editarInscripcion, lkpInscripcionesTaller, lkpAlumneInscripcion } = useBackend()

  useEffect(() => { console.log(taller) }, [taller])

  const updateNombre: Handler = e => setTaller(t => ({ ...t, nombre: e.target.value }))
  const updateProfe: Handler = e => setTaller(t => ({ ...t, profe: e.target.value }))
  const updatePorcentajeProfe = (n: number) => {
    if (n < 0 || n > 100) {
      setPorcentajeCorrecto(false)
      return
    }
    setPorcentajeCorrecto(true)
    setTaller(t => ({ ...t, porcentaje_profe: n }))
  }
  // const deleteInscripcion = (inscr: string) => setTaller(t => ({
  //   ...t,
  //   inscripciones: t.inscripciones.filter(i => i._id != inscr)
  // }))
  const quitarHorario = (i: number) => setTaller(t => ({
    ...t,
    horarios: [...t.horarios.slice(0, i), ...t.horarios.slice(i + 1)]
  }))
  const updatePrecio = (dias: number, precio: number) => setTaller(t => ({
    ...t,
    precios: [...t.precios.slice(0, dias), precio, ...t.precios.slice(dias + 1)]
  }))



  const baja = (id: string) => editarInscripcion({ _id: id, activa: false })

  const update = () => editarTaller(taller).then(() => setEditing(false))

  useEffect(() => {
    if (bajaConfirmada) editarTaller({ _id: taller._id, activo: false })
  }, [bajaConfirmada])

  return (<div className="m-4 border p-4 rounded-xl bg-slate-50">

    {agregandoHorario && <ModalHorarioTaller setTaller={setTaller} cerrar={() => setAgregandoHorario(false)} />}
    {bajandoTaller && <ModalConfirmarBaja nombre={taller.nombre} tipo="taller" cerrar={() => setBajandoTaller(false)} setConfirmado={setBajaConfirmada} />}

    {/* Nombre del taller */}
    <div className="flex gap-2 items-center">
      <p className="min-w-fit text-xl text-emerald-500">Nombre del taller:
      </p>
      <TituloInput className='w-full px-1 rounded' txt={taller.nombre} handler={updateNombre} />
    </div>

    {/* Nombre de profesorx */}
    <div className="flex gap-2 my-3">
      <p className="text-xl text-emerald-500">Profe:</p>
      <input className="border-b px-2 w-full" value={taller.profe ?? ''} onChange={updateProfe} />
    </div>

    {/* Horarios */}
    <div className="flex flex-col items-center py-2">
      <div className="flex gap-4 my-3 w-full">
        <p className="text-xl text-emerald-500">Horarios:</p>
        <div className="flex gap-2 flex-col ">
          {taller.horarios.map((h, i) => <div key={i} className="flex items-center p-1 gap-2 border border-dashed rounded justify-between">
            <p>{dias[h.dia]} {h.hora}</p>
            <Boton iconol={<Icon icon={"ic:round-close"} />} color="red" texto="" onClick={() => quitarHorario(i)} />
          </div>)}
        </div>
      </div>
      <Boton color="emerald" texto="Agregar horario" onClick={() => {
        setAgregandoHorario(true);
      }} />
    </div>

    {/* Precios */}
    <div className="flex items-baseline">
      <div className="flex flex-col gap-1">
        <p className="text-xl text-emerald-500">Precios:</p>
        {range(taller.horarios.length + 1).map((i) => <div key={i} className="flex items-center gap-4 mx-6">
          <p>{dias_semana[i]}:</p>
          <TextInput value={taller.precios[i].toString()} onChange={(e) => updatePrecio(i, parseInt(e.target.value))} />
        </div>)}

      </div>
      {/* Pago profe */}
      <div className="flex items-center gap-2 my-4">

        <p className="text-xl text-emerald-500">Porcentaje profe:</p>
        <NumberInput value={taller.porcentaje_profe ?? 60} update={updatePorcentajeProfe} setNaN={setNanPorcentajeProfe} />
        {nanPorcentajeProfe && <p className="text-xs mt-3">Ingresar entre 0 y 100</p>}
        {taller.porcentaje_profe && nanPorcentajeProfe && <p className="text-xs mt-3">Error en el porcentaje</p>}
        {!porcentajeCorrecto && <p className="text-xs mt-3">El porcentaje debe estar entre 0 y 100</p>}
      </div>
    </div>


    {/* Alumnes */}
    <div className="flex flex-col gap-2 my-4">
      <p className="text-xl text-emerald-500">Alumnes:</p>
      <div className="flex flex-col mx-6">
        {lkpInscripcionesTaller(taller).filter(i => i.activa).map(i => <div key={i._id} className="flex items-center gap-2 my-1">
          <p>{lkpAlumneInscripcion(i).nombre}</p>
          <p className="text-rose-500 " onClick={() => baja(i._id)}> <Icon className="hover:scale-150 cursor-pointer hover:border-rose-500 hover:border hover:rounded-full hover:bg-rose-50" icon={"ic:round-close"} /></p>
        </div>)}
      </div>
    </div>

    {/* Botones */}
    <div className="flex flex-row-reverse">
      <Boton texto="Dar de baja" color="red" onClick={() => setBajandoTaller(true)} />
      <Boton color="indigo" texto="Aceptar cambios" onClick={update} activo={porcentajeCorrecto} />
    </div>
  </div>)
}