// 测试LeanCloud连接
require('dotenv').config();
const AV = require('leancloud-storage');

console.log('正在测试LeanCloud连接...');
console.log('App ID:', process.env.LEANCLOUD_APP_ID);
console.log('App Key:', process.env.LEANCLOUD_APP_KEY ? '已设置' : '未设置');

try {
  AV.init({
    appId: process.env.LEANCLOUD_APP_ID,
    appKey: process.env.LEANCLOUD_APP_KEY,
    serverURL: 'https://api.leancloud.cn' // 国内版服务器地址
  });
  
  console.log('✅ LeanCloud SDK 初始化成功');
  
  // 测试简单查询
  const TestObject = AV.Object.extend('TestConnection');
  const query = new AV.Query(TestObject);
  
  query.find().then(results => {
    console.log('✅ 连接测试成功，查询结果数量:', results.length);
    process.exit(0);
  }).catch(error => {
    console.log('❌ 连接测试失败:', error.message);
    console.log('错误代码:', error.code);
    process.exit(1);
  });
  
} catch (error) {
  console.log('❌ SDK初始化失败:', error.message);
  process.exit(1);
}