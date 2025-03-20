// 创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translateWithGoogle",
    title: "使用谷歌翻译",
    contexts: ["selection"]
  }, () => {
    if (chrome.runtime.lastError) {
      console.error('创建菜单时出错:', chrome.runtime.lastError);
    }
  });
});

// 处理右键菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "translateWithGoogle") {
    const selectedText = encodeURIComponent(info.selectionText);
    const googleTranslateUrl = `https://translate.google.com/?sl=auto&tl=en&text=${selectedText}&op=translate`;
    
    // 发送消息给content script来打开翻译窗口
    chrome.tabs.sendMessage(tab.id, {
      action: "openTranslateWindow",
      url: googleTranslateUrl
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('发送消息时出错:', chrome.runtime.lastError);
        // 如果发送消息失败，尝试直接打开新标签页
        chrome.tabs.create({ url: googleTranslateUrl });
      }
    });
  }
}); 