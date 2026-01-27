import { useState } from 'react'
import { Alumne } from '../../lib/api'
import { useBackend } from '../context/backend'
import { P } from '../general/display/p'
import { Boton } from '../general/input/boton'
import { ModalNuevoPagoAlumne } from '../general/modales/modalNuevoPagoAlumne'
import { Icon } from '@iconify/react'
import { cn, nombres_meses } from '@/lib/utils'
import { DialogoConfirmacion } from '../ui/confirmacion'

interface PagosAlumneProps {
  alumne: Alumne
}

export const PagosAlumne = ({ alumne }: PagosAlumneProps) => {
  const { lkpPagosAlumne, eliminarMovimiento } = useBackend()
  const [ingresandoPago, setIngresandoPago] = useState(false)
  const pagos = lkpPagosAlumne(alumne)
  return (
    <>
      {ingresandoPago && <ModalNuevoPagoAlumne alumne={alumne} cerrar={() => setIngresandoPago(false)} />}
      <div className="grid my-4 gap-y-1" style={{ gridTemplateColumns: '16px repeat(3, 1fr) 6fr' }}>
        <p></p>
        <P>Pago</P>
        <P>Medio</P>
        <P>Fecha</P>
        <P>Detalle</P>
        {[
          pagos.map((p) => (
            <>
              <p className="text-sm">{p.razon == 'clase suelta' ? '+' : '✓'}</p>
              <p className="text-sm">${p.monto}</p>
              <p className="text-sm">{p.medio}</p>
              <p className="text-sm">{p.fecha.toLocaleDateString('es-ES')}</p>
              <div className="group flex gap-2 items-center hover:bg-amber-200 transition-colors duration-800">
                <DialogoConfirmacion
                  texto={
                    <span>
                      <span className="text-orange-800 font-bold">Atenti!</span> Estás a punto de borrar el pago{' '}
                      {p.razon == 'clase suelta' && (
                        <>
                          de <strong className="text-orange-800">una clase suelta</strong> de{' '}
                          <strong className="text-orange-800">{nombres_meses[p.ocasion.getMonth()]}</strong>
                        </>
                      )}
                      {p.razon == 'inscripcion' && (
                        <>
                          <strong className="text-orange-800">de la inscripción mensual</strong> de{' '}
                          <strong className="text-orange-800">{nombres_meses[p.mes.getMonth()]}</strong>
                        </>
                      )}{' '}
                      de <strong className="text-orange-800">{alumne.nombre}</strong>. Esta acción no se puede deshacer.
                      ¿Querés continuar?
                    </span>
                  }
                  onConfirmar={() => {
                    eliminarMovimiento(p)
                  }}
                >
                  <Icon
                    icon="material-symbols:delete"
                    className={cn(
                      'cursor-pointer',
                      'text-transparent group-hover:text-orange-700',
                      'transition-colors duration-800'
                    )}
                  />
                </DialogoConfirmacion>
                <p className="text-sm">{p.detalle}</p>
              </div>
            </>
          )),
        ]}
      </div>
      <Boton
        texto="Ingresar Pago"
        color="emerald"
        onClick={() => {
          setIngresandoPago(true)
        }}
      />
    </>
  )
}
