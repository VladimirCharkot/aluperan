import { ChangeEventHandler, Dispatch, SetStateAction, useEffect, useState } from "react";
import { Modal } from "../display/modal";
import { Boton } from "../input/boton";
import { capitalize, includes, some } from "lodash";
import { Horario, Inscripcion } from "../../../lib/api";
import { P } from "../display/p";
import { useBackend } from "../../context/backend";
import { FlexR } from "../display/flexR";
import { Check } from "../input/checkbox";
import { eqHorario, incluyeHorario } from "../../../lib/utils";

interface ModalHorarioProps{
  inscripcion: Inscripcion,
  cerrar: () => void
}

export type Handler = ChangeEventHandler<HTMLSelectElement>

export const ModalHorarioInscripcion = ({ inscripcion, cerrar }: ModalHorarioProps) => {
  
  const { lkpTallerInscripcion, lkpAlumneInscripcion, editarInscripcion } = useBackend()
  const taller = lkpTallerInscripcion(inscripcion)
  const alumne = lkpAlumneInscripcion(inscripcion)
  
  const [horarios, setHorarios] = useState<Horario[]>(inscripcion.horarios ?? [])
  
  const addHorario = (h: Horario) => setHorarios(hs => [...hs, h] )
  const removeHorario = (h: Horario) => setHorarios(hs => hs.filter(vh => !eqHorario(vh, h)))
  const toggleHorario = (h: Horario) => { if (incluyeHorario(horarios, h)) removeHorario(h); else addHorario(h); }

  useEffect(() => {
    console.log(`Editando horarios de ${alumne.nombre} para ${taller.nombre}`)
    console.log(`Horarios de la inscripcion:`)
    console.log(horarios)
    console.log(`Horarios del taller`)
    console.log(taller.horarios)
  }, [horarios])

  const agregarHorario = () => {
    editarInscripcion({_id: inscripcion._id, horarios: horarios})
    cerrar()
  }

  return (
    <Modal cerrar={ cerrar }>
        <P>Horarios de asistencia de {alumne.nombre} a {taller.nombre}</P>
        {taller.horarios.map(h =>
          <FlexR>
            <P>{capitalize(h.dia)} {h.hora}</P>
            <Check checked={incluyeHorario(horarios, h)} onClick={() => toggleHorario(h)} />
          </FlexR>
        )}

        <Boton addons='ml-auto' texto='Establecer' color='emerald' onClick={agregarHorario} />
    </Modal>
  )
}