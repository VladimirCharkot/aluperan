interface StatusProps{
  activo: boolean
}

export const Status = ({activo}: StatusProps) => <svg className="inline w-5 h-5" viewBox="-5 -3 10 10">
  <circle r={3} className={activo ? 'fill-emerald-300' : 'fill-red-300'}></circle>
</svg>