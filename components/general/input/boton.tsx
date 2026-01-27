import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, ReactNode } from "react"

interface BotonProps extends ButtonHTMLAttributes<HTMLButtonElement>  {
  texto: string,
  iconol?: ReactNode,
  iconor?: ReactNode,
  onClick: () => void,
  color: string,
  addons?: string,
  activo?: boolean
}

export const Boton = ({texto, color, onClick, addons, activo, iconol, iconor}: BotonProps) => {
  const act = activo === undefined || activo === true
  const c = act ? color : 'gray'  
  return (
<div className={cn(
        "flex items-center cursor-pointer border-4 border-t border-l px-2 py-1 m-1 rounded gap-2 w-max",
        `bg-${c}-200 hover:border-${c}-400 border-${c}-300 active:border`,
        addons
      )}onClick={() => { if (act) onClick() }}>
      {iconol}{texto}{iconor}
    </div>
  )
}

