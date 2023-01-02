const CopyFormatNodeTypes = {
  cpyRoot: "root",
  cpyParagraph: "cpyParagraph",
  cpyText: "cpyText",
  cpyAngleBracket: "cpyAngleBracket",

  cpySymbolTitle: "cpySymbolTitle",
  cpySymbolUrl: "cpySymbolUrl",
} as const

type CpyFormatNodeObj<Kind> = {
  id: string
  type: Kind
  children: CopyFormatNode[]
}

type CpyFormatNodeLeaf<Kind> = {
  id: string
  type: Kind
}

type CpyFormatNodeValue<Kind, Value> = {
  id: string
  type: Kind
  value: Value
}

type CpyFormatNodeParagraph = CpyFormatNodeObj<
  typeof CopyFormatNodeTypes["cpyParagraph"]
>

type CpyFormatAngleBracket = CpyFormatNodeObj<
  typeof CopyFormatNodeTypes["cpyAngleBracket"]
>

export type CopyFormatNode =
  | CpyFormatNodeParagraph
  | CpyFormatAngleBracket
  | CpyFormatNodeValue<typeof CopyFormatNodeTypes["cpyText"], string>
  | CpyFormatNodeLeaf<typeof CopyFormatNodeTypes["cpySymbolTitle"]>
  | CpyFormatNodeLeaf<typeof CopyFormatNodeTypes["cpySymbolUrl"]>

export type CpyFormateRoot = CpyFormatNodeObj<
  typeof CopyFormatNodeTypes["cpyRoot"]
>

/**
 * [<title>](<url>)
 *
 * root
 *   cpyParagraph
 *     cpyText
 *       [
 *     cpyAngleBracket
 *       title
 *     cpyText
 *       ]
 *     cpyText
 *       (
 *     cpyAngleBracket
 *       url
 *     cpyText
 *       )
 */

const LEFT_ANGLE = "<"
const RIGHT_ANGLE = ">"
const TITLE = "title"
const URL = "url"

const lex = (text: string): string[] => {
  const tokens: string[] = []
  let token: string = ""

  for (const char of Array.from(text)) {
    if (char === LEFT_ANGLE) {
      if (token !== "") {
        tokens.push(token)
        token = ""
      }
      tokens.push(char)
    } else if (char === RIGHT_ANGLE) {
      if (token !== "") {
        tokens.push(token)
        token = ""
      }
      tokens.push(char)
    } else {
      token += char
    }
  }

  if (token !== "") {
    tokens.push(token)
  }

  return tokens
}

const parse = (tokens: string[]): CpyFormateRoot => {
  const root: CpyFormateRoot = {
    id: "",
    type: "root",
    children: [],
  }

  const paragraph: CpyFormatNodeParagraph = {
    id: "",
    type: "cpyParagraph",
    children: [],
  }

  let i = 0
  while (i < tokens.length) {
    const token = tokens[i]
    if (token === undefined) continue

    if (token === LEFT_ANGLE) {
      const [newIndex, child] = parseLeftAngle(tokens, i + 1)
      paragraph.children.push(child)
      i = newIndex
    } else {
      paragraph.children.push({
        id: "",
        type: "cpyText",
        value: token,
      })
    }
    i++
  }

  if (0 < paragraph.children.length) {
    root.children.push(paragraph)
  }

  return root
}

const parseLeftAngle = (
  tokens: string[],
  index: number
): [number, CopyFormatNode] => {
  const angle: CpyFormatAngleBracket = {
    id: "",
    type: "cpyAngleBracket",
    children: [],
  }

  while (index < tokens.length) {
    const token = tokens[index]
    if (token === undefined) continue

    if (token === RIGHT_ANGLE) {
      return [index, angle]
    } else if (token === TITLE) {
      angle.children.push({
        id: "",
        type: "cpySymbolTitle",
      })
    } else if (token === URL) {
      angle.children.push({
        id: "",
        type: "cpySymbolUrl",
      })
    } else {
      angle.children.push({
        id: "",
        type: "cpyText",
        value: token,
      })
    }

    index++
  }

  return [index, angle]
}

export const parser = (text: string): CpyFormateRoot => {
  const tokens = lex(text)
  return parse(tokens)
}
