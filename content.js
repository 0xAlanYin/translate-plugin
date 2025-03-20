// 创建一个浮动的提示框元素
const createTooltip = () => {
  // 如果已存在则移除
  const existingTooltip = document.getElementById('translation-tooltip');
  if (existingTooltip) {
    document.body.removeChild(existingTooltip);
  }

  const tooltip = document.createElement('div');
  tooltip.id = 'translation-tooltip';
  tooltip.style.cssText = `
    position: fixed;
    background: white;
    border: 1px solid #ccc;
    padding: 8px 12px;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    max-width: 300px;
    z-index: 999999;
    font-size: 14px;
    display: none;
    color: black;
    pointer-events: auto;
  `;
  document.body.appendChild(tooltip);
  console.log('提示框已创建:', tooltip);
  return tooltip;
};

// 翻译函数 - 使用免费的翻译API
const translateText = async (text) => {
  try {
    console.log('开始调用翻译API，文本:', text);
    
    // 这里使用Google翻译API
    const encodedText = encodeURIComponent(text);
    // 使用谷歌翻译进行尝试
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=en&dt=t&q=${encodedText}`;
    
    console.log('翻译请求URL:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('谷歌翻译API响应:', data);
    
    if (data && data[0] && data[0][0]) {
      return data[0][0][0];
    } else {
      // 备用翻译API
      console.log('谷歌翻译失败，尝试备用API');
      const backupUrl = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=zh|en`;
      const backupResponse = await fetch(backupUrl);
      const backupData = await backupResponse.json();
      
      console.log('备用翻译API响应:', backupData);
      
      if (backupData && backupData.responseData && backupData.responseData.translatedText) {
        return backupData.responseData.translatedText;
      } else {
        return "翻译失败，请重试";
      }
    }
  } catch (error) {
    console.error("翻译出错:", error);
    return "翻译服务暂不可用，错误: " + error.message;
  }
};

// 检测文本是否是中文
const isChineseText = (text) => {
  const result = /[\u4e00-\u9fa5]/.test(text);
  console.log('检测文本是否包含中文:', text, result);
  return result;
};

// 显示提示框
const showTooltip = (tooltip, text, x, y) => {
  tooltip.textContent = text;
  tooltip.style.display = 'block';
  tooltip.style.left = `${x + 10}px`;
  tooltip.style.top = `${y + 10}px`;
  console.log(`显示提示框: 位置(${x},${y}), 内容:`, text, '元素:', tooltip);
};

// 主函数
(function() {
  console.log('翻译插件已加载');
  
  // 创建提示框
  let tooltip = createTooltip();
  let hideTimeout;

  // 监听鼠标选择事件
  document.addEventListener('mouseup', async (event) => {
    console.log('mouseup事件触发, 事件:', event);
    clearTimeout(hideTimeout);
    
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    console.log('选中的文本:', selectedText);
    
    // 如果有选中的文本且包含中文，则进行翻译
    if (selectedText.length > 0) {
      console.log('有选中文本，长度:', selectedText.length);
      
      if (isChineseText(selectedText)) {
        console.log('开始翻译中文文本');
        
        // 获取鼠标位置
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        
        // 确保提示框存在
        if (!document.getElementById('translation-tooltip')) {
          console.log('提示框不存在，重新创建');
          tooltip = createTooltip();
        }
        
        // 显示加载中状态
        showTooltip(tooltip, '翻译中...', mouseX, mouseY);
        
        try {
          // 调用翻译API
          const translatedText = await translateText(selectedText);
          console.log('翻译结果:', translatedText);
          
          // 显示翻译结果
          showTooltip(tooltip, translatedText, mouseX, mouseY);
          
          // 确认提示框可见
          console.log('提示框状态:', 
            '可见性:', tooltip.style.display, 
            '位置:', tooltip.style.left, tooltip.style.top, 
            '内容:', tooltip.textContent
          );
          
          // 3秒后自动关闭
          hideTimeout = setTimeout(() => {
            tooltip.style.display = 'none';
            console.log('提示框自动关闭');
          }, 3000);
        } catch (error) {
          console.error('翻译过程出错:', error);
          showTooltip(tooltip, '翻译失败: ' + error.message, mouseX, mouseY);
          
          hideTimeout = setTimeout(() => {
            tooltip.style.display = 'none';
          }, 3000);
        }
      } else {
        console.log('选中的文本不包含中文，跳过翻译');
      }
    } else {
      console.log('没有选中文本，跳过翻译');
    }
  });
  
  // 点击事件关闭提示框
  document.addEventListener('click', (event) => {
    console.log('点击事件触发', event.target);
    // 如果点击的不是tooltip本身，则关闭tooltip
    if (event.target.id !== 'translation-tooltip') {
      tooltip.style.display = 'none';
      console.log('点击事件关闭提示框');
    }
  });
  
  // 处理窗口滚动时关闭提示框
  window.addEventListener('scroll', () => {
    tooltip.style.display = 'none';
    console.log('滚动事件关闭提示框');
  });
  
  // 确保页面加载完成后提示框可用
  window.addEventListener('load', () => {
    console.log('页面加载完成，确保提示框可用');
    if (!document.getElementById('translation-tooltip')) {
      tooltip = createTooltip();
    }
  });
})(); 