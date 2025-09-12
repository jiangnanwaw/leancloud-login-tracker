const express = require('express');
const app = express();

// 设置静态文件目录
app.use('/static', express.static('public'));

// 根路径重定向到测试页面
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// 演示API端点
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '服务正常运行', 
    timestamp: new Date().toISOString(),
    note: '这是演示服务器，请配置真实的LeanCloud信息后使用完整功能'
  });
});

// 启动服务器
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`演示服务器已启动: http://localhost:${PORT}`);
  console.log('请在浏览器中打开上述地址查看测试页面');
});

module.exports = app;