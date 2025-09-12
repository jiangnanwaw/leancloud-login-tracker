const AV = require('leancloud-storage');
const { Cloud } = require('leanengine');

// 初始化LeanCloud
AV.init({
  appId: process.env.LEANCLOUD_APP_ID,
  appKey: process.env.LEANCLOUD_APP_KEY,
  masterKey: process.env.LEANCLOUD_APP_MASTER_KEY,
  serverURL: process.env.LEANCLOUD_SERVER_URL || 'https://please-set-your-leancloud-server-url.example.com'
});

// 使用 master key
AV.Cloud.useMasterKey();

const express = require('express');
const app = express();

// 设置静态文件目录
app.use('/static', express.static('public'));

// 引入云函数和Hook
require('./cloud/hooks');

// 云引擎中间件
app.use(Cloud);

// 启动服务器
const PORT = process.env.LEANCLOUD_APP_PORT || 3000;
app.listen(PORT, () => {
  console.log(`云引擎服务已启动，端口: ${PORT}`);
});

module.exports = app;