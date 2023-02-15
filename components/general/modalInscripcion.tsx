import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Alumne, Taller, Inscripcion } from '../../lib/api';
import { Modal } from './modal';
import { Boton } from './boton';
import axios from 'axios';
import { find, range } from 'lodash';

interface ModalInscripcionProps {
  alumne?: Alumne,
  taller?: Taller,
  cerrar: () => void,
  setAlumne: Dispatch<SetStateAction<Alumne>>
}

export const ModalInscripcion = ({ alumne, taller, cerrar, setAlumne }: ModalInscripcionProps) => {

  const [talleres, setTalleres] = useState<Taller[]>([])
  const [alumnes, setAlumnes] = useState<Alumne[]>([])
  const [dias, setDias] = useState<Number | null>(null)

  const [tall, setTaller] = useState<Taller | undefined>(taller)
  const [alum, setAlum] = useState<Alumne | undefined>(alumne)

  // Talleres que no se encuentren en la lista de inscripciones del alumne
  const talleres_disponibles = alum ? 
    talleres.filter(t => !find(alum.inscripciones, i => i.taller._id == t._id)) : 
    []

  const addInscripcion = (inscr: Inscripcion) => setAlumne(a => ({
    ...a,
    inscripciones: [...a.inscripciones, inscr]
  }))

  useEffect(() => {
    axios.get('/api/alumnes').then(r => { if (r.status == 200) setAlumnes(r.data); else console.log(r); })
    axios.get('/api/talleres').then(r => { if (r.status == 200) setTalleres(r.data); else console.log(r); })
  }, [])

  const inscribir = () => {
    if (alum && tall && dias)
      axios.post('/api/inscripciones', { alumne: alum._id, taller: tall._id, dias: dias }).then(
        r => {if (r.status == 200) addInscripcion({ ...r.data, titulo: tall.nombre }); cerrar(); }
      )
    else {
      alert('Falta algo che')
    }
  }

  return (
    <Modal>
      <div className='p-8 bg-white rounded-md m-6 border relative flex flex-col z-20'>

        <p className='absolute top-0 right-0 text-2xl m-5 cursor-pointer' onClick={cerrar}>X</p>

        <h3 className="text-3xl p-4 text-rye">Inscripción nueva</h3>

        {alum && <p className='p-4'>{alum.nombre}</p>}
        {!alum && alumnes &&
          <select className='p-4'
            onChange={e => { setAlum(find(alumnes, a => a._id == e.target.value)) }}>
            <option value={undefined}></option>
            {alumnes.map(a => <option key={a._id} value={a._id}>{a.nombre}</option>)}
          </select>}

        {tall && <p className='p-4'>{tall.nombre}</p>}
        {!tall && talleres &&
          <select className='p-4'
            onChange={e => { setTaller(find(talleres, t => t._id == e.target.value)) }}>
            <option value={undefined}></option>
            {talleres_disponibles.map(t => <option key={t._id} value={t._id}>{t.nombre}</option>)}
          </select>}

        {tall && <>
          <p>Dias/semana:</p>
          <div className='flex flex-row'>
            {range(tall.precios.length - 1).map(n => <Radio key={n} n={n} state={dias} setN={setDias} />)}
          </div>
        </>}

        <Boton addons='ml-auto' texto='Inscribir' color='emerald' onClick={inscribir} />

      </div>
    </Modal>
  )
}

const Radio = ({ n, state, setN }: any) => {
  const seleccionado = n == state - 1
  return <div className={`${seleccionado ? 'bg-emerald-300' : ''} py-1 px-3 border`}
    onClick={() => {
      if (seleccionado) setN(null)
      else setN(n + 1)
    }}>{n + 1}</div>
}