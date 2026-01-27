import { capitalize, sortBy } from 'lodash'
import { Movimiento } from '../../lib/api'
import { cn, format_curr, nombres_meses } from '../../lib/utils'
import { Boton } from '../general/input/boton'
import { useBackend } from '../context/backend'
import { DialogoConfirmacion } from '../ui/confirmacion'
import { Icon } from '@iconify/react'

export interface CartaBalanceProps {
  movimientos: Movimiento[]
}

const B = ({ children }: any) => <span className="font-bold text-orange-800">{children}</span>

export const CartaBalance = ({ movimientos }: CartaBalanceProps) => {
  const { eliminarMovimiento, lkpAlumne, lkpTaller } = useBackend()

  return (
    <div className={`grid grid-cols-[120px_120px_140px_140px_1fr] p-2 m-2 gap-x-2`}>
      <span className="text-xl">Fecha</span>
      <span className="text-xl">Medio</span>
      <span className="text-xl text-right">Movimiento</span>
      <span className="text-xl text-right">Balance</span>
      <div className="text-xl pl-6">Detalle</div>

      {sortBy(movimientos, (m) => m.fecha).map((m, i) => {
        const className = cn(m.medio == '-' && 'text-gray-300 text-sm')
        return (
          <>
            <div className={className}>{new Date(m.fecha).toLocaleDateString('es-ES')}</div>
            <div className={className}>{capitalize(m.medio)}</div>
            <div
              className={cn(className, 'text-right', m.monto > 0 && 'text-green-800', m.monto < 0 && 'text-orange-800')}
            >
              {format_curr(m.monto)}
            </div>
            <div className={cn(className, 'text-right')}>
              {format_curr(movimientos.slice(0, i + 1).reduce((total, m) => total + m.monto, 0))}
            </div>

            <div
              className={cn(
                className,
                'group flex gap-2 items-center hover:bg-amber-200 transition-colors duration-800'
              )}
            >
              <DialogoConfirmacion
                texto={
                  <>
                    <B>Atenti!</B> Estás a punto de borrar el movimiento{' '}
                    {m.razon == 'clase suelta' && (
                      <>
                        de <B>una clase suelta</B> de <B>{lkpTaller(m.taller).nombre}</B> que tomó
                        <B>{lkpAlumne(m.alumne).nombre}</B> en <B>{nombres_meses[m.ocasion.getMonth()]}</B>
                      </>
                    )}
                    {m.razon == 'inscripcion' && (
                      <>
                        <B>de la inscripción mensual</B> de <B>{nombres_meses[m.mes.getMonth()]}</B> de{' '}
                        <B>{lkpAlumne(m.alumne).nombre}</B> a <B>{lkpTaller(m.taller).nombre}</B>
                      </>
                    )}
                    {m.razon == 'otra' && <B>{m.detalle}</B>}
                    {m.razon == 'liquidacion profe' && (
                      <>
                        de la liquidación de <B>{nombres_meses[m.mes.getMonth()]}</B> de{' '}
                        <B>{lkpTaller(m.taller).nombre}</B> (de <B>{lkpTaller(m.taller).profe}</B>)
                      </>
                    )}
                    . Esta acción no se puede deshacer. ¿Querés continuar?
                  </>
                }
                onConfirmar={() => {
                  eliminarMovimiento(m)
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
              <p className="text-sm">{m.detalle}</p>
            </div>
          </>
        )
      })}
    </div>
  )
}
