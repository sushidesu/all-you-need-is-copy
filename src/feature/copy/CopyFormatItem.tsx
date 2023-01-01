import React, { FocusEventHandler } from "react"

export type CopyFormatItemProps = {
  name: string
  onUpdateName: FocusEventHandler<HTMLParagraphElement>
  format: string
  onUpdateFormat: FocusEventHandler<HTMLParagraphElement>
}

export const CopyFormatItem = ({
  name,
  onUpdateName,
  format,
  onUpdateFormat,
}: CopyFormatItemProps) => {
  return (
    <div>
      <MiniEditor text={name} selections={[]} />
      <MiniEditor text={format} selections={[[1, 8]]} />
    </div>
  )
}

type MiniEditorProps = {
  text: string
  selections: Range[]
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

const MiniEditor = ({ text, selections }: MiniEditorProps) => {
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
