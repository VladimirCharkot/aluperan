import { ChangeEventHandler, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Modal } from "./modal";
import { Boton } from "./boton";
import { MedioDePago, Movimiento, RazonMovimiento } from "../../lib/api";
import { TextInput } from "./textInput";
import { NumberInput } from "./numberInput";
import { capitalize } from "lodash";
import axios from "axios";
import { AppContext } from "../context";

export type Handler = ChangeEventHandler<HTMLSelectElement>

const medios: MedioDePago[] = ['efectivo', 'mercadopago', 'otro']

export const ModalMovimiento = ({ cerrar }: any) => {

  const { setMovimientos } = useContext(AppContext)

  const [movimiento, setMovimiento] = useState<Movimiento>({
    monto: 0,
    medio: 'efectivo',
    fecha: new Date(),
    detalle: "",
    razon: "otra"
  })

  useEffect(() =>  { console.log(movimiento)} , [movimiento])

  const [numberIsNaN, setNaN] = useState(false)

  const updateMonto = (m: number) => setMovimiento(mov => ({...mov, monto: m}))
  const updateMedio = (m: MedioDePago) => setMovimiento(mov => ({...mov, medio: m}))
  // const updateRazon = (r: RazonMovimiento) => setMovimiento(mov => ({...mov, razon: r}))
  const updateDetalle = (d: string) => setMovimiento(mov => ({...mov, detalle: d}))

  const legal = movimiento.monto && movimiento.detalle && movimiento.medio && !numberIsNaN

  const agregarMovimiento = () => {
    if (legal){
      console.log(`Enviando movimiento`)
      console.log(movimiento)
      axios.post('/api/movimientos', movimiento).then(r => {
        setMovimientos(ms => [...ms, movimiento]) 
        cerrar()
      })
    }
  }

  return (
    <Modal>
      <div className='p-8 bg-white rounded-md m-6 border relative flex flex-col z-20'>

        <p className='absolute top-0 right-0 text-2xl m-5 cursor-pointer' onClick={cerrar}>X</p>

        <p className='p-4 pb-0'>Monto:</p>
        <p className='text-xs pb-4'>(positivo es entrada, negativo es salida)</p>
        <NumberInput value={movimiento.monto} update={updateMonto} setNaN={setNaN} />

        <p className='p-4'>Medio:</p> 
        <select className='p-4' onChange={e => updateMedio(e.target.value as MedioDePago)}>
          {medios.map(m => <option key={m} value={m}>{capitalize(m)}</option>)}
        </select>

        <p className='p-4'>Detalle:</p>
        <TextInput value={movimiento.detalle} onChange={(e) => updateDetalle(e.target.value)} />

        <Boton addons='ml-auto' texto='Agregar' color={legal ? 'emerald' : 'grey'} onClick={agregarMovimiento} />

        {numberIsNaN && <p className="text-xs text-red-400">El monto es incorrecto</p>}
      </div>
    </Modal>
  )
}