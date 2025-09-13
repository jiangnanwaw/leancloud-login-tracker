const AV = require('leanengine');

// 定义一个简单的云函数
AV.Cloud.define('hello', function(request) {
  return 'Hello from LeanEngine! Time: ' + new Date();
});

// 定义一个带参数的云函数
AV.Cloud.define('add', function(request) {
  const { a, b } = request.params;
  const result = (parseFloat(a) || 0) + (parseFloat(b) || 0);
  return {
    a: a,
    b: b,
    result: result,
    message: `${a} + ${b} = ${result}`
  };
});

// 数据 Hook 示例 - 在保存 Todo 对象之前执行
AV.Cloud.beforeSave('Todo', function(request) {
  const todo = request.object;
  
  // 自动设置创建时间
  if (!todo.get('createdAt')) {
    todo.set('createdAt', new Date());
  }
  
  // 验证标题不能为空
  const title = todo.get('title');
  if (!title || title.trim().length === 0) {
    throw new AV.Cloud.Error('标题不能为空');
  }
  
  // 自动设置完成状态
  if (todo.get('completed') === undefined) {
    todo.set('completed', false);
  }
  
  console.log('即将保存 Todo:', todo.toJSON());
});

// 数据 Hook 示例 - 在保存 Todo 对象之后执行
AV.Cloud.afterSave('Todo', function(request) {
  const todo = request.object;
  console.log('Todo 已保存:', todo.toJSON());
  
  // 这里可以添加保存后的逻辑，比如发送通知等
});

// 定义一个获取统计信息的云函数
AV.Cloud.define('getTodoStats', async function(request) {
  try {
    const query = new AV.Query('Todo');
    const totalCount = await query.count();
    
    const completedQuery = new AV.Query('Todo');
    completedQuery.equalTo('completed', true);
    const completedCount = await completedQuery.count();
    
    return {
      total: totalCount,
      completed: completedCount,
      pending: totalCount - completedCount,
      completionRate: totalCount > 0 ? (completedCount / totalCount * 100).toFixed(2) + '%' : '0%'
    };
  } catch (error) {
    throw new AV.Cloud.Error('获取统计信息失败: ' + error.message);
  }
});