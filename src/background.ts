import type { Message } from "./feature/chrome/message"
import { CopyFormatRepository } from "./infra/copy/copy-format-repository"

const copyFormatRepository = new CopyFormatRepository()

chrome.runtime.onInstalled.addListener(async () => {
  await copyFormatRepository.init()

  const formats = await copyFormatRepository.getAll()
  for (const copy of formats) {
    chrome.contextMenus.create({
      id: copy.id,
      title: copy.name,
      contexts: ["all"],
    })
  }
})

chrome.runtime.onMessage.addListener(async (request, _, response) => {
  const message = request as Message
  switch (message.type) {
    case "copy":
      // do nothing
      break
    case "updateName": {
      chrome.contextMenus.update(
        message.id,
        {
          title: message.name,
        },
        () => {
          response("ok")
        }
      )
      break
    }
    case "addFormat": {
      chrome.contextMenus.create(
        {
          id: message.id,
          title: message.name,
          contexts: ["all"],
        },
        () => {
          response("ok")
        }
      )
      break
    }
    default:
      message satisfies never
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
