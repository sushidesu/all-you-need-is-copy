import { Dispatch, SetStateAction, useEffect, useMemo,useState } from "react"

export const useSyncState = <T>(state: T): [T, Dispatch<SetStateAction<T>>] => {
  const [clone, setClone] = useState(state)

  useEffect(() => {
    console.log("clone")
    setClone(state)
  }, [state])

  return useMemo(() => [clone, setClone], [clone])
}
