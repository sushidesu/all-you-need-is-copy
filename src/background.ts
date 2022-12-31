import type { Message } from "./feature/chrome/message"
import { CopyFormatRepository } from "./infra/copy/copy-format-repository"

const copyFormatRepository = new CopyFormatRepository()

chrome.runtime.onInstalled.addListener(async () => {
  const formats = await copyFormatRepository.getAll()
  for (const copy of formats) {
    chrome.contextMenus.create({
      id: copy.id,
      title: copy.name,
      contexts: ["all"],
    })
  }
})

chrome.contextMenus.onClicked.addListener(async (item, tab) => {
  const copy = await copyFormatRepository.get(item.menuItemId.toString())

  if (copy === undefined) {
    // TODO: なかった時どうする？
    return
  }
  if (tab === undefined || tab.id === undefined) {
    // TODO: なかった時どうする？
    return
  }

  const message: Message = {
    type: "copy",
    format: copy.format,
  }
  await chrome.tabs.sendMessage(tab.id, message)
})
