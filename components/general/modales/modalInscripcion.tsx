import { ChangeEventHandler, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { find, first, range } from 'lodash';

import { Modal } from '../display/modal';
import { P } from '../display/p';
import { Row } from '../display/row';

import { Boton } from '../input/boton';
import { Radio } from '../input/radio';
import { Select } from '../input/select';

import { AppContext } from '../../context';
import { Alumne, Taller, InscripcionPost, Inscripcion } from '../../../lib/api';
import { useBackend } from '../../context/backend';

interface ModalInscripcionProps {
  alumne?: Alumne,
  taller?: Taller,
  cerrar: () => void,
  setAlumne: Dispatch<SetStateAction<Alumne>>
}

type Handler = ChangeEventHandler<HTMLSelectElement>

export const ModalInscripcion = ({ alumne, taller, cerrar, setAlumne }: ModalInscripcionProps) => {

  const { talleres, alumnes, crearInscripcion } = useBackend();

  const [dias, setDias] = useState(1)
  const [tall, setTaller] = useState<Taller | undefined>(taller)
  const [alum, setAlum] = useState<Alumne | undefined>(alumne)

  const [inscripcion, setInscripcion] = useState({
    taller: taller ? taller._id : undefined,
    alumne: alumne ? alumne._id : undefined,
    dias: 1
  })

  const updateTaller = (t: string | undefined) => setInscripcion(i => ({ ...i, taller: t }))
  const updateAlumne = (a: string | undefined) => setInscripcion(i => ({ ...i, alumne: a }))
  const updateDias   = (n: number) => setInscripcion(i => ({ ...i, dias: n }))

  useEffect(() => { updateDias(dias) }, [dias])
  useEffect(() => { updateTaller(tall ? tall._id : undefined) }, [tall])
  useEffect(() => { updateAlumne(alum ? alum._id : undefined) }, [alum])

  // Talleres que no se encuentren en la lista de inscripciones del alumne
  const talleres_disponibles = alum ?
    talleres.filter(t => !find(alum.inscripciones, i => i.taller._id == t._id)) :
    talleres

  const valido = !!inscripcion.alumne && !!inscripcion.taller && !!inscripcion.dias

  const opcs_alumnes = alumnes.map(a => ({ v: a._id, txt: a.nombre }))
  const seleccionar_alumne: Handler = e => { 
    const alum_seleccionado = find(alumnes, a => a._id == e.target.value)!
    console.log(`Seleccionado:`)
    console.log(alum_seleccionado)
    setAlum(alum_seleccionado)
  }
  const opcs_talleres = talleres_disponibles.map(t => ({ v: t._id, txt: t.nombre }))
  const seleccionar_taller: Handler = e => { 
    const taller_seleccionado = find(talleres, t => t._id == e.target.value)!
    console.log(`Seleccionado:`)
    console.log(taller_seleccionado)
    setTaller(taller_seleccionado) 
  }

  const postInscripcion = () => { 
    console.log(`Posteando inscripcion...`)
    console.log(inscripcion)
    crearInscripcion(inscripcion).then(cerrar) 
  }

  return (
    <Modal cerrar={cerrar}>
      <h3 className="text-3xl p-4 text-rye">Inscripción nueva</h3>

      {alumne && <P>{alumne.nombre}</P>}
      {!alumne && opcs_alumnes &&
        <Select opts={opcs_alumnes} onChange={seleccionar_alumne} conUndefined/>}

      {taller && <P>{taller.nombre}</P>}
      {!taller && opcs_talleres &&
        <Select opts={opcs_talleres} onChange={seleccionar_taller} conUndefined/>}

      {tall && <>
        <P>Dias/semana:</P>
        <Row>
          {range(tall.precios.length - 1).map(n =>
            <Radio key={n} n={n} state={dias} setN={setDias} />
          )}
        </Row>
      </>}

      <Boton addons='ml-auto' texto='Inscribir' color='emerald' activo={valido} onClick={postInscripcion} />

    </Modal>
  )
}

