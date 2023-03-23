import { ChangeEventHandler } from "react"

interface TituloInputProps{ txt: string, handler: ChangeEventHandler<HTMLInputElement> }
export const TituloInput = ({txt, handler} : TituloInputProps) => 
  <input className="text-2xl bg-transparent border-b outline-none" value={txt} onChange={handler} />