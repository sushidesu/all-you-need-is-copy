import React from "react"
import { Textarea } from "../../ui/Textarea"
import { range, Range } from "../../utils/range"

type CpyEditorProps = {
  text: string
  selections: Range[]
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>
  onBlur: React.FocusEventHandler<HTMLTextAreaElement>
}

type Block =
  | {
      type: "plain"
      range: Range
    }
  | {
      type: "highlight"
      range: Range
    }

export const CpyEditor = ({
  text,
  selections,
  onChange,
  onBlur,
}: CpyEditorProps) => {
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
    <div className={"cpy-editor-outer"}>
      <p className={"cpy-editor-preview"}>
        {blocks.map((block, i) =>
          block.type === "highlight" ? (
            <code className={`cpy-editor-block ${block.type}`} key={i}>
              {[...range(block.range)].map((index) => (
                <span key={index}>{text[index]}</span>
              ))}
            </code>
          ) : (
            <span className={`cpy-editor-block ${block.type}`} key={i}>
              {[...range(block.range)].map((index) => (
                <span key={index}>{text[index]}</span>
              ))}
            </span>
          )
        )}
      </p>
      <Textarea value={text} onChange={onChange} onBlur={onBlur} rows={1} />
    </div>
  )
}
