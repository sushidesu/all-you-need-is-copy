import { useCallback, useState } from "react"

export const useMultipleLoading = (): [
  Record<string, boolean>,
  (id: string, loading: boolean) => void
] => {
  const [loadings, setLoadings] = useState<Record<string, boolean>>({})

  const change = useCallback((id: string, loading: boolean) => {
    setLoadings((prev) => ({
      ...prev,
      [id]: loading,
    }))
  }, [])

  return [loadings, change]
}
