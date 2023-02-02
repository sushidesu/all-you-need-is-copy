import React, { useMemo } from "react"
import { GoX } from "react-icons/go"

import { Button } from "../../ui/Button"
import { Input } from "../../ui/Input"
import type { Range } from "../../utils/range"
import { CpyEditor } from "./CpyEditor"
import { CopyFormatNode, CpyFormateRoot, parser } from "./parser"

export type CopyFormatItemProps = {
  name: string
  format: string
  onChangeFormat: React.ChangeEventHandler<HTMLTextAreaElement>
  onBlurFormat: React.FocusEventHandler<HTMLTextAreaElement>
  onChangeName: React.ChangeEventHandler<HTMLInputElement>
  onBlurName: React.FocusEventHandler<HTMLInputElement>
  onClickRemove: React.MouseEventHandler<HTMLButtonElement>
}

export const CopyFormatItem = ({
  name,
  format,
  onBlurName,
  onChangeFormat,
  onBlurFormat,
  onClickRemove,
}: CopyFormatItemProps) => {
  const selection = useMemo(() => genSelection(parser(format)), [format])

  return (
    <div className={"copy-format-item-inner"}>
      <div className={"copy-format-item-cell"}>
        <Input defaultValue={name} onBlur={onBlurName} />
      </div>
      <div className={"copy-format-item-cell"}>
        <CpyEditor
          text={format}
          selections={selection}
          onChange={onChangeFormat}
          onBlur={onBlurFormat}
        />
      </div>
      <div className={"copy-format-item-cell"}>
        <Button onClick={onClickRemove} icon aria-label={`Remove ${name}`}>
          <GoX />
        </Button>
      </div>
    </div>
  )
}

const genSelection = (root: CpyFormateRoot): Range[] => {
  if (root.children[0]?.type !== "cpyParagraph") {
    return []
  }

  let j = 0
  const result: Range[] = []
  const paragraph = root.children[0].children

  for (const node of paragraph) {
    switch (node.type) {
      case "cpyAngleBracket": {
        const length = getLength(node)
        result.push([j, j + length + 2])
        j += length + 2
        continue
      }
      case "cpySymbolTitle":
        j += 5
        continue
      case "cpySymbolUrl":
        j += 3
        continue
      case "cpyText":
        j += node.value.length
        continue
    }
  }

  return result
}

const getLength = (node: CopyFormatNode): number => {
  switch (node.type) {
    case "cpyText":
      return node.value.length
    case "cpySymbolTitle":
      return 5
    case "cpySymbolUrl":
      return 3
    default: {
      let length = 0
      for (const child of node.children) {
        length += getLength(child)
      }
      return length
    }
  }
}
