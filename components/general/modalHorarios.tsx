import { ChangeEventHandler, Dispatch, SetStateAction, useState } from "react";
import { Modal } from "./modal";
import { Boton } from "./boton";
import { dias, horarios } from "../../lib/utils";
import { entries } from "lodash";
import { Taller, DiaSemana } from "../../lib/api";

interface ModalHorarioProps{
  setTaller: Dispatch<SetStateAction<Taller>>,
  cerrar: () => void
}

export type Handler = ChangeEventHandler<HTMLSelectElement>

export const ModalHorario = ({ setTaller, cerrar }: ModalHorarioProps) => {

  const [dia, setDia] = useState<string>('lun')
  const [hora, setHora] = useState<string>('9:00')

  const agregarHorario = () => {
    setTaller(t => ({...t, 
      horarios: [...t.horarios, {dia: dia as DiaSemana, hora}],
      precios: [...t.precios, 0]
    }))
    cerrar()
  }

  return (
    <Modal>
      <div className='p-8 bg-white rounded-md m-6 border relative flex flex-col z-20'>

        <p className='absolute top-0 right-0 text-2xl m-5 cursor-pointer' onClick={cerrar}>X</p>

        <p className='p-4'>Día:</p>
        <select className='p-4' onChange={e => setDia(e.target.value)}>
          <option value={undefined}></option>
          {entries(dias).map(([d, dia]) => <option key={d} value={d}>{dia}</option>)}
        </select>

        <p className='p-4'>Horario:</p>
        <select className='p-4' onChange={e => setHora(e.target.value)}>
          <option value={undefined}></option>
          {horarios.map(h => <option key={h} value={h}>{h}</option>)}
        </select>

        <Boton addons='ml-auto' texto='Agregar' color='emerald' onClick={agregarHorario} />
      </div>
    </Modal>
  )
}