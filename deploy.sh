#!/bin/bash

# GitHub Pages 部署脚本
# 使用方法：./deploy.sh YOUR_USERNAME YOUR_REPO_NAME

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "使用方法: ./deploy.sh YOUR_USERNAME YOUR_REPO_NAME"
    echo "例如: ./deploy.sh liuchangfei hc-day-lottery"
    exit 1
fi

USERNAME=$1
REPO_NAME=$2

echo "🚀 开始部署到 GitHub Pages..."
echo ""

# 检查是否已有 remote
if git remote | grep -q origin; then
    echo "⚠️  检测到已有 remote，正在更新..."
    git remote set-url origin https://github.com/${USERNAME}/${REPO_NAME}.git
else
    echo "📦 添加 GitHub remote..."
    git remote add origin https://github.com/${USERNAME}/${REPO_NAME}.git
fi

echo "📤 推送到 GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 部署成功！"
    echo ""
    echo "📝 接下来请："
    echo "1. 访问 https://github.com/${USERNAME}/${REPO_NAME}/settings/pages"
    echo "2. 在 'Source' 下拉菜单选择 'main' 分支"
    echo "3. 点击 'Save'"
    echo "4. 等待几分钟后，访问：https://${USERNAME}.github.io/${REPO_NAME}/"
    echo ""
else
    echo ""
    echo "❌ 推送失败，请检查："
    echo "1. GitHub 仓库是否已创建"
    echo "2. 仓库名称是否正确"
    echo "3. 是否有推送权限"
fi

