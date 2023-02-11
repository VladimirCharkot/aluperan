import { ReactNode } from 'react';

interface ListaProps{
  titulo: string,
  children: ReactNode,
  bg: string
}

export const Lista = ({ titulo, children, bg }: any) => {
  return (
    <div className={`${bg} h-screen w-full overflow-y-scroll`}>
      <h1 className="text-3xl p-4 text-rye">{titulo}</h1>
      <ul>
        {children}
      </ul>
    </div>
  );
}