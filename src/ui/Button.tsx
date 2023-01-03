import React from "react"
import { forwardRef,ForwardRefRenderFunction } from "react"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const _Button: ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  props,
  ref
) => {
  return <button className={"button"} {...props} ref={ref} />
}

export const Button = forwardRef(_Button)
