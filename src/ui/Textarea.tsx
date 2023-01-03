import type { ForwardRefRenderFunction } from "react"
import React from "react"

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const _Textarea: ForwardRefRenderFunction<
  HTMLTextAreaElement,
  TextareaProps
> = (props, ref) => {
  return <textarea className={"textarea"} ref={ref} {...props} />
}

export const Textarea = React.forwardRef(_Textarea)
