import React, {
  ChangeEventHandler,
  FocusEventHandler,
  MouseEventHandler,
  Suspense,
  useCallback,
  useMemo,
  useState,
} from "react"
import useSWRImmutable from "swr/immutable"

import type { Message } from "../feature/chrome/message"
import type { CopyFormat } from "../feature/copy/copy-format"
import { CopyFormatItems } from "../feature/copy/CopyFormatItems"
import { CopyFormatRepository } from "../infra/copy/copy-format-repository"
import Logo from "../svg/logo.svg"
import { useSyncState } from "../ui/useSyncState"

const Options = () => {
  const copyFormatRepository = useMemo(() => new CopyFormatRepository(), [])

  const { data, mutate: mutateCopyFormats } = useSWRImmutable(
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

  const handleBlurName = useCallback<
    (id: string) => React.FormEventHandler<HTMLInputElement>
  >(
    (id) => async (e) => {
      setLoading(true)

      const original = copyFormats.find((f) => f.id === id)
      if (original === undefined) return

      const newName = e.currentTarget.value
      await copyFormatRepository.update(id, {
        ...original,
        name: newName,
      })
      const updateNameMessage: Message = {
        type: "updateName",
        id,
        name: newName,
      }
      await chrome.runtime.sendMessage(updateNameMessage)

      setTimeout(() => {
        setLoading(false)
      }, 1000)
    },
    [copyFormats, copyFormatRepository]
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
    [copyFormats, copyFormatRepository, clone]
  )

  const handleClickAdd = useCallback<
    React.MouseEventHandler<HTMLButtonElement>
  >(async () => {
    setLoading(true)

    const name = "no title"
    const format = ""
    const id = await copyFormatRepository.push({
      name,
      format,
    })
    await mutateCopyFormats()
    const addFormatMessage: Message = {
      id,
      name,
      type: "addFormat",
    }
    await chrome.runtime.sendMessage(addFormatMessage)

    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [copyFormatRepository, mutateCopyFormats])

  const handleClickRemove = useCallback<
    (id: string) => MouseEventHandler<HTMLButtonElement>
  >(
    (id) => async () => {
      setLoading(true)

      await copyFormatRepository.delete(id)
      await mutateCopyFormats()
      const removeFormatMessage: Message = {
        id,
        type: "removeFormat",
      }
      await chrome.runtime.sendMessage(removeFormatMessage)

      setTimeout(() => {
        setLoading(false)
      }, 1000)
    },
    [copyFormatRepository, mutateCopyFormats]
  )

  return (
    <OptionsTemplate
      copyFormatItems={clone}
      onChangeName={handleUpdateName}
      onBlurName={handleBlurName}
      onChangeFormat={handleUpdateFormat}
      onBlurFormat={handleBlurFormat}
      onClickAdd={handleClickAdd}
      onClickRemove={handleClickRemove}
      loading={loading}
    />
  )
}

type OptionsProps = {
  copyFormatItems: CopyFormat[]
  onChangeName: (id: string) => ChangeEventHandler<HTMLInputElement>
  onBlurName: (id: string) => FocusEventHandler<HTMLInputElement>
  onChangeFormat: (id: string) => ChangeEventHandler<HTMLTextAreaElement>
  onBlurFormat: (id: string) => FocusEventHandler<HTMLTextAreaElement>
  onClickAdd: MouseEventHandler<HTMLButtonElement>
  onClickRemove: (id: string) => MouseEventHandler<HTMLButtonElement>
  loading: boolean
}

export const OptionsTemplate = ({
  copyFormatItems,
  onChangeName,
  onBlurName,
  onChangeFormat,
  onBlurFormat,
  onClickAdd,
  onClickRemove,
  loading,
}: OptionsProps) => {
  return (
    <div className={"sections container"}>
      <div className={"title-with-logo"}>
        <Logo width={"64px"} />
        <h1>Copy Format List</h1>
      </div>
      <div className={"section"}>
        <CopyFormatItems
          copyFormatItems={copyFormatItems}
          onChangeName={onChangeName}
          onBlurName={onBlurName}
          onChangeFormat={onChangeFormat}
          onBlurFormat={onBlurFormat}
          onClickAdd={onClickAdd}
          onClickRemove={onClickRemove}
        />
      </div>
      {loading && <div className={"alert"}>saving...</div>}
    </div>
  )
}

export const OptionsPage = () => {
  return (
    <div className={"layout"}>
      <Suspense fallback={<div>loading...</div>}>
        <Options />
      </Suspense>
    </div>
  )
}
