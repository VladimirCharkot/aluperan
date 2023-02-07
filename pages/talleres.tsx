import { get_talleres } from "../lib/talleres";
import { TallerType } from "../lib/talleres";

const serialize = (obj: any[]) => JSON.parse(JSON.stringify(obj))

interface TalleresProps {
  talleres: TallerType[]
}

export async function getServerSideProps() {
  return { props: { talleres: serialize(await get_talleres()) } }
}

export default function Talleres({ talleres }: TalleresProps) {
  return (
    <div className="h-screen burbujas w-full overflow-y-scroll">
      <h1 className="text-3xl p-4 text-rye">Talleres</h1>
      <ul>
        {talleres.map((a) => (
          <Taller key={a._id} taller={a} />
        ))}
      </ul>
    </div>
  );
}

interface TallerProps {
  taller: TallerType
}

const dias = {
  'lun': 'Lunes',
  'mar': 'Martes',
  'mie': 'Miércoles',
  'jue': 'Jueves',
  'vie': 'Viernes',
  'sab': 'Sábado',
  'dom': 'Domingo'
}

const Taller = ({ taller }: TallerProps) => {

  return (
    <li className="taller p-8 bg-white/50 rounded-md m-6 
                   border">
      <h2 className="text-2xl">{taller.nombre} - {taller.profe}</h2>
      <hr />

      {taller.dias.length > 0 && (
        <ul className="p-2 bg-pink flex flex-row items-center">
          <p>Horarios:</p>
          {taller.dias.map(d => <li
            className='rounded bg-pink-200 border-pink-300 px-1 mx-2 border-2 cursor-pointer'>{dias[d]}</li>)}
        </ul>)}
      {taller.dias.length == 0 && (<p className="p-2">Sin horarios</p>)}

      {taller.precios.length > 0 && (
        <ul className="p-2 bg-pink flex flex-row items-center">
          <p>Precios:</p>
          {taller.precios.map((c, i) => <li
            className='rounded bg-pink-200 border-pink-300 px-1 mx-2 border-2 cursor-pointer'>{`${i} días: $${c}`}</li>)
            .slice(1)}
        </ul>)}
      {taller.precios.length == 0 && (<p className="p-2">Sin precios</p>)}

      {taller.inscripciones && taller.inscripciones.length > 0 && (
        <ul className="p-2 bg-pink flex flex-row items-center">
          <p>Alumnes:</p>
          {taller.inscripciones.filter(t => t.alumne).map(i => <li
            className='rounded bg-pink-200 border-pink-300 px-1 mx-2 border-2 cursor-pointer'>{i.alumne}</li>)}
        </ul>
      )}
      {taller.inscripciones == undefined || taller.inscripciones.length == 0 && (<p className="p-2">Sin inscripciones</p>)}
    </li>
  )
}