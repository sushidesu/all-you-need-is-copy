import React, { useMemo, useCallback, FocusEventHandler } from "react"
import { parser, CpyFormateRoot, CopyFormatNode } from "./parser"

export type CopyFormatItemProps = {
  name: string
  format: string
  onChangeName: React.ChangeEventHandler<HTMLInputElement>
  onChangeFormat: React.ChangeEventHandler<HTMLTextAreaElement>
}

export const CopyFormatItem = ({
  name,
  format,
  onChangeName,
  onChangeFormat,
}: CopyFormatItemProps) => {
  const selection = useMemo(() => genSelection(parser(format)), [format])

  return (
    <div className={"copy-format-item-inner"}>
      <div className={"copy-format-item-cell"}>
        <input defaultValue={name} />
      </div>
      <div className={"copy-format-item-cell"}>
        <MiniEditor
          text={format}
          selections={selection}
          onChange={onChangeFormat}
        />
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

type MiniEditorProps = {
  text: string
  selections: Range[]
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>
}

type Range = [number, number]

type Block =
  | {
      type: "plain"
      range: Range
    }
  | {
      type: "highlight"
      range: Range
    }

const MiniEditor = ({ text, selections, onChange }: MiniEditorProps) => {
  const blocks: Block[] =
    selections.length <= 0 ? [{ type: "plain", range: [0, text.length] }] : []

  for (let i = 0; i < selections.length; i++) {
    const selection = selections[i]
    if (selection === undefined) continue
    const lastBlock = blocks.at(-1)

    // 隙間があるなら、自分の前の隙間を埋める
    const lastIndex = lastBlock?.range[1] ?? 0
    if (lastIndex < selection[0]) {
      blocks.push({ type: "plain", range: [lastIndex, selection[0]] })
    }

    // selectionをblockに追加する
    blocks.push({ type: "highlight", range: selection })

    // (最後のみ)隙間があるなら、後ろの隙間を埋める
    if (i === selections.length - 1 && selection[1] < text.length) {
      blocks.push({ type: "plain", range: [selection[1], text.length] })
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <p>
        {blocks.map((block) =>
          block.type === "highlight" ? (
            <code className={`block ${block.type}`}>
              {[...range(block.range)].map((index) => (
                <span>{text[index]}</span>
              ))}
            </code>
          ) : (
            <span className={`block ${block.type}`}>
              {[...range(block.range)].map((index) => (
                <span>{text[index]}</span>
              ))}
            </span>
          )
        )}
      </p>
      <textarea value={text} onChange={onChange} />
    </div>
  )
}

function range(range: Range): Generator<number, void, unknown>
function range(start: number, end: number): Generator<number, void, unknown>
function* range(
  ...args: [Range] | [number, number]
): Generator<number, void, unknown> {
  if (typeof args[0] === "number" && typeof args[1] === "number") {
    const [start, end] = args
    for (let i = start; i < end; i++) {
      yield i
    }
  } else if (Array.isArray(args[0])) {
    const [range] = args
    for (let i = range[0]; i < range[1]; i++) {
      yield i
    }
  }
}
