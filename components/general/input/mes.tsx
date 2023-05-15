import { Dispatch, SetStateAction } from "react"
import { FlexR } from "../display/flexR"
import { nombres_meses } from "../../../lib/utils"
import { addMonths } from "date-fns"
import { capitalize } from "lodash"

interface MesSelectorProps{
  mes: Date,
  setMes: Dispatch<SetStateAction<Date>>
}

export const MesSelector = ({ mes, setMes } : MesSelectorProps) => {
  const mesN = mes.getMonth()

  return <FlexR>
    <div className="cursor-pointer" onClick={() => setMes(addMonths(mes, -1))}>&lt;</div>
    <p className="w-20 text-center">{capitalize(nombres_meses[mesN])}</p>
    <div className="cursor-pointer" onClick={() => setMes(addMonths(mes, 1))}>&gt;</div>
  </FlexR>
}