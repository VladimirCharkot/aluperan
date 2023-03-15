interface IdProps{
  id: string
}

export const Id = ({id}: IdProps) => {
  return (
    <p className="text-xs">{id}</p>
  )
}