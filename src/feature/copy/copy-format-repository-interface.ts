import type { CopyFormat } from "./copy-format"

export interface CopyFormatRepositoryInterface {
  get(id: string): Promise<CopyFormat | undefined>
  getAll(): Promise<CopyFormat[]>
  push(copyFormat: CopyFormat): Promise<void>
  update(id: string, copyFormat: CopyFormat): Promise<void>
  delete(id: string): Promise<void>
}
