import { cn } from "@/lib/utils"

interface EnumeradorProps<T> {
  cabecera: string,
  coleccion: T[],
  nodata: string,
  accesor?: (i: T) => string,
  decorador?: (i: T) => string,
  vertical?: boolean
}

export const Enumerador = <T,>({ cabecera, coleccion, accesor, nodata, decorador, vertical = false }: EnumeradorProps<T>) => {
  return (
    <>
      {coleccion.length > 0 && (
        <ul className={cn("p-4 ml-6 border-2 border-emerald-100 m-2 rounded-xl flex", !vertical && "flex-row flex-wrap items-center", vertical && "flex-col items-start")}>
          <p className="font-bold text-2xl">{cabecera}</p>
          {coleccion.map((i, idx) => <li
            className={cn(
              'border-slate-300 rounded border-b-2 border-dashed p-1 px-2 mx-2 m-2',
              decorador && decorador(i)
            )}
            key={idx}>{accesor ? accesor(i) : i as string}</li>)}
        </ul>)}

      {coleccion.length == 0 && (<p className="p-2">{nodata}</p>)}
    </>
  )
}