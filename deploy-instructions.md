# LeanCloud 云引擎部署说明

## 项目结构修复完成

已修复 "无法判断项目类型" 的错误：
- ✅ 添加了 leanengine.yaml 配置文件
- ✅ 优化了 package.json 结构
- ✅ 调整了服务器代码以适配云环境
- ✅ 文件已移动到根目录

## 部署方式

### 方式1：Git 部署（推荐）
1. 进入 LeanCloud 控制台
2. 应用 ID: N4KUUvF2eY8wOG0sF5oddkdC-gzGzoHsz
3. 云引擎 → 部署 → Git 部署
4. 仓库: https://github.com/jiangnanwaw/leancloud-login-tracker.git
5. 分支: master
6. 点击"部署"

### 方式2：ZIP 包上传
如果 Git 部署失败，可以：
1. 将项目文件打包为 ZIP
2. 在云引擎控制台选择"ZIP 包部署"
3. 上传并部署

## 项目配置

### 环境变量（自动配置）
- LEANCLOUD_APP_ID: N4KUUvF2eY8wOG0sF5oddkdC-gzGzoHsz
- LEANCLOUD_APP_KEY: xtsTJ4R0uMAJCjCJJvNcwsHt
- LEANCLOUD_APP_MASTER_KEY: IXFFOzAOWtlOUHRPON33yGL0

### 启动配置
- 运行时: Node.js
- 启动命令: npm start
- 入口文件: server.js
- 内存: 256M

## 测试 URL

部署成功后，您的应用将在以下地址可用：
- 云引擎域名（LeanCloud 提供）
- 自定义域名（如已配置）

## 功能验证

部署后请测试：
1. 首页 `/` - Web 界面
2. 健康检查 `/health` 
3. 云函数 `/1.1/functions/hello`
4. API 端点 `/todos`