<!--
title: Git
date: 2025-05-08
description: 提交关键字和一些基本的说明
thumbnail:https://raw.githubusercontent.com/vladelaina/vladelaina/refs/heads/gh-pages/blogs/Images/git.webp
tags: [Git]
-->

## ✅ Git 提交关键字大全

| 关键字      | 表情 | 含义                                                |
| ----------- | ---- | --------------------------------------------------- |
| `feat`      | ✨    | 添加新功能或模块                                    |
| `fix`       | 🐛    | 修复 Bug 或缺陷                                     |
| `docs`      | 📚    | 修改文档（如 README、注释等），不影响代码逻辑       |
| `style`     | 💅    | 代码格式修改（空格、缩进、分号等），不影响逻辑      |
| `refactor`  | ♻️    | 重构代码，优化结构，不新增功能不修 Bug              |
| `remove`    | 🗑️    | 删除功能、模块、代码等                              |
| `perf`      | ⚡    | 性能优化                                            |
| `test`      | ✅    | 添加或修改测试代码                                  |
| `build`     | 🏗️    | 构建相关更改（如打包脚本、构建工具配置）            |
| `ci`        | 🤖    | 持续集成相关更改（如 GitHub Actions、Jenkins 配置） |
| `chore`     | 🔧    | 杂项更改（非功能/修复/测试的任务，如依赖更新）      |
| `revert`    | ⏪    | 回滚某次提交                                        |
| `merge`     | 🔀    | 合并分支操作（通常用于 Git 自动生成的合并提交）     |
| `wip`       | 🚧    | 工作进行中（Work In Progress），功能尚未完成        |
| `temp`      | 🕒    | 临时提交，用于调试或阶段性保存                      |
| `init`      | 🎉    | 初始化项目提交                                      |
| `deps`      | 📦    | 添加或更新项目依赖                                  |
| `config`    | ⚙️    | 配置文件修改（如 tsconfig, eslint, babel 等）       |
| `release`   | 🚀    | 发布新版本或准备版本发布                            |
| `hotfix`    | 🩹    | 紧急修复（通常用于生产环境）                        |
| `upgrade`   | ⬆️    | 升级功能或依赖                                      |
| `downgrade` | ⬇️    | 降级功能或依赖版本                                  |
| `security`  | 🔒    | 修复安全问题                                        |
| `lint`      | 🧹    | Lint 相关更改（如 ESLint 警告修复）                 |
| `ux`        | 🧠    | 用户体验优化                                        |
| `i18n`      | 🌐    | 国际化支持（多语言适配）                            |
| `a11y`      | ♿    | 可访问性优化（Accessibility）                       |
| `typo`      | ✏️    | 拼写修正、文字微调                                  |
| `log`       | 📈    | 日志相关更改                                        |
| `ui`        | 🎨    | 用户界面优化（样式、布局、组件）                    |
| `api`       | 🔌    | 接口相关变更（API 定义、路由、参数等）              |
| `mock`      | 🧪    | 添加或修改 mock 数据                                |
| `env`       | 🌱    | 环境变量更改                                        |

------

✅ **建议使用格式**：

```
<emoji> <type>(scope): message
```

例如：

```
✨ feat(player): add audio catalog and test options
🐛 fix(api): resolve crash on missing token
```



---

# 🚀 Git 基本设置 & 初始化远程仓库指南

## 🛠️ 配置 Git 用户信息

```bash
git config --global user.name "vladelaina"            # 设置用户名
git config --global user.email "vladelaina@gmail.com" # 设置邮箱
```

## 🌱 设置默认主分支为 `main`

```bash
git config --global init.defaultBranch main
```

## 🔐 配置 SSH 密钥（用于 GitHub）

1. 安装 OpenSSH（针对 Arch / Manjaro 用户）：

```bash
sudo pacman -S openssh
```

2. 生成 SSH 密钥：

```bash
ssh-keygen -t rsa -b 4096 -C "vladelaina@gmail.com"
```

📌 **提示**：生成后将公钥添加到 GitHub ➜ Settings ➜ SSH and GPG keys 🔑

## 🔗 添加远程仓库并推送代码

```bash
git remote add origin git@github.com:vladelaina/Catime.git
git push -u origin main
```

🚩 第一次推送使用 `-u` 参数，将 `main` 分支与远程仓库关联。

