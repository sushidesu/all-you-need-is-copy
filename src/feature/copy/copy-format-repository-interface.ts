import type { CopyFormat } from "./copy-format"

export interface CopyFormatRepositoryInterface {
  get(id: string): Promise<CopyFormat | undefined>
  getAll(): Promise<CopyFormat[]>
  push(copyFormatValue: Omit<CopyFormat, "id">): Promise<string>
  update(id: string, copyFormat: CopyFormat): Promise<void>
  delete(id: string): Promise<void>
}
