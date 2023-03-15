interface FlexRProps{
  children: React.ReactNode,
  justify?: string,
  key?: any
}

export const FlexR = ({ children, justify, key }: FlexRProps) => {
  return (
    <div key={key} className={"flex flex-row items-center " + (justify ? `justify-${justify}` : "")}>
      {children}
    </div>
  )
}