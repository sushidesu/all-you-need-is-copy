import type { Message } from "./feature/chrome/message";

chrome.runtime.onInstalled.addListener(async () => {
  // TODO: 別の場所に置く
  chrome.contextMenus.create(
    {
      id: "copy-as-markdown",
      title: "markdown",
      contexts: ["all"],
    }
  );
});

chrome.contextMenus.onClicked.addListener(async (_item, _tab) => {
  // TODO: idからformatを取ってきてそれを送る
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const currentTab = tabs[0];
  if (currentTab !== undefined && currentTab.id) {
    const message: Message = {
      type: "copy",
      format: "[<title>](<url>)"
    }
    await chrome.tabs.sendMessage(currentTab.id, message);
  }
});
