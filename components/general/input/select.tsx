import { ChangeEventHandler } from "react"

interface SelectProps {
  onChange: ChangeEventHandler<HTMLSelectElement>,
  opts: { v: any, txt: string }[],
  conUndefined?: boolean
}

export const Select = ({onChange, opts, conUndefined}: SelectProps) => {

  return (
    <select className="p-2 m-2 bg-indigo-50 rounded-xl" onChange={onChange}>
      {conUndefined && <option key={1} value={undefined}>Seleccionar...</option>}
      {opts.map(({v, txt}) => <option key={v} value={v}>{txt}</option>)}
    </select>
  )
}