interface EnumeradorProps {
  cabecera: string,
  coleccion: any[],
  nodata: string,
  accesor?: (i: any) => string,
  decorador?: (i: any) => string
}

export const Enumerador = ({ cabecera, coleccion, accesor, nodata, decorador }: EnumeradorProps) => {
  return (
    <>
      <div className="invisible border-red-300 border-emerald-300"/>
      {coleccion.length > 0 && (
        <ul className="p-2 bg-pink flex flex-row flex-wrap items-center">
          <p>{cabecera}</p>
          {coleccion.map((i, idx) => <li
            className={(decorador !== undefined ? decorador(i) : 'border-slate-300 ') + 
            ' rounded border-t-0 border-l-0 border-r-0 px-1 mx-2 border-2 m-2 ' }
            key={idx}>{accesor ? accesor(i) : i}</li>)}
        </ul>)}

      {coleccion.length == 0 && (<p className="p-2">{nodata}</p>)}
    </>
  )
}