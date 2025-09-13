# LeanEngine Demo

这是一个 LeanCloud 云引擎示例项目，演示了如何创建和部署云引擎应用。

## 功能特性

- ✅ 云函数示例 (hello, add, getTodoStats)
- ✅ 数据 Hook 示例 (beforeSave, afterSave)
- ✅ REST API 示例 (Todo CRUD)
- ✅ Web 界面测试工具
- ✅ 健康检查端点

## 本地开发

1. 安装依赖：
```bash
npm install
```

2. 设置环境变量（创建 .env 文件）：
```
LEANCLOUD_APP_ID=your_app_id
LEANCLOUD_APP_KEY=your_app_key
LEANCLOUD_APP_MASTER_KEY=your_master_key
LEANCLOUD_APP_PORT=3000
```

3. 启动开发服务器：
```bash
npm run dev
```

4. 访问 http://localhost:3000

## API 端点

### 云函数
- `POST /1.1/functions/hello` - 简单的问候函数
- `POST /1.1/functions/add` - 加法计算函数
- `POST /1.1/functions/getTodoStats` - 获取 Todo 统计信息

### REST API
- `GET /todos` - 获取 Todo 列表
- `POST /todos` - 创建新 Todo
- `GET /todos/:id` - 获取单个 Todo
- `PUT /todos/:id` - 更新 Todo
- `DELETE /todos/:id` - 删除 Todo
- `GET /health` - 健康检查

## 部署到 LeanCloud

1. 创建 LeanCloud 应用
2. 启用云引擎服务
3. 使用 Git 部署：
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-leanengine-git-url>
git push origin master
```

## 项目结构

```
leanengine-demo/
├── server.js          # 主服务器文件
├── cloud.js           # 云函数定义
├── package.json       # 项目配置
├── routes/
│   └── todos.js       # Todo API 路由
└── views/
    └── index.html     # 主页面
```