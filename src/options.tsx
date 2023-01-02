import React, { useCallback, useMemo, Suspense } from "react"
import ReactDOM from "react-dom/client"
import type { CopyFormat } from "./feature/copy/copy-format"
import { CopyFormatRepository } from "./infra/copy/copy-format-repository"
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
    <div className={"sections container"}>
      <h1>Copy Format List</h1>
      <div className={"section"}>
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
    <div className={"layout"}>
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
