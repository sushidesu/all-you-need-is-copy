import type { CopyFormat } from "../../feature/copy/copy-format"
import type { CopyFormatRepositoryInterface } from "../../feature/copy/copy-format-repository-interface"

export class CopyFormatRepository implements CopyFormatRepositoryInterface {
  formats: CopyFormat[] = [
    {
      id: "copy-as-markdown",
      name: "markdown",
      format: "[<title>](<url>)",
    },
  ]

  get(id: string): Promise<CopyFormat | undefined> {
    // TODO:
    return Promise.resolve(this.formats.find((c) => c.id == id))
  }

  getAll(): Promise<CopyFormat[]> {
    // TODO:
    return Promise.resolve(this.formats)
  }

  push(_copyFormatValue: Omit<CopyFormat, "id">): Promise<void> {
    // TODO:
    return Promise.resolve()
  }
  update(_id: string, _copyFormat: CopyFormat): Promise<void> {
    // TODO:
    return Promise.resolve()
  }
  delete(_id: string): Promise<void> {
    // TODO:
    return Promise.resolve()
  }
}
