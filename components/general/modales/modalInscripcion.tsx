import { ChangeEventHandler, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { add, capitalize, find, range } from 'lodash';

import { Modal } from '../display/modal';
import { P } from '../display/p';
import { Row } from '../display/row';

import { Boton } from '../input/boton';
import { Select } from '../input/select';
import { Check } from '../input/checkbox';

import { Alumne, Horario, InscripcionPost, Taller } from '../../../lib/api';
import { useBackend } from '../../context/backend';
import { FlexR } from '../display/flexR';
import { eqHorario, incluyeHorario } from '../../../lib/utils';

interface ModalInscripcionProps {
  alumne?: Alumne,
  taller?: Taller,
  cerrar: () => void,
  setAlumne: Dispatch<SetStateAction<Alumne>>
}

type Handler = ChangeEventHandler<HTMLSelectElement>

interface InscripcionPrePost {
  taller?: string,
  alumne?: string,
  horarios: Horario[]
}

export const ModalInscripcion = ({ alumne, taller, cerrar }: ModalInscripcionProps) => {

  const { talleres, alumnes, crearInscripcion, lkpInscripcionesAlumne, lkpInscripcionesTaller, lkpTallerInscripcion, lkpAlumneInscripcion } = useBackend();

  const [tall, setTaller] = useState<Taller | undefined>(taller)
  const [alum, setAlum] = useState<Alumne | undefined>(alumne)
  const [horarios, setHorarios] = useState<Horario[]>([])

  const [inscripcion, setInscripcion] = useState<InscripcionPrePost>({
    taller: taller ? taller._id : undefined,
    alumne: alumne ? alumne._id : undefined,
    horarios: []
  })

  const updateTaller = (t: string | undefined) => setInscripcion(i => ({ ...i, taller: t }))
  const updateAlumne = (a: string | undefined) => setInscripcion(i => ({ ...i, alumne: a }))

  const addHorario =    (h: Horario) => setHorarios(hs => [...hs, h] )
  const removeHorario = (h: Horario) => setHorarios(hs => hs.filter(vh => !eqHorario(vh, h)))
  const toggleHorario = (h: Horario) => { if (incluyeHorario(horarios, h)) removeHorario(h); else addHorario(h); }

  useEffect(() => { setInscripcion(i => ({...i, horarios})) }, [horarios])
  useEffect(() => { updateTaller(tall ? tall._id : undefined) }, [tall])
  useEffect(() => { updateAlumne(alum ? alum._id : undefined) }, [alum])


  // Talleres que no se encuentren en la lista de inscripciones del alumne
  const inscripciones_alum = alum ? lkpInscripcionesAlumne(alum).filter(i => i.activa) : []
  const talleres_disponibles = alum ?
    talleres.filter(t => t.activo && !find(inscripciones_alum, i => i.taller == t._id)) :
    talleres

  // Alumnes que no se encuentren en la lista de inscripciones del taller
  const inscripciones_taller = taller ? lkpInscripcionesTaller(taller).filter(i => i.activa) : []
  const alumnes_disponibles = taller ?
    alumnes.filter(a => !find(inscripciones_taller, i => lkpAlumneInscripcion(i)._id == a._id)) :
    alumnes

  const valido = !!inscripcion.alumne && !!inscripcion.taller && inscripcion.horarios.length > 0

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
        <Select opts={opcs_alumnes} onChange={seleccionar_alumne} conUndefined />}

      {taller && <P>{taller.nombre}</P>}
      {!taller && opcs_talleres &&
        <Select opts={opcs_talleres} onChange={seleccionar_taller} conUndefined />}

      {tall && <>
        <P>Dias/semana:</P>
        {tall.horarios.map(h =>
          <FlexR>
            <P>{capitalize(h.dia)} {h.hora}</P>
            <Check checked={incluyeHorario(horarios, h)} onClick={() => toggleHorario(h)} />
          </FlexR>
        )}
      </>}

      <Boton addons='ml-auto' texto='Inscribir' color='emerald' activo={valido} onClick={postInscripcion} />

    </Modal>
  )
}



// (<FlexR key={i._id}>
//   <Check checked={asistencias.includes(a._id)} onClick={() => toggleAsistencia(a._id)} />
//   <P>{a.nombre}</P>
// </FlexR>)