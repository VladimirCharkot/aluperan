import { Dispatch, SetStateAction } from "react"
import { addHours } from "date-fns"

interface DatePickProps{
  fecha: Date,
  setFecha: Dispatch<SetStateAction<Date>>,
  shiftHoras?: number
}

export const DatePick = ({fecha, setFecha, shiftHoras} : DatePickProps) => {

  return (
    <input className="bg-indigo-50 p-2 rounded-xl" style={{ minHeight: '30px' }} type="date" value={fecha.toISOString().split("T")[0]} onChange={e => {
      setFecha(addHours(new Date(e.target.value), shiftHoras ?? 0))  // Ajustando locale
    }} />
  )
}