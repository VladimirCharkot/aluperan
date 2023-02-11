interface BotonProps {
  texto: string,
  onClick: () => void,
  color: string,
  addons?: string
}

export const Boton = ({texto, color, onClick, addons}: BotonProps) => {
  return (
    <div className={`${addons ?? ''} cursor-pointer bg-${color}-200 border-2 border-${color}-300 border-t-0 border-l-0 px-2 py-1 m-1 rounded w-max`}
         onClick={onClick}>
      {texto}
    </div>
  )
}

