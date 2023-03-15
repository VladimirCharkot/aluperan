interface ModalProps{
  children: React.ReactNode,
  cerrar: () => void
} 

export const Modal = ({ children, cerrar }: ModalProps) => {
  return (
    <div className="absolute w-screen h-screen top-0 left-0 z-10 flex items-center justify-center bg-black/40"
      // onClick={cerrar}>
      >
      <div className='p-8 bg-white rounded-md m-6 border relative flex flex-col z-20 max-w-lg max-h-full overflow-y-scroll'>
        <p className='absolute top-0 right-0 text-xl m-5 cursor-pointer' onClick={cerrar}>X</p>
        {children}
      </div>
    </div>
  )
}