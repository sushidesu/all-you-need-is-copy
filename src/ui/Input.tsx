import React, { forwardRef, ForwardRefRenderFunction } from "react"

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const _Input: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  props,
  ref
) => {
  return <input className={"input"} ref={ref} {...props} />
}

export const Input = forwardRef(_Input)
