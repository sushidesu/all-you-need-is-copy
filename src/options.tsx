import React, { useCallback, useMemo, Suspense, useState } from "react"
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

  const [loading, setLoading] = useState(false)

  const handleBlurFormat = useCallback<(id: string) => () => void>(
    (id) => async () => {
      setLoading(true)

      const original = copyFormats.find((f) => f.id === id)
      const target = clone.find((f) => f.id === id)
      if (original === undefined || target === undefined) return
      await copyFormatRepository.update(id, {
        ...original,
        format: target.format,
      })

      setTimeout(() => {
        setLoading(false)
      }, 1000)
    },
    [copyFormatRepository]
  )

  return (
    <div className={"sections container"}>
      <h1>Copy Format List</h1>
      <div className={"section"}>
        <CopyFormatItems
          copyFormatItems={clone}
          onChangeName={handleUpdateName}
          onChangeFormat={handleUpdateFormat}
          onBlurFormat={handleBlurFormat}
        />
      </div>
      {loading && <div className={"alert"}>saving...</div>}
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
