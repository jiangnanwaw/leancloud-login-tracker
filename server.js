const AV = require('leanengine');

// 初始化 LeanEngine
AV.init({
  appId: process.env.LEANCLOUD_APP_ID,
  appKey: process.env.LEANCLOUD_APP_KEY,
  masterKey: process.env.LEANCLOUD_APP_MASTER_KEY
});

// 使用 Master Key
AV.Cloud.useMasterKey();

// 加载云函数和 Hook
require('./app');

// 创建 Express 应用
const app = new (require('express'))();

// 解析 JSON 请求体
app.use(require('express').json());

// 健康检查路由（LeanEngine 必需）
app.get('/', (req, res) => {
  res.json({
    message: '🔐 LeanEngine 用户登录记录系统',
    status: '✅ 运行中',
    timestamp: new Date().toISOString(),
    environment: process.env.LEANCLOUD_APP_ENV || 'development',
    features: [
      '✅ afterLogin Hook - 自动记录登录信息',
      '✅ beforeLogin Hook - 登录前检查',
      '✅ getUserLoginRecords - 查询登录记录'
    ]
  });
});

// 健康检查路由
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 测试路由
app.get('/test', (req, res) => {
  res.json({
    message: '✅ 测试成功',
    appId: process.env.LEANCLOUD_APP_ID ? '已配置' : '未配置',
    timestamp: new Date().toISOString()
  });
});

// 获取登录记录的测试接口
app.get('/login-records', async (req, res) => {
  try {
    const query = new AV.Query('LoginRecord');
    query.descending('createdAt');
    query.limit(10);
    query.include('user');
    
    const records = await query.find({ useMasterKey: true });
    
    const recordsData = records.map(record => ({
      id: record.id,
      username: record.get('username'),
      loginTime: record.get('loginTime'),
      ipAddress: record.get('ipAddress'),
      loginMethod: record.get('loginMethod'),
      createdAt: record.createdAt
    }));
    
    res.json({
      success: true,
      count: recordsData.length,
      records: recordsData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 设置端口
const PORT = parseInt(process.env.LEANCLOUD_APP_PORT || process.env.PORT || 3000);

// 启动服务器
app.listen(PORT, '0.0.0.0', function (err) {
  if (err) {
    console.error('❌ 服务器启动失败:', err);
    process.exit(1);
  }
  console.log(`🚀 LeanEngine 已启动，监听端口 ${PORT}`);
  console.log(`📊 功能已启用：用户登录记录追踪`);
  console.log(`🌐 访问地址: http://localhost:${PORT}`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('🔄 收到 SIGTERM 信号，正在优雅关闭...');
  process.exit(0);
});

module.exports = app;