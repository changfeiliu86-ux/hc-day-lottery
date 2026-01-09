# 部署指南

## 方案一：使用 ngrok（快速，适合临时使用）

### 步骤：

1. **安装 ngrok**
   ```bash
   # 使用 Homebrew 安装（推荐）
   brew install ngrok/ngrok/ngrok
   
   # 或者从官网下载：https://ngrok.com/download
   ```

2. **注册 ngrok 账号**
   - 访问 https://ngrok.com/ 注册账号
   - 获取 authtoken（在 Dashboard 中）

3. **配置 ngrok**
   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

4. **启动本地服务器**（如果还没启动）
   ```bash
   cd /Users/liuchangfei/HC-Day
   python3 -m http.server 8000
   ```

5. **启动 ngrok**
   ```bash
   ngrok http 8000
   ```

6. **获取公网链接**
   - ngrok 会显示一个公网 URL，例如：`https://xxxx-xxxx.ngrok-free.app`
   - 将这个链接分享给其他人即可访问

**注意**：
- 免费版每次启动 URL 会变化
- 免费版有连接数限制
- 适合临时测试使用

---

## 方案二：部署到 GitHub Pages（推荐，永久免费）

### 步骤：

1. **在 GitHub 上创建仓库**
   - 访问 https://github.com/new
   - 仓库名可以随意，例如：`hc-day-lottery`
   - 选择 Public（公开）
   - 点击 "Create repository"

2. **初始化 Git 并推送代码**
   ```bash
   cd /Users/liuchangfei/HC-Day
   
   # 初始化 Git
   git init
   
   # 添加所有文件
   git add .
   
   # 提交
   git commit -m "Initial commit: HC Day Lottery"
   
   # 添加远程仓库（替换 YOUR_USERNAME 和 YOUR_REPO_NAME）
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   
   # 推送到 GitHub
   git branch -M main
   git push -u origin main
   ```

3. **启用 GitHub Pages**
   - 在 GitHub 仓库页面，点击 "Settings"
   - 左侧菜单找到 "Pages"
   - 在 "Source" 下拉菜单选择 "main" 分支
   - 点击 "Save"

4. **访问网站**
   - 几分钟后，网站可通过以下地址访问：
   - `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`
   - 或者如果仓库名是 `YOUR_USERNAME.github.io`，直接访问：
   - `https://YOUR_USERNAME.github.io/`

**优点**：
- 完全免费
- 永久可用
- URL 固定不变
- 支持 HTTPS
- 可以自定义域名

---

## 方案三：使用其他免费托管服务

### Netlify（推荐）
1. 访问 https://www.netlify.com/
2. 注册账号
3. 直接将文件夹拖拽到 Netlify 部署
4. 获得免费域名，例如：`your-site.netlify.app`

### Vercel
1. 访问 https://vercel.com/
2. 注册账号
3. 连接 GitHub 仓库自动部署
4. 获得免费域名

---

## 当前本地服务器

如果本地服务器正在运行，可以通过以下方式访问：
- 本机：`http://localhost:8000`
- 局域网：`http://10.9.41.18:8000`

