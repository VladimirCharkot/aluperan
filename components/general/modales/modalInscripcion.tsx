import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { find, first, range } from 'lodash';

import { Modal } from '../display/modal';
import { P } from '../display/p';
import { Row } from '../display/row';

import { Boton } from '../input/boton';
import { Radio } from '../input/radio';
import { Select } from '../input/select';

import { AppContext } from '../../context';
import { Alumne, Taller, InscripcionPost } from '../../../lib/api';
import { useBackend } from '../../context/backend';

interface ModalInscripcionProps {
  alumne?: Alumne,
  taller?: Taller,
  cerrar: () => void,
  setAlumne: Dispatch<SetStateAction<Alumne>>
}

export const ModalInscripcion = ({ alumne, taller, cerrar, setAlumne }: ModalInscripcionProps) => {

  const { talleres, alumnes } = useContext(AppContext);
  const { crearInscripcion } = useBackend();

  const [dias, setDias] = useState(1)
  const [tall, setTaller] = useState<Taller>(taller ?? first(talleres)!)
  const [alum, setAlum] = useState<Alumne>(alumne ?? first(alumnes)!)

  const [inscripcion, setInscripcion] = useState<InscripcionPost>({
    taller: taller ? taller._id : first(talleres)!._id,
    alumne: alumne ? alumne._id : first(alumnes)!._id,
    dias: 1
  })
  const updateTaller = (t: string) => setInscripcion(i => ({ ...i, taller: t }))
  const updateAlumne = (a: string) => setInscripcion(i => ({ ...i, alumne: a }))
  const updateDias = (n: number) => setInscripcion(i => ({ ...i, dias: n }))

  useEffect(() => { updateDias(dias) }, [dias])
  useEffect(() => { updateTaller(tall._id) }, [tall])
  useEffect(() => { updateAlumne(alum._id) }, [alum])

  // Talleres que no se encuentren en la lista de inscripciones del alumne
  const talleres_disponibles = alum ?
    talleres.filter(t => !find(alum.inscripciones, i => i.taller._id == t._id)) :
    talleres

  const valido = !!inscripcion.alumne && !!inscripcion.taller && !!inscripcion.dias
  const opcs_alumnes = alumnes.map(a => ({ v: a._id, txt: a.nombre }))
  const opcs_talleres = talleres_disponibles.map(t => ({ v: t._id, txt: t.nombre }))

  const postInscripcion = () => { crearInscripcion(inscripcion).then(cerrar) }

  return (
    <Modal cerrar={cerrar}>
      <h3 className="text-3xl p-4 text-rye">Inscripción nueva</h3>

      {alumne && <P>{alum.nombre}</P>}
      {!alumne && alumnes &&
        <Select opts={opcs_alumnes} onChange={e => { setAlum(find(alumnes, a => a._id == e.target.value)!) }} />}

      {taller && <P>{taller.nombre}</P>}
      {!taller && talleres &&
        <Select opts={opcs_talleres} onChange={e => { setTaller(find(talleres, t => t._id == e.target.value)!) }} />}

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

