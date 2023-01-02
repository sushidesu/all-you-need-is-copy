import { describe, it, expect } from "vitest"
import { parser, CpyFormateRoot } from "./parser"

describe(`parser`, () => {
  it(`empty string`, () => {
    const text = ""
    const result = parser(text)
    expect(result).toEqual<CpyFormateRoot>({
      id: "",
      type: "root",
      children: [],
    })
  })

  it(`<url>`, () => {
    const text = "<url>"
    const result = parser(text)
    expect(result).toEqual<CpyFormateRoot>({
      id: "",
      type: "root",
      children: [
        {
          id: "",
          type: "cpyParagraph",
          children: [
            {
              id: "",
              type: "cpyAngleBracket",
              children: [
                {
                  id: "",
                  type: "cpySymbolUrl",
                },
              ],
            },
          ],
        },
      ],
    })
  })

  it(`[<title>](<url>)`, () => {
    const text = "[<title>](<url>)"
    const result = parser(text)
    expect(result).toEqual<CpyFormateRoot>({
      id: "",
      type: "root",
      children: [
        {
          id: "",
          type: "cpyParagraph",
          children: [
            {
              id: "",
              type: "cpyText",
              value: "[",
            },
            {
              id: "",
              type: "cpyAngleBracket",
              children: [
                {
                  id: "",
                  type: "cpySymbolTitle",
                },
              ],
            },
            {
              id: "",
              type: "cpyText",
              value: "](",
            },
            {
              id: "",
              type: "cpyAngleBracket",
              children: [
                {
                  id: "",
                  type: "cpySymbolUrl",
                },
              ],
            },
            {
              id: "",
              type: "cpyText",
              value: ")",
            },
          ],
        },
      ],
    })
  })

  it(`<title>: <url>`, () => {
    const text = "<title>: <url>"
    const result = parser(text)
    expect(result).toEqual<CpyFormateRoot>({
      id: "",
      type: "root",
      children: [
        {
          id: "",
          type: "cpyParagraph",
          children: [
            {
              id: "",
              type: "cpyAngleBracket",
              children: [
                {
                  id: "",
                  type: "cpySymbolTitle",
                },
              ],
            },
            {
              id: "",
              type: "cpyText",
              value: ": ",
            },
            {
              id: "",
              type: "cpyAngleBracket",
              children: [
                {
                  id: "",
                  type: "cpySymbolUrl",
                },
              ],
            },
          ],
        },
      ],
    })
  })
})
