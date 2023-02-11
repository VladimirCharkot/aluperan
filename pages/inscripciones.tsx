import { get_inscripciones, PagoType, TarifaType } from "../lib/inscripciones";
import { InscripcionType } from "../lib/inscripciones";
import { last, sum, range, findLast, concat, sortBy } from 'lodash';
import { addMonths, differenceInMonths, getMonth, isBefore } from 'date-fns';
import { Balance, format_curr } from "./movimientos";
import { RazonType } from '../lib/movimientos';

const serialize = (obj: any[]) => JSON.parse(JSON.stringify(obj))

interface MovimientoType {
  monto: number,
  fecha: Date,
  razon: RazonType
}

const nombres_meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

const balance_inscripcion = (inscripcion: InscripcionType) => {
  const t0 = new Date(inscripcion.iniciada)
  const meses = differenceInMonths(new Date(), t0)

  const tarifas_cobradas: MovimientoType[] = range(meses).map(m => {
    const tarifa_correspondiente = findLast(inscripcion.tarifas, t => isBefore(new Date(t.iniciada), addMonths(t0, m)))?.monto ?? 0;
    return {
      monto: -tarifa_correspondiente,
      fecha: addMonths(t0, m),
      razon: 'inscripcion',
      detalle: 'Tarifa ' + nombres_meses[getMonth(addMonths(t0, m))]
    }
  })
  const pagos_efectuados: MovimientoType[] = inscripcion.pagos?.map(p => ({
    monto: p.monto,
    fecha: new Date(p.fecha),
    razon: 'inscripcion',
    detalle: `Pago ${nombres_meses[getMonth(new Date(p.fecha))]}`
  })) ?? []

  const movimientos = sortBy(concat(tarifas_cobradas, pagos_efectuados), 'fecha')

  return movimientos
}

export async function getServerSideProps() {
  return { props: { inscripcion: serialize(await get_inscripciones()) } }
}





interface InscripcionesProps {
  inscripcion: InscripcionType[]
}

export default function Inscripciones({ inscripcion }: InscripcionesProps) {
  return (
    <div className="h-screen cruces w-full overflow-y-scroll">
      <h1 className="text-3xl p-4 text-rye">Inscripciones</h1>
      <ul>
        {inscripcion.map((a) => (
          <Inscripcion key={a._id} inscripcion={a} />
        ))}
      </ul>
    </div>
  );
}

interface InscripcionProps {
  inscripcion: InscripcionType
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

const Inscripcion = ({ inscripcion }: InscripcionProps) => {

  const movimientos = balance_inscripcion(inscripcion);

  return (
    <li className="inscripcion p-8 bg-white/50 rounded-md m-6 
                   border">
      <h2 className="text-2xl">{`${inscripcion.alumne.nombre} - ${inscripcion.titulo}`}</h2>
      <hr />

      <p className="px-2">{`Iniciada: ${new Date(inscripcion.iniciada).toLocaleDateString()}`}</p>
      <p className="px-2">{`Tarifa vigente: $${last(inscripcion.tarifas)?.monto ?? '?!'}`}</p>

      {inscripcion.pagos && <>
        <p className="px-2">{`Balance: ${format_curr(movimientos.reduce((total, m) => total + m.monto, 0))}`}</p>
        <Balance movimientos={movimientos} />
      </>}

      <p className="text-xs">{inscripcion._id}</p>
    </li>
  )
}



