// 加载环境变量
require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();

// 设置视图引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// 根路由
app.get('/', function(req, res) {
  res.render('index', { 
    currentTime: new Date().toLocaleString('zh-CN'),
    appName: 'LeanEngine Demo (本地测试版)'
  });
});

// 健康检查路由
app.get('/health', function(req, res) {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: '服务运行正常'
  });
});

// 简单的API示例
app.get('/api/hello', function(req, res) {
  res.json({
    message: 'Hello from LeanEngine Demo!',
    time: new Date().toISOString()
  });
});

// 404 处理
app.use(function(req, res, next) {
  res.status(404).json({ error: 'Not Found' });
});

// 错误处理
app.use(function(err, req, res, next) {
  console.error('Error:', err);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message 
  });
});

const PORT = parseInt(process.env.LEANCLOUD_APP_PORT || process.env.PORT || 3000);

app.listen(PORT, function () {
  console.log('LeanEngine Demo is running on port:', PORT);
  console.log('访问 http://localhost:' + PORT + ' 查看应用');
});

module.exports = app;