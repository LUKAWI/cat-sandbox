// 调试脚本 - 在浏览器控制台执行
(function() {
  console.log('🔍 ========== 调试开始 ==========')
  
  // 1. 检查输入框
  const textarea = document.querySelector('textarea')
  if (textarea) {
    console.log('✅ 输入框找到')
    console.log('   - 值:', JSON.stringify(textarea.value))
    console.log('   - 颜色:', getComputedStyle(textarea).color)
    console.log('   - 禁用:', textarea.disabled)
  } else {
    console.log('❌ 输入框未找到')
  }
  
  // 2. 检查 Button
  const button = document.querySelector('button[children*="SEND"]') || 
                 document.querySelector('button:last-of-type')
  if (button) {
    console.log('✅ Button 找到')
    console.log('   - 禁用:', button.disabled)
    console.log('   - 样式:', getComputedStyle(button).opacity)
    console.log('   - 可点击:', getComputedStyle(button).pointerEvents)
  } else {
    console.log('❌ Button 未找到')
  }
  
  // 3. 测试 API
  console.log('📡 测试 API 调用...')
  fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'debug test from console',
      session_id: 'default',
      agent_id: 'main'
    })
  })
  .then(r => {
    console.log('✅ API 响应状态:', r.status, r.ok)
    return r.json()
  })
  .then(data => {
    console.log('✅ API 响应数据:', data)
    console.log('🎉 ========== 调试完成 ==========')
  })
  .catch(err => {
    console.error('❌ API 错误:', err)
    console.error('🎉 ========== 调试完成 ==========')
  })
})()
