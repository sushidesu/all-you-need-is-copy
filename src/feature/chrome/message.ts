export type Message =
  | {
      type: "copy"
      format: string
    }
  | {
      type: "hello"
    }
