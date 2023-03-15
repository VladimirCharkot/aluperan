interface CartaProps {
  children: any,
}

export const Carta = ({ children  }: CartaProps) => {
  return (
    <li className="alumne p-8 bg-white/80 rounded-md m-6 border ">
     {children}
    </li>
  )
}
