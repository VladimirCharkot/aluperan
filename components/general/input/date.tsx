import { Dispatch, SetStateAction } from "react"
import { addHours } from "date-fns"

interface DatePickProps{
  fecha: Date,
  setFecha: Dispatch<SetStateAction<Date>>
}

export const DatePick = ({fecha, setFecha} : DatePickProps) => {

  return (
    <input style={{ minHeight: '30px' }} type="date" value={fecha.toISOString().split("T")[0]} onChange={e => {
      setFecha(addHours(new Date(e.target.value), 3))  // Ajustando locale
    }} />
  )
}