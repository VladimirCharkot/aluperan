interface EnumeradorProps {
  cabecera: string,
  coleccion: any[],
  accesor?: (i: any) => string,
  nodata: string
}

export const Enumerador = ({ cabecera, coleccion, accesor, nodata }: EnumeradorProps) => {
  return (
    <>
      {coleccion.length > 0 && (
        <ul className="p-2 bg-pink flex flex-row items-center">
          <p>{cabecera}</p>
          {coleccion.map((i, idx) => <li
            className='rounded border-slate-300 border-t-0 border-l-0 border-r-0 px-1 mx-2 border-2'
            key={idx}>{accesor ? accesor(i) : i}</li>)}
        </ul>)}

      {coleccion.length == 0 && (<p className="p-2">{nodata}</p>)}
    </>
  )
}