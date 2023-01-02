export type Message =
  | {
      type: "copy"
      format: string
    }
  | {
      type: "updateName"
      id: string
      name: string
    }
