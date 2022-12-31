import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  FormEventHandler,
} from "react"
import ReactDOM from "react-dom/client"
import type { CopyFormat } from "./feature/copy/copy-format"
import { CopyFormatRepository } from "./infra/copy/copy-format-repository"
import { useInput } from "./ui/useInput"

const Options = () => {
  const copyFormatRepository = useMemo(() => new CopyFormatRepository(), [])

  const [copyFormats, setCopyFormats] = useState<CopyFormat[]>([])
  const [name, changeName, resetName] = useInput()
  const [format, changeFormat, resetFormat] = useInput()

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
  }, [copyFormatRepository, setCopyFormats])

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async (e) => {
      e.preventDefault()
      await copyFormatRepository.push({
        name,
        format,
      })
      resetName()
      resetFormat()
    },
    [copyFormatRepository, resetName, resetFormat]
  )

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>name</label>
            <input value={name} onChange={changeName} />
          </div>
          <div>
            <label>format</label>
            <input value={format} onChange={changeFormat} />
          </div>
          <button type={"submit"}>register</button>
        </form>
      </div>
      <div>
        <ul>
          {copyFormats.map((fmt) => (
            <li key={fmt.id}>{fmt.name}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
)
