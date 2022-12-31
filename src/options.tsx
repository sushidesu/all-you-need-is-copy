import React, { useState, useCallback, useMemo, useEffect } from "react"
import ReactDOM from "react-dom/client"
import type { CopyFormat } from "./feature/copy/copy-format"
import { CopyFormatRepository } from "./infra/copy/copy-format-repository"

const Options = () => {
  const copyFormatRepository = useMemo(() => new CopyFormatRepository(), [])

  const [count, setCount] = useState(0)
  const [copyFormats, setCopyFormats] = useState<CopyFormat[]>([])

  useEffect(() => {
    let unmounted = false

    const start = async () => {
      const formats = await copyFormatRepository.getAll()
      if (!unmounted) {
        setCopyFormats(formats)
      }
    }
    start()

    return () => {
      unmounted = true
    }
  }, [])

  return (
    <div>
      <ul>
        {copyFormats.map((fmt) => (
          <li key={fmt.id}>{fmt.name}</li>
        ))}
      </ul>
      <button
        onClick={useCallback(() => {
          setCount((prev) => prev + 1)
        }, [])}
      >
        {count}
      </button>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
)
