// 独立版本服务器 - 不依赖LeanCloud后端
require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();

// 内存数据存储
let todos = [
  { id: '1', title: '示例待办事项1', completed: false, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', title: '示例待办事项2', completed: true, createdAt: new Date(), updatedAt: new Date() }
];
let nextId = 3;

// 设置视图引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// 解析JSON请求体
app.use(express.json());

// 云函数模拟端点
app.post('/1.1/functions/hello', (req, res) => {
  res.json({
    result: 'Hello from LeanEngine Demo! Time: ' + new Date().toISOString()
  });
});

app.post('/1.1/functions/add', (req, res) => {
  const { a, b } = req.body;
  const result = (parseFloat(a) || 0) + (parseFloat(b) || 0);
  res.json({
    result: {
      a: a,
      b: b,
      result: result,
      message: `${a} + ${b} = ${result}`
    }
  });
});

app.post('/1.1/functions/getTodoStats', (req, res) => {
  const totalCount = todos.length;
  const completedCount = todos.filter(todo => todo.completed).length;
  
  res.json({
    result: {
      total: totalCount,
      completed: completedCount,
      pending: totalCount - completedCount,
      completionRate: totalCount > 0 ? (completedCount / totalCount * 100).toFixed(2) + '%' : '0%'
    }
  });
});

// Todo API端点
app.get('/todos', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const skip = parseInt(req.query.skip) || 0;
  
  const paginatedTodos = todos.slice(skip, skip + limit);
  
  res.json({
    success: true,
    data: paginatedTodos,
    pagination: {
      limit: limit,
      skip: skip,
      total: todos.length
    }
  });
});

app.post('/todos', (req, res) => {
  const { title, completed = false } = req.body;
  
  if (!title || title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: '标题不能为空'
    });
  }
  
  const newTodo = {
    id: String(nextId++),
    title: title.trim(),
    completed: completed,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  todos.push(newTodo);
  
  res.status(201).json({
    success: true,
    data: newTodo
  });
});

app.get('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === req.params.id);
  
  if (!todo) {
    return res.status(404).json({
      success: false,
      error: 'Todo 不存在'
    });
  }
  
  res.json({
    success: true,
    data: todo
  });
});

app.put('/todos/:id', (req, res) => {
  const { title, completed } = req.body;
  const todo = todos.find(t => t.id === req.params.id);
  
  if (!todo) {
    return res.status(404).json({
      success: false,
      error: 'Todo 不存在'
    });
  }
  
  if (title !== undefined) {
    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: '标题不能为空'
      });
    }
    todo.title = title.trim();
  }
  
  if (completed !== undefined) {
    todo.completed = completed;
  }
  
  todo.updatedAt = new Date();
  
  res.json({
    success: true,
    data: todo
  });
});

app.delete('/todos/:id', (req, res) => {
  const todoIndex = todos.findIndex(t => t.id === req.params.id);
  
  if (todoIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Todo 不存在'
    });
  }
  
  todos.splice(todoIndex, 1);
  
  res.json({
    success: true,
    message: 'Todo 已删除'
  });
});

// 根路由
app.get('/', function(req, res) {
  res.render('index', { 
    currentTime: new Date().toLocaleString('zh-CN'),
    appName: 'LeanEngine Demo (独立版本)'
  });
});

// 健康检查路由
app.get('/health', function(req, res) {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: '独立版本运行正常',
    todosCount: todos.length
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

const PORT = parseInt(process.env.PORT || 8080);

app.listen(PORT, function () {
  console.log('🚀 LeanEngine Demo (独立版本) 运行在端口:', PORT);
  console.log('📱 访问 http://localhost:' + PORT + ' 查看应用');
  console.log('💾 使用内存存储，重启后数据会丢失');
});

module.exports = app;