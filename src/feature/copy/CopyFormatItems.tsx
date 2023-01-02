import React from "react"
import type { CopyFormat } from "./copy-format"
import { CopyFormatItem, CopyFormatItemProps } from "./CopyFormatItem"

type CopyFormatItemsProps = {
  copyFormatItems: CopyFormat[]
  onChangeName: (id: string) => CopyFormatItemProps["onChangeName"]
  onChangeFormat: (id: string) => CopyFormatItemProps["onChangeFormat"]
}

export const CopyFormatItems = ({
  copyFormatItems,
  onChangeName,
  onChangeFormat,
}: CopyFormatItemsProps) => {
  return (
    <ul>
      {copyFormatItems.map((fmt) => (
        <li key={fmt.id}>
          <CopyFormatItem
            name={fmt.name}
            format={fmt.format}
            onChangeName={onChangeName(fmt.id)}
            onChangeFormat={onChangeFormat(fmt.id)}
          />
        </li>
      ))}
    </ul>
  )
}
