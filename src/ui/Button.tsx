import React from "react"
import { forwardRef, ForwardRefRenderFunction } from "react"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: boolean
}

const _Button: ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  { icon, ...props },
  ref
) => {
  return (
    <button className={`button ${icon ? "icon" : ""}`} {...props} ref={ref} />
  )
}

export const Button = forwardRef(_Button)
