import { ChangeEventHandler, useContext, useEffect, useState } from "react";
import { capitalize } from "lodash";

import { Modal } from "../display/modal";
import { P } from "../display/p";
import { PError } from "../display/perror";

import { Boton } from "../input/boton";
import { TextInput } from "../input/textInput";
import { NumberInput } from "../input/numberInput";
import { Select } from "../input/select";

import { MedioDePago, MovimientoPost } from "../../../lib/api";
import { useBackend } from "../../context/backend";

export type Handler = ChangeEventHandler<HTMLSelectElement>

const medios: MedioDePago[] = ['efectivo', 'mercadopago', 'otro']

export const ModalMovimiento = ({ cerrar }: any) => {

  const { crearMovimiento } = useBackend()

  const [movimiento, setMovimiento] = useState<MovimientoPost>({
    monto: 0,
    medio: 'efectivo',
    fecha: new Date(),
    detalle: "",
    razon: "otra"
  })

  const [numberIsNaN, setNaN] = useState(false)

  const updateMonto = (m: number) => setMovimiento(mov => ({...mov, monto: m}))
  const updateMedio = (m: MedioDePago) => setMovimiento(mov => ({...mov, medio: m}))
  const updateDetalle = (d: string) => setMovimiento(mov => ({...mov, detalle: d}))

  const valido = !!movimiento.monto && !!movimiento.detalle && !!movimiento.medio && !numberIsNaN
  const opts_medios = medios.map(m => ({v: m, txt: capitalize(m)}))

  const postMovimiento = () => { crearMovimiento(movimiento).then(cerrar) } 

  return (
    <Modal cerrar={ cerrar }>

        <P>Monto:</P>
        <p className='text-xs pb-4'>(positivo es entrada, negativo es salida)</p>
        <NumberInput value={movimiento.monto} update={updateMonto} setNaN={setNaN} />

        <P>Medio:</P> 
        <Select onChange={e => updateMedio(e.target.value as MedioDePago)} opts={opts_medios}/>

        <P>Detalle:</P>
        <TextInput value={movimiento.detalle} onChange={(e) => updateDetalle(e.target.value)} />

        <Boton addons='ml-auto' texto='Agregar' color='emerald' activo={valido} onClick={postMovimiento} />

        {numberIsNaN && <PError>El monto es incorrecto</PError>}
    </Modal>
  )
}