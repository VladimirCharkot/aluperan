interface BotonProps {
  texto: string,
  onClick: () => void,
  color: string,
  addons?: string,
  activo?: boolean
}

export const Boton = ({texto, color, onClick, addons, activo}: BotonProps) => {
  const act = activo === undefined || activo === true
  const c = act ? color : 'gray'  
  return (
    <div className={`cursor-pointer bg-${c}-200 hover:border-${c}-400 border-2 border-${c}-300 active:border border-t-0 border-l-0 px-2 py-1 m-1 rounded w-max ${addons ?? ''}`}
         onClick={() => { if (act) onClick() }}>
      {texto}
    </div>
  )
}

