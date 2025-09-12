const AV = require('leancloud-storage');
const { Cloud } = require('leanengine');

/**
 * 用户登录后的Hook函数
 * 在用户成功登录后自动触发，记录登录信息
 */
Cloud.onLogin((request) => {
  console.log('用户登录Hook触发:', request.user.get('username'));
  
  // 获取登录用户信息
  const user = request.user;
  const currentTime = new Date();
  
  // 获取客户端信息
  const clientIP = request.meta.remoteAddress || '未知IP';
  const userAgent = request.headers['user-agent'] || '未知设备';
  
  // 解析平台信息
  let platform = '未知平台';
  if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    platform = 'iOS';
  } else if (userAgent.includes('Android')) {
    platform = 'Android';
  } else if (userAgent.includes('Windows')) {
    platform = 'Windows';
  } else if (userAgent.includes('Mac')) {
    platform = 'macOS';
  } else if (userAgent.includes('Linux')) {
    platform = 'Linux';
  }

  // 创建登录记录
  const LoginRecord = AV.Object.extend('LoginRecord');
  const loginRecord = new LoginRecord();
  
  loginRecord.set('user', user);
  loginRecord.set('loginTime', currentTime);
  loginRecord.set('ipAddress', clientIP);
  loginRecord.set('userAgent', userAgent);
  loginRecord.set('platform', platform);
  
  // 保存登录记录
  loginRecord.save(null, { useMasterKey: true }).then(() => {
    console.log('登录记录保存成功:', {
      userId: user.id,
      username: user.get('username'),
      loginTime: currentTime,
      platform: platform,
      ip: clientIP
    });
  }).catch((error) => {
    console.error('保存登录记录失败:', error);
  });
});

/**
 * 用户登录验证Hook
 * 可以在此处添加额外的登录验证逻辑
 */
Cloud.onVerified('sms', (request) => {
  console.log('短信验证完成:', request.user.get('username'));
});

/**
 * 云函数：获取用户登录历史
 * 可以通过客户端调用此函数查询登录记录
 */
Cloud.define('getUserLoginHistory', async (request) => {
  const { params, user } = request;
  
  if (!user) {
    throw new Cloud.Error('用户未登录', { code: 401 });
  }
  
  try {
    const query = new AV.Query('LoginRecord');
    query.equalTo('user', user);
    query.descending('loginTime');
    query.limit(params.limit || 10);
    query.skip(params.skip || 0);
    
    const records = await query.find({ useMasterKey: true });
    
    const loginHistory = records.map(record => ({
      id: record.id,
      loginTime: record.get('loginTime'),
      ipAddress: record.get('ipAddress'),
      platform: record.get('platform'),
      userAgent: record.get('userAgent')
    }));
    
    return {
      success: true,
      data: loginHistory,
      total: loginHistory.length
    };
  } catch (error) {
    console.error('查询登录历史失败:', error);
    throw new Cloud.Error('查询失败', { code: 500 });
  }
});

/**
 * 云函数：获取所有用户登录统计（管理员专用）
 */
Cloud.define('getAllUsersLoginStats', async (request) => {
  const { user } = request;
  
  // 检查管理员权限（这里简化处理，实际项目中应该有更严格的权限控制）
  if (!user || !user.get('isAdmin')) {
    throw new Cloud.Error('权限不足', { code: 403 });
  }
  
  try {
    const query = new AV.Query('LoginRecord');
    query.include('user');
    query.descending('loginTime');
    query.limit(100);
    
    const records = await query.find({ useMasterKey: true });
    
    const loginStats = records.map(record => ({
      userId: record.get('user').id,
      username: record.get('user').get('username'),
      email: record.get('user').get('email'),
      loginTime: record.get('loginTime'),
      ipAddress: record.get('ipAddress'),
      platform: record.get('platform')
    }));
    
    return {
      success: true,
      data: loginStats
    };
  } catch (error) {
    console.error('查询登录统计失败:', error);
    throw new Cloud.Error('查询失败', { code: 500 });
  }
});

module.exports = Cloud;