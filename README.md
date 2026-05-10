# Blog Workflow

这个仓库现在按“双分支”发布：

- `source`：唯一需要手动编辑的分支，存放 Astro 源码和 `source/_posts` 文章。
- `master`：GitHub Pages 读取的静态站点分支，由 GitHub Actions 自动生成，不要手动编辑。

## 日常写作

先确保在源码分支：

```bash
git switch source
```

创建新文章：

```bash
npm run new:post -- "文章标题"
```

这会生成：

```text
source/_posts/文章标题生成的-slug.md
```

可选参数：

```bash
npm run new:post -- "文章标题" --slug custom-slug --tags post,ai --thumbnail https://example.com/image.png
```

本地预览：

```bash
npm run dev
```

## 一键发布

写完后运行：

```bash
npm run publish -- "Add new post"
```

这个命令会：

1. 检查当前是否在 `source` 分支。
2. 运行 `npm run build`，先确认站点能正常构建。
3. 自动 `git add -A`、`git commit`。
4. 推送到 `origin/source`。
5. 触发 `.github/workflows/deploy.yml`，由 GitHub Actions 把构建后的 `dist` 发布到 `master`。

如果没有想写 commit message，也可以直接：

```bash
npm run publish
```

发布前想先检查但不提交、不推送：

```bash
npm run publish -- --dry-run
```

## 重要规则

不要在 `master` 分支写文章或改页面。`master` 是部署产物，下一次发布会被自动覆盖。

只记这三条就够了：

```bash
git switch source
npm run new:post -- "文章标题"
npm run publish -- "Update blog"
```
