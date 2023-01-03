import { clsx } from "clsx"
import React from "react"
import { forwardRef, ForwardRefRenderFunction } from "react"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: boolean
  withIcon?: boolean
}

const _Button: ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  { icon, withIcon, ...props },
  ref
) => {
  return (
    <button
      className={clsx("button", icon && "icon", withIcon && "withIcon")}
      {...props}
      ref={ref}
    />
  )
}

export const Button = forwardRef(_Button)
