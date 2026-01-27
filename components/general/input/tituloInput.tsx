import { cn } from "@/lib/utils"
import { ChangeEventHandler } from "react"

interface TituloInputProps{ txt: string, className?:string, handler: ChangeEventHandler<HTMLInputElement> }
export const TituloInput = ({txt, handler, className} : TituloInputProps) => 
  <input className={cn(`text-xl border-b`, className)} value={txt} onChange={handler} />