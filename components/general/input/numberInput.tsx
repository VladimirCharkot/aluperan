import { ChangeEventHandler, Dispatch, SetStateAction, useEffect, useState } from 'react';

interface NumberInputProps {
  value: number,
  update: (n: number) => void,
  setNaN: Dispatch<SetStateAction<boolean>>
}

export const NumberInput = ({ value, update, setNaN }: NumberInputProps) => {
  const [valorTexto, setValorTexto] = useState(value.toString())

  useEffect(() => {
    if (valorTexto != "") {
      const n = parseInt(valorTexto)
      if (!isNaN(n)) {
        update(n)
        setNaN(false)
      } else {
        setNaN(true)
      }
    }else{
      update(0)
    }
  }, [valorTexto])

  return (<input className="bg-transparent border-b outline-none" pattern="-?[0-9]*"
    value={valorTexto}
    onChange={e => {
      if (/-?[0-9]*/.test(e.target.value))
        setValorTexto(e.target.value)
    }}
    onKeyPress={(e) => {
      if (!/[0-9\-]/.test(e.key)) {
        e.preventDefault();
      }
    }} />)
}