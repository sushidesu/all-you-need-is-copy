import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  FormEventHandler,
  FocusEventHandler,
} from "react"
import ReactDOM from "react-dom/client"
import type { CopyFormat } from "./feature/copy/copy-format"
import { CopyFormatRepository } from "./infra/copy/copy-format-repository"
import { useInput } from "./ui/useInput"
import { CopyFormatItems } from "./feature/copy/CopyFormatItems"

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

  const handleUpdateName = useCallback<
    (id: string) => FocusEventHandler<HTMLParagraphElement>
  >(
    (id) => async (e) => {
      console.log("updateName", id, e.target.innerText)
    },
    []
  )

  const handleUpdateFormat = useCallback<
    (id: string) => FocusEventHandler<HTMLParagraphElement>
  >(
    (id) => async (e) => () => {
      console.log("updateFormat", id, e.target.innerText)
    },
    []
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
        <CopyFormatItems
          copyFormatItems={copyFormats}
          onUpdateName={handleUpdateName}
          onUpdateFormat={handleUpdateFormat}
        />
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
)
