import { MouseEventHandler } from "react"

interface CheckInterface {
  checked: boolean,
  onClick: MouseEventHandler<HTMLInputElement>
}

export const Check = ({checked, onClick}: CheckInterface) => {
  return (
    <input className="width-min" type="checkbox" readOnly
      checked={checked} onClick={onClick} />
  )
}