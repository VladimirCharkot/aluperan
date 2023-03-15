import { createContext, Dispatch, SetStateAction } from "react";
import { Alumne, Asistencia, Inscripcion, Movimiento, Taller } from "../../lib/api";

interface AppContextInterface{
  alumnes: Alumne[],
  setAlumnes: Dispatch<SetStateAction<Alumne[]>>,
  inscripciones: Inscripcion[],
  setInscripciones: Dispatch<SetStateAction<Inscripcion[]>>,
  movimientos: Movimiento[],
  setMovimientos: Dispatch<SetStateAction<Movimiento[]>>,
  talleres: Taller[],
  setTalleres: Dispatch<SetStateAction<Taller[]>>,
  asistencias: Asistencia[],
  setAsistencias: Dispatch<SetStateAction<Asistencia[]>>
}

export const AppContext = createContext<AppContextInterface>({
  alumnes: [],
  inscripciones: [],
  movimientos: [],
  talleres: [],
  asistencias: [],
  setAlumnes: () => {},
  setInscripciones: () => {},
  setMovimientos: () => {},
  setTalleres: () => {},
  setAsistencias: () => {}
})