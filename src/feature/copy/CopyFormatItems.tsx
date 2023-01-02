import React from "react"
import type { CopyFormat } from "./copy-format"
import { CopyFormatItem, CopyFormatItemProps } from "./CopyFormatItem"

type CopyFormatItemsProps = {
  copyFormatItems: CopyFormat[]
  onChangeName: (id: string) => CopyFormatItemProps["onChangeName"]
  onChangeFormat: (id: string) => CopyFormatItemProps["onChangeFormat"]
  onBlurFormat: (id: string) => CopyFormatItemProps["onBlurFormat"]
}

export const CopyFormatItems = ({
  copyFormatItems,
  onChangeName,
  onChangeFormat,
  onBlurFormat,
}: CopyFormatItemsProps) => {
  return (
    <ul className={"copy-format-items"}>
      <li className={"copy-format-item"}>
        <p className={"copy-format-item-cell head"}>Name</p>
        <p className={"copy-format-item-cell head"}>Format</p>
      </li>
      {copyFormatItems.map((fmt) => (
        <li className={"copy-format-item"} key={fmt.id}>
          <CopyFormatItem
            name={fmt.name}
            format={fmt.format}
            onChangeName={onChangeName(fmt.id)}
            onChangeFormat={onChangeFormat(fmt.id)}
            onBlurFormat={onBlurFormat(fmt.id)}
          />
        </li>
      ))}
    </ul>
  )
}
