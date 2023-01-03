import type { CopyFormat } from "../../feature/copy/copy-format"
import type { CopyFormatRepositoryInterface } from "../../feature/copy/copy-format-repository-interface"
import { ulid } from "ulid"

type ChromeSyncStorage = {
  version: 1
  copyFormats: Record<string, CopyFormatInStorage>
}

const chromeStorageKeys = {
  version: "version",
  copyFormats: "copyFormats",
} satisfies Record<keyof ChromeSyncStorage, keyof ChromeSyncStorage>

type CopyFormatInStorage = {
  id: string
  name: string
  format: string
  type: "default" | "normal"
  order: number
}

export class CopyFormatRepository implements CopyFormatRepositoryInterface {
  initialFormats: CopyFormatInStorage[] = [
    {
      id: "copy-as-markdown",
      name: "markdown",
      format: "[<title>](<url>)",
      order: 0,
      type: "default",
    },
    {
      id: "copy-as-plain",
      name: "plain text",
      format: "<title>: <url>",
      order: 1,
      type: "normal",
    },
  ]

  /**
   * - インストール直後のstorage初期化
   * - migrateがあればそれをやる
   */
  async init() {
    const allItems = await chrome.storage.sync.get()

    // TODO: バージョン確認 & migrate
    if (
      Object.hasOwn(allItems, chromeStorageKeys.version) &&
      Object.hasOwn(allItems, chromeStorageKeys.copyFormats) &&
      allItems[chromeStorageKeys.version] === 1
    ) {
      // データありなので何もしない
      return
    }

    // 初期データを登録する
    const initData: ChromeSyncStorage = {
      version: 1,
      copyFormats: Object.fromEntries(
        this.initialFormats.map((v) => [v.id, v])
      ),
    }
    await chrome.storage.sync.set(initData)
  }

  private async getCopyFormatsBucket(): Promise<
    ChromeSyncStorage["copyFormats"]
  > {
    const bucket = (await chrome.storage.sync.get(
      chromeStorageKeys.copyFormats
    )) as Pick<ChromeSyncStorage, "copyFormats">
    return bucket["copyFormats"]
  }

  private getNextOrder(bucket: ChromeSyncStorage["copyFormats"]): number {
    return Object.keys(bucket).length
  }

  async get(id: string): Promise<CopyFormat | undefined> {
    const copyFormats = await this.getCopyFormatsBucket()
    return copyFormats[id]
  }

  async getAll(): Promise<CopyFormat[]> {
    const copyFormats = await this.getCopyFormatsBucket()
    return Object.values(copyFormats).sort((a, b) => a.order - b.order)
  }

  async push(copyFormatValue: Omit<CopyFormat, "id">): Promise<string> {
    const bucket = await this.getCopyFormatsBucket()

    const id = ulid()
    const fmt: CopyFormatInStorage = {
      id,
      name: copyFormatValue.name,
      format: copyFormatValue.format,
      type: "normal",
      order: this.getNextOrder(bucket),
    }

    await chrome.storage.sync.set({
      [chromeStorageKeys.copyFormats]: {
        ...bucket,
        [id]: fmt,
      },
    })

    return id
  }

  async update(id: string, copyFormat: CopyFormat): Promise<void> {
    const bucket = await this.getCopyFormatsBucket()
    const next = { ...bucket }

    const target = next[id]
    if (target === undefined) return
    const updated = { ...target, ...copyFormat }
    next[id] = updated

    await chrome.storage.sync.set({
      [chromeStorageKeys.copyFormats]: next,
    })
  }

  delete(_id: string): Promise<void> {
    // TODO:
    return Promise.resolve()
  }
}
