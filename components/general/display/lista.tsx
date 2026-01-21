import { ReactNode } from 'react';

interface ListaProps{
  titulo: string,
  children: ReactNode,
  bg: string
}

export const Lista = ({ titulo, children, bg }: ListaProps) => {
  return (
    <div className={`${bg} h-screen w-full overflow-y-scroll`}>
      <h1 className="text-3xl p-10 text-center md:text-6xl text-rye">{titulo}</h1>
      <ul>
        {children}
      </ul>
    </div>
  );
}