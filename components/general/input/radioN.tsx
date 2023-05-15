export const Radio = ({ n, state, setN }: any) => {
  const seleccionado = n == state - 1
  return <div className={`${seleccionado ? 'bg-emerald-300' : ''} py-1 px-3 border`}
    onClick={() => {
      if (seleccionado) setN(null)
      else setN(n + 1)
    }}>{n + 1}</div>
}