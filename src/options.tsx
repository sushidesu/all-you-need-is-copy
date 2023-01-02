import React, { useCallback, useMemo, FormEventHandler, Suspense } from "react"
import ReactDOM from "react-dom/client"
import type { CopyFormat } from "./feature/copy/copy-format"
import { CopyFormatRepository } from "./infra/copy/copy-format-repository"
import { useInput } from "./ui/useInput"
import { CopyFormatItems } from "./feature/copy/CopyFormatItems"
import { useSyncState } from "./ui/useSyncState"
import useSWRImmutable from "swr/immutable"

const Options = () => {
  const copyFormatRepository = useMemo(() => new CopyFormatRepository(), [])

  const { data } = useSWRImmutable(
    { key: "copyFormats" },
    () => {
      console.log("fetch")
      return copyFormatRepository.getAll()
    },
    {
      suspense: true,
    }
  )
  const copyFormats = data as CopyFormat[]

  const [clone, setClone] = useSyncState(copyFormats)
  const [name, changeName, resetName] = useInput()
  const [format, changeFormat, resetFormat] = useInput()

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
    (id: string) => React.ChangeEventHandler<HTMLParagraphElement>
  >(
    (id) => async (e) => {
      console.log("updateName", id, e.target.innerText)
    },
    []
  )

  const handleUpdateFormat = useCallback<
    (id: string) => React.ChangeEventHandler<HTMLTextAreaElement>
  >(
    (id) => async (e) => {
      setClone((list) => {
        const next = [...list]

        const targetIndex = next.findIndex((v) => v.id === id)
        const target = next[targetIndex]
        if (target === undefined) return next

        target.format = e.target.value
        return next
      })
      console.log("updateFormat", id, e.target.innerText)
    },
    [setClone]
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
          copyFormatItems={clone}
          onChangeName={handleUpdateName}
          onChangeFormat={handleUpdateFormat}
        />
      </div>
    </div>
  )
}

const OptionsPage = () => {
  return (
    <div>
      <Suspense fallback={<div>loading...</div>}>
        <Options />
      </Suspense>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <OptionsPage />
  </React.StrictMode>
)
