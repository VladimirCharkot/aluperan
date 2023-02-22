import { ChangeEventHandler, useContext, useState } from "react";
import { Modal } from "./modal";
import { Boton } from "./boton";
import { AlumneMongo } from "../../lib/api";
import { AppContext } from "../context";
import { TextInput } from "./textInput";
import axios from "axios";

interface ModalNuevoAlumneProps {
  cerrar: () => void
}

export type Handler = ChangeEventHandler<HTMLInputElement>

export const ModalNuevoAlumne = ({ cerrar }: ModalNuevoAlumneProps) => {

  const {setAlumnes} = useContext(AppContext)

  const [alumne, setAlumne] = useState<Omit<AlumneMongo, "_id">>({ nombre: '' })

  const updateNombre: Handler = e => setAlumne(a => ({ ...a, nombre: e.target.value }))
  const updateCelular: Handler = e => setAlumne(a => ({ ...a, celular: e.target.value }))
  const updateEmail: Handler = e => setAlumne(a => ({ ...a, email: e.target.value }))
  const agregarAlumne = () => {
    axios.post('/api/alumnes', alumne).then(r => {
      if (r.status == 200) {
        setAlumnes(alums => [...alums, {...alumne, ...r.data, inscripciones: [], pagos: []}])
        cerrar()
      }
    })
  }

  const valido = !!alumne.nombre

  return (
    <Modal>
      <div className='p-8 bg-white rounded-md m-6 border relative flex flex-col z-20'>

        <p className='absolute top-0 right-0 text-2xl m-5 cursor-pointer' onClick={cerrar}>X</p>

        <p className='p-4'>Nombre:</p>
        <TextInput value={alumne.nombre} onChange={updateNombre} />

        <p className='p-4'>Celular:</p>
        <TextInput value={alumne.celular ?? ''} onChange={updateCelular} />

        <p className='p-4'>Email:</p>
        <TextInput value={alumne.email ?? ''} onChange={updateEmail} />

        <Boton addons='ml-auto' texto='Agregar' color={valido ? "emerald" : "gray"} onClick={() => {
          if(valido){ agregarAlumne()}
        }} />
      </div>
    </Modal>
  )
}