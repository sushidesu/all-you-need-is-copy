import { useState, useCallback, ChangeEventHandler } from "react"

export const useInput = (): [
  string,
  ChangeEventHandler<HTMLInputElement>,
  () => void
] => {
  const [text, setText] = useState("")

  const change = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
    setText(e.target.value)
  }, [])
  const reset = useCallback(() => {
    setText("")
  }, [])

  return [text, change, reset]
}
