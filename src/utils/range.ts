export type Range = [number, number]

export function range(range: Range): Generator<number, void, unknown>
export function range(
  start: number,
  end: number
): Generator<number, void, unknown>
export function* range(
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
