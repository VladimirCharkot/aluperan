import { ChangeEventHandler } from "react"

interface SelectProps {
  onChange: ChangeEventHandler<HTMLSelectElement>,
  opts: { v: any, txt: string }[]
}

export const Select = ({onChange, opts}: SelectProps) => {

  return (
    <select className="p-2 m-2" onChange={onChange}>
      {opts.map(({v, txt}) => <option key={v} value={v}>{txt}</option>)}
    </select>
  )
}