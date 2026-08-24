# 切图大师 / Slice Master

一个不依赖后端的 UI 图标切图工具。上传图片后，识别、透明化处理、单图 PNG 下载和 ZIP 导出都在访问者的浏览器本地执行。

## 本地预览

直接打开 `index.html`，或在本目录启动任意静态 HTTP 服务。

## 持续发布

仓库已配置 GitHub Pages 工作流：任何推送到 `main` 的提交都会触发发布。

首次推送到 GitHub 后，在仓库中完成一次设置：

1. 打开 `Settings` → `Pages`。
2. 在 **Build and deployment** 中选择 **GitHub Actions**。
3. 等待 `Actions` 中的 **Deploy Slice Master to GitHub Pages** 运行成功。

之后的更新流程：

```powershell
git add .
git commit -m "更新切图大师"
git push
```

## 自定义域名

在 GitHub 仓库的 `Settings` → `Pages` 中填写已购买的域名，再按页面提示配置 DNS。不要只在 DNS 服务商里手工增加记录，而不在 GitHub Pages 设置中绑定域名。

## 发布注意事项

- GitHub Pages 是公开访问的；不要把客户截图、测试导出包、密钥或账号资料提交到仓库。
- 本工具处理的用户图片不会被上传到站点服务器，但 GitHub Pages 仍会公开仓库中的站点文件。
