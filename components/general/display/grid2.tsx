import React from "react"

export const Grid2 = ({children}: {children : React.ReactNode}) => {

  return (
    <div className="grid grid-cols-2">
      {children}
    </div>
  )
}