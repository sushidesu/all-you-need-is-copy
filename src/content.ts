import type { Message } from "./feature/chrome/message"

chrome.runtime.onMessage.addListener(async (request, _, sendResponse) => {
  const message = request as Message
  switch (message.type) {
    case "copy": {
      const parsed = parse(message.format)
      await navigator.clipboard.writeText(parsed)
      // TODO: copied を送って、アイコンにチェックマークをつける
      sendResponse("ok")
      break
    }
    case "hello": {
      // sample
      break
    }
    default: {
      message satisfies never
    }
  }
})

// TODO: 名前、置き場所
const parse = (format: string): string => {
  return (
    format
      // <title>
      .replaceAll(/<title>/g, document.title)
      // <url>
      .replaceAll(/<url>/g, document.URL)
  )
}
