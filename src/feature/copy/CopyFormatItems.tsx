import React from "react"
import type { CopyFormat } from "./copy-format"
import { CopyFormatItem, CopyFormatItemProps } from "./CopyFormatItem"

type CopyFormatItemsProps = {
  copyFormatItems: CopyFormat[]
  onUpdateName: (id: string) => CopyFormatItemProps["onUpdateName"]
  onUpdateFormat: (id: string) => CopyFormatItemProps["onUpdateFormat"]
}

export const CopyFormatItems = ({
  copyFormatItems,
  onUpdateName,
  onUpdateFormat,
}: CopyFormatItemsProps) => {
  return (
    <ul>
      {copyFormatItems.map((fmt) => (
        <li key={fmt.id}>
          <CopyFormatItem
            name={fmt.name}
            format={fmt.format}
            onUpdateName={onUpdateName(fmt.id)}
            onUpdateFormat={onUpdateFormat(fmt.id)}
          />
        </li>
      ))}
    </ul>
  )
}
