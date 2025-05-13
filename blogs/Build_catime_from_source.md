<!--
title: 编译 Catime 指南：从源码构建项目
date: 2025-05-13
description: 本文详细介绍了如何从源代码编译 Catime，包括环境配置、依赖安装、构建流程与常见问题排查。
thumbnail: blogs/Images/catime.webp
tags: [Catime, 编译指南, 构建流程, 开发者文档]
-->



> 如果遇到任何问题，尝试解决无果时，可以[加群](https://qm.qq.com/q/LgscIMw9i0)向群友求助。

##  🪟Windows




### 📥 克隆 Catime 项目源码

在开始配置编译环境前，请先将 Catime 项目代码克隆到本地：

1. **确保已安装 Git 工具**  
   如未安装，请前往 [Git 官网](https://git-scm.com/downloads) 下载并安装。

2. 📥 克隆 Catime 项目源码


   ```bash
   git clone https://github.com/vladelaina/Catime.git
   cd Catime
   ```



### 🛠 一、下载推荐组件（建议使用适用于 64 位 Windows 的最新版本）

| 工具      | 说明                       | 推荐版本（模糊说明）                                         | 下载地址                                                     |
| --------- | -------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **MinGW** | GCC 编译器                 | 类似 `x86_64-<版本号>-release-win32-seh-ucrt-rtv<数字>-rev<数字>.7z` 的版本 | [MinGW Build](https://github.com/niXman/mingw-builds-binaries/releases/latest) |
| **xmake** | 构建工具                   | 类似 `xmake-v<版本号>-win64.exe` 的版本                      | [xmake](https://github.com/xmake-io/xmake/releases/latest)   |
| **upx**   | 可执行文件压缩工具（可选） | 类似 `upx-<版本号>-win64.zip` 的版本                         | [upx](https://github.com/upx/upx/releases/latest)            |



### 📦 二、安装 MinGW

1. **解压 MinGW 到指定位置**
    将 `x86_64-15.1.0-release-win32-seh-ucrt-rtv12-rev0.7z` 解压到：

   ```
   C:\mingw64
   ```

2. **配置系统环境变量 `PATH`**

   - 打开：**控制面板 → 系统 → 高级系统设置 → 环境变量**

   - 在 **系统变量** 中找到 `Path`，点击“编辑”

   - 添加以下路径：

     ```
     C:\mingw64\bin
     ```

3. **验证安装是否成功**
    打开命令行（Win + R → 输入 `cmd` → 回车），输入：

   ```bash
   gcc --version
   ```

   若显示版本号，则安装成功 ✅

------

### 🔧 三、安装 xmake

1. 安装  `xmake-v<版本号>-win64.exe` 
2. 默认会自动配置环境变量（如未配置，可手动添加 `xmake` 安装目录的 `bin` 到 `PATH`）

------

### 📦 四、安装 UPX（可选）

1. 解压 `upx-<版本号>-win64.zip` 到任意目录（推荐如：`C:\Tools\upx`）
2. 添加该路径到环境变量 `PATH`

------

### ✅ 测试 xmake 是否可用

打开命令行输入：

```bash
xmake --version
```

若正常显示版本号，即配置成功 🎉




### 🚀 五、使用 xmake 编译项目

在终端进入项目根目录后，可使用以下命令进行项目的构建和管理：

```bash
xmake           # 编译项目
xmake run       # 编译并运行项目
xmake clean     # 清理构建产物
```

---





## 🐧Ubuntu 

### 📥 克隆 Catime 项目源码



   ```bash
   git clone https://github.com/vladelaina/Catime.git
   cd Catime
   ```

### 🛠 安装构建工具



   ```bash
   sudo apt update && sudo apt install -y mingw-w64 upx-ucl && curl -fsSL https://xmake.io/shget.text | bash
   ```



### 🚀 使用 xmake 编译项目

在项目目录下执行：

```bash
xmake           # 编译项目
xmake run       # 编译并运行项目
xmake clean     # 清理构建产物
```



---



## 🏹 Arch



### 📥 克隆 Catime 项目源码



   ```bash
   git clone https://github.com/vladelaina/Catime.git
   cd Catime
   ```

------

### 🛠 安装构建工具


   ```bash
sudo pacman -Syu --noconfirm mingw-w64 upx xmake
   ```



------

### 🚀 使用 xmake 编译项目

在项目目录下执行：

```bash
xmake           # 编译项目
xmake run       # 编译并运行项目
xmake clean     # 清理构建产物
```
