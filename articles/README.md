# 切图大师文章发布说明

文章是纯静态页面：新增或修改文件后提交到 `main` 分支，GitHub Pages 会自动发布。

## 新增一篇文章

1. 复制任意文章目录（例如 `how-to-extract-icons`）并改为英文短链接，例如 `icon-export-checklist`。
2. 修改文章的 `<title>`、`meta description`、canonical URL、Open Graph 信息和 JSON-LD 中的标题、摘要、发布日期、URL。
3. 在 `articles/index.html` 新增一张文章卡片，并在首页 `index.html` 的“文章动态”区域决定是否展示为最新文章。
4. 在 `sitemap.xml` 增加该文章 URL；提交后检查 `https://www.slicemaster.com.cn/articles/<slug>/`。

## 发布质量检查

- 使用真实、明确的标题和摘要，不夸大工具能力。
- 正文至少说明问题、方法和可执行建议，并链接回首页工具。
- URL 使用小写英文和连字符；不要改动已发布文章 URL。
- 有封面图时，为图片提供描述性 `alt` 文本，并在页面中指定宽高。
