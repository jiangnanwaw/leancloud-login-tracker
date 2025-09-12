# LeanCloud 用户登录记录追踪系统

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green.svg)](https://nodejs.org/)
[![LeanCloud](https://img.shields.io/badge/LeanCloud-Engine-blue.svg)](https://leancloud.cn/)

一个基于LeanCloud云引擎的用户登录记录追踪系统，自动记录用户登录行为并提供查询接口。

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/你的用户名/leancloud-login-tracker.git
cd leancloud-login-tracker
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，填入你的LeanCloud应用信息
```

### 4. 启动服务
```bash
# 演示模式（无需LeanCloud配置）
npm run demo

# 完整模式（需要LeanCloud配置）
npm start
```

## 功能特性

- ✅ 自动记录用户登录时间
- ✅ 记录登录IP地址
- ✅ 识别登录平台（iOS/Android/Windows/macOS/Linux）
- ✅ 记录设备信息（User-Agent）
- ✅ 提供云函数查询接口
- ✅ 支持用户查看个人登录历史
- ✅ 支持管理员查看所有用户登录统计

## 部署步骤

### 1. 准备工作

1. 确保你有一个LeanCloud应用
2. 获取应用的App ID、App Key和Master Key
3. 在LeanCloud控制台创建`LoginRecord`表

### 2. 本地测试

1. 安装依赖：
```bash
npm install
```

2. 配置环境变量：
编辑`.env`文件，填入你的LeanCloud应用信息：
```
LEANCLOUD_APP_ID=你的APP_ID
LEANCLOUD_APP_KEY=你的APP_KEY
LEANCLOUD_APP_MASTER_KEY=你的MASTER_KEY
```

3. 启动本地服务：
```bash
npm run dev
```

4. 打开浏览器访问测试页面：
```
http://localhost:3000
```

### 3. 部署到LeanCloud云引擎

#### 方法一：使用命令行工具

1. 安装LeanCloud CLI：
```bash
npm install -g leancloud-cli
```

2. 登录：
```bash
lean login
```

3. 切换到项目目录并部署：
```bash
lean switch
lean deploy
```

#### 方法二：使用Git部署

1. 在LeanCloud控制台 → 云引擎 → 部署 → Git部署
2. 填入你的Git仓库地址
3. 设置环境变量
4. 点击部署

### 4. 设置环境变量

在LeanCloud控制台 → 云引擎 → 设置 → 环境变量中添加：

- `LEANCLOUD_APP_ID`: 你的应用ID
- `LEANCLOUD_APP_KEY`: 你的应用Key
- `LEANCLOUD_APP_MASTER_KEY`: 你的Master Key

## 使用方法

### 1. 客户端SDK集成

在你的客户端应用中，正常使用LeanCloud的登录功能即可：

```javascript
// JavaScript示例
const user = await AV.User.logIn(username, password);
// Hook会自动触发，记录登录信息
```

```swift
// iOS Swift示例
LCUser.logIn(username: username, password: password) { result in
    // Hook会自动触发，记录登录信息
}
```

```java
// Android Java示例
AVUser.logInInBackground(username, password, new LogInCallback<AVUser>() {
    @Override
    public void done(AVUser user, AVException e) {
        // Hook会自动触发，记录登录信息
    }
});
```

### 2. 查看登录记录

#### 方法一：通过云函数查询

```javascript
// 获取当前用户的登录历史
const result = await AV.Cloud.run('getUserLoginHistory', { 
    limit: 10,  // 获取最近10条记录
    skip: 0     // 跳过0条记录
});

console.log(result.data); // 登录历史数组
```

#### 方法二：直接查询数据表

```javascript
const query = new AV.Query('LoginRecord');
query.equalTo('user', AV.User.current());
query.descending('loginTime');
query.limit(10);

const records = await query.find();
```

#### 方法三：在LeanCloud控制台查看

1. 进入LeanCloud控制台
2. 选择「存储」→「LoginRecord」表
3. 查看所有登录记录

## API接口说明

### 云函数接口

#### getUserLoginHistory
获取当前用户的登录历史

**参数：**
- `limit`: 限制返回记录数（可选，默认10）
- `skip`: 跳过记录数（可选，默认0）

**返回：**
```json
{
  "success": true,
  "data": [
    {
      "id": "记录ID",
      "loginTime": "2023-12-07T10:30:00.000Z",
      "ipAddress": "192.168.1.1",
      "platform": "iOS",
      "userAgent": "Mozilla/5.0..."
    }
  ],
  "total": 5
}
```

#### getAllUsersLoginStats
获取所有用户登录统计（需要管理员权限）

**权限要求：** 当前用户的`isAdmin`字段为`true`

**返回：**
```json
{
  "success": true,
  "data": [
    {
      "userId": "用户ID",
      "username": "用户名",
      "email": "邮箱",
      "loginTime": "2023-12-07T10:30:00.000Z",
      "ipAddress": "192.168.1.1",
      "platform": "iOS"
    }
  ]
}
```

## 数据表结构

### LoginRecord 表

| 字段名 | 类型 | 说明 |
|--------|------|------|
| user | Pointer | 指向_User表的用户 |
| loginTime | Date | 登录时间 |
| ipAddress | String | 登录IP地址 |
| userAgent | String | 用户代理字符串 |
| platform | String | 登录平台 |

## 注意事项

1. **权限控制**：确保只有授权用户能查看登录记录
2. **数据隐私**：IP地址等敏感信息需要妥善保护
3. **存储成本**：根据用户活跃度控制记录保存时长
4. **性能优化**：对于大量用户的应用，考虑添加索引和分页

## 扩展功能

可以基于此系统扩展以下功能：

- 异常登录检测（不同地区IP登录）
- 登录统计分析
- 用户活跃度分析
- 安全告警机制
- 登录失败记录

## 故障排除

### 常见问题

1. **Hook没有触发**：检查云引擎是否正确部署，环境变量是否设置
2. **权限错误**：确保使用了Master Key
3. **记录保存失败**：检查表结构是否正确创建

### 调试方法

1. 查看云引擎日志
2. 使用console.log输出调试信息
3. 在LeanCloud控制台查看错误日志