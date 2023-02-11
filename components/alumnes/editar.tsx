import { Dispatch, SetStateAction, ChangeEventHandler, useState } from "react";
import { TextInput } from "../general/textinput";
import { Boton } from "../general/boton";
import { ModalInscripcion } from "../general/modalInscripcion";
import { Alumne} from "../../lib/api";
import axios from 'axios';

export type Handler = ChangeEventHandler<HTMLInputElement>
interface EditarAlumneProps {
  alumne: Alumne,
  setAlum: Dispatch<SetStateAction<Alumne>>,
  setEditing: Dispatch<SetStateAction<boolean>>,
}

export const EditarAlumne = ({ alumne, setAlum, setEditing }: EditarAlumneProps) => {

  const [inscribiendo, setInscribiendo] = useState<boolean>(false);

  const updateMail: Handler = e => { setAlum(a => ({ ...a, email: e.target.value })) }
  const updateCelu: Handler = e => { setAlum(a => ({ ...a, celular: e.target.value })) }
  const updateNombre: Handler = e => { setAlum(a => ({ ...a, nombre: e.target.value })) }

  const deleteInscripcion = (inscr: string) => setAlum(a => ({
    ...a,
    inscripciones: a.inscripciones.filter(i => i._id != inscr)
  }))

  const baja = (id: string) => axios.put('/api/inscripciones', { _id: id, activa: false }).then(
    r => { if (r.status == 200) deleteInscripcion(id) }
  )

  const update = () => axios.post('/api/alumnes', alumne).then(
    r => { setEditing(false); }
  )

  return (
    <>

      {inscribiendo && <ModalInscripcion alumne={alumne} setAlumne={setAlum} cerrar={() => setInscribiendo(false)}/>}

      <input className="text-2xl bg-transparent border-b outline-none" value={alumne.nombre} onChange={updateNombre} />

      <hr />

      <div className="invisible bg-indigo-200 border-indigo-300 bg-red-200 border-red-300 bg-emerald-200 border-emerald-300"></div>

      <div className="grid grid-cols-2 gap-2 my-3">
        <p>Celular:</p>
        <TextInput value={alumne.celular ?? ''} onChange={updateCelu} />
        <p>Mail:</p>
        <TextInput value={alumne.email ?? ''} onChange={updateMail} />
      </div>

      <p className="text-xl mt-3">Inscripciones:</p>
      {alumne.inscripciones.map(i => <div key={i._id} className="flex flex-row items-center justify-between my-2">
        <p>{i.titulo}</p>
        <Boton color="red" texto="Baja" onClick={() => baja(i._id)} />
      </div>)}

      <Boton color="emerald" texto="Agregar inscripcion" onClick={() => {
        setInscribiendo(true);
      }} />

      <hr />

      <div className="flex flex-row-reverse">
        <Boton color="indigo" texto="Listo" onClick={update} />
      </div>

    </>)
}