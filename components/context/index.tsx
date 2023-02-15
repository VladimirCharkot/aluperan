import { createContext, Dispatch, SetStateAction } from "react";
import { Alumne, Inscripcion, Movimiento, Taller } from "../../lib/api";

interface AppContextInterface{
  alumnes: Alumne[],
  setAlumnes: Dispatch<SetStateAction<Alumne[]>>,
  inscripciones: Inscripcion[],
  setInscripciones: Dispatch<SetStateAction<Inscripcion[]>>,
  movimientos: Movimiento[],
  setMovimientos: Dispatch<SetStateAction<Movimiento[]>>,
  talleres: Taller[],
  setTalleres: Dispatch<SetStateAction<Taller[]>>
}

export const AppContext = createContext<AppContextInterface>({
  alumnes: [],
  inscripciones: [],
  movimientos: [],
  talleres: [],
  setAlumnes: () => {},
  setInscripciones: () => {},
  setMovimientos: () => {},
  setTalleres: () => {}
})