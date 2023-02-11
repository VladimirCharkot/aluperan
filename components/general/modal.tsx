export const Modal = ({children, cerrar} : any) => {
  return (
    <div className="absolute w-screen h-screen top-0 left-0 z-10 flex items-center justify-center bg-black/40"
         onClick={cerrar}>
      {children}
    </div>
  )
}