// 监听来自background script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('收到消息:', request); // 添加调试日志
  
  if (request.action === "openTranslateWindow") {
    try {
      // 创建翻译窗口
      const translateWindow = window.open(
        request.url,
        'GoogleTranslate',
        'width=800,height=600,left=' + (window.screenX + 50) + ',top=' + (window.screenY + 50)
      );
      
      if (translateWindow === null) {
        console.error('窗口打开失败，可能被浏览器阻止');
        alert('翻译窗口被阻止。请允许弹出窗口后重试。');
      }
    } catch (error) {
      console.error('打开翻译窗口时出错:', error);
      alert('打开翻译窗口时出错，请重试');
    }
  }
  
  // 返回 true 表示将异步发送响应
  return true;
}); 