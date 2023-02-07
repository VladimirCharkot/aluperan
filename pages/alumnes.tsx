import { get_alumnes } from "../lib/alumnes";
import { AlumneType } from "../lib/alumnes";
import { InscripcionType } from "../lib/inscripciones";

const serialize = (obj: any[]) => JSON.parse(JSON.stringify(obj))

interface AlumnesProps {
  alumnes: AlumneType[]
}

export async function getServerSideProps() {
  return { props: { alumnes: serialize(await get_alumnes()) } }
}

export default function Alumnes({ alumnes }: AlumnesProps) {
  return (
    <div className="h-screen tateti w-full overflow-y-scroll">
      <h1 className="text-3xl p-4 text-rye">Alumnes</h1>
      <ul>
        {alumnes.map((a) => (
          <Alumne key={a._id} alumne={a} />
        ))}
      </ul>
    </div>
  );
}

interface AlumneProps {
  alumne: AlumneType
}

const Alumne = ({ alumne }: AlumneProps) => {
  console.log(alumne)
  return (
    <li className="alumne p-8 bg-white/50 rounded-md m-6 
                   border">
      <h2 className="text-2xl">{alumne.nombre}</h2>
      <hr />
      {alumne.inscripciones.length > 0 && (
        <ul className="p-2 bg-pink flex flex-row items-center">
          <p>Inscripciones:</p>
          {alumne.inscripciones.map((i) => <li 
            className='rounded bg-pink-200 border-pink-300 px-1 mx-2 border-2 cursor-pointer border-t-0 border-l-0' 
            key={i._id}>{i.titulo}</li>)}
        </ul>)}
      {alumne.inscripciones.length == 0 && (<p>Sin inscripciones</p>)}
    </li>
  )
}