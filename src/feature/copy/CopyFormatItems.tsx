import React, { MouseEventHandler } from "react"
import { GoPlus } from "react-icons/go"

import { Button } from "../../ui/Button"
import type { CopyFormat } from "./copy-format"
import { CopyFormatItem, CopyFormatItemProps } from "./CopyFormatItem"

type CopyFormatItemsProps = {
  copyFormatItems: CopyFormat[]
  onChangeName: (id: string) => CopyFormatItemProps["onChangeName"]
  onBlurName: (id: string) => CopyFormatItemProps["onBlurName"]
  onChangeFormat: (id: string) => CopyFormatItemProps["onChangeFormat"]
  onBlurFormat: (id: string) => CopyFormatItemProps["onBlurFormat"]
  onClickAdd: MouseEventHandler<HTMLButtonElement>
  onClickRemove: (id: string) => MouseEventHandler<HTMLButtonElement>
}

export const CopyFormatItems = ({
  copyFormatItems,
  onChangeName,
  onBlurName,
  onChangeFormat,
  onBlurFormat,
  onClickAdd,
  onClickRemove,
}: CopyFormatItemsProps) => {
  return (
    <div>
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
              onBlurName={onBlurName(fmt.id)}
              onChangeFormat={onChangeFormat(fmt.id)}
              onBlurFormat={onBlurFormat(fmt.id)}
              onClickRemove={onClickRemove(fmt.id)}
            />
          </li>
        ))}
      </ul>
      <div className={"add-format-button-wrapper"}>
        <Button onClick={onClickAdd} withIcon aria-label={"Add new format"}>
          <GoPlus />
          <span>Add</span>
        </Button>
      </div>
    </div>
  )
}
