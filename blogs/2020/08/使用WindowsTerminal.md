---
title: 使用WindowsTerminal
date: 2020-8-2 07:59:31
categories:
 - Others
tags:
 - Terminal
 - Shell
publish: true
---

::: tip 参考来源
https://docs.microsoft.com/zh-cn/windows/terminal/
:::

## 为什么要用
- 方便，可以多个标签页管理，在同一页面上分割窗口，而且每安装一种Shell都会自动添加  
- 可DIY性高，包括但不限于自定义文本、颜色、背景和快捷键绑定等  
- 反正安装也不难，就尝尝鲜  

## 安装
-   Windows Store 搜索Windows Terminal(**官方推荐**)
-   [github Release](https://github.com/microsoft/terminal/releases)

## 使用
点击上方下箭头打开设置

### 配置文件
可以给单独的配置文件配置或者所有   
- 写在`profiles -> defaults`里，则设置会应用在所有Shell中  
- 写在`profiles -> list`里某个配置文件中，则只会对该Shell生效  

### SSH
我们可以自己增加一个配置文件来实现连接到SSH并提供
<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200802085158.png" />

::: tip Guid
增加配置文件需要Guid  
我们可以在Powershell中使用`[guid]::NewGuid()`来生成
:::

```json
{
    "profiles": {
        "defaults": {
        },
        "list": [
            {
                // guid
                "guid": "{8662eada-80fb-4fd3-8a69-fbcd1f2a63b8}",
                "hidden": false,
                // 下拉菜单中出现的名字
                "name": "阿里云",
                // 如果是口令登陆可以配置-p密码,如果不配置-p则登陆时手动输入
                "commandline": "ssh root@xxx.com -p123456",
                // 图标
                "icon":"https://img.alicdn.com/tfs/TB1_ZXuNcfpK1RjSZFOXXa6nFXa-32-32.ico"
            },
            {
                "guid": "{2070ddc9-9462-4845-a44d-7cb3aa1dbca6}",
                "hidden": false,
                "name": "华为云",
                // 如果配置了密钥登陆则可以直接登录/输入私钥密码
                "commandline": "ssh root@xxx.com",
                "icon":"https://res-static2.huaweicloud.com/content/dam/cloudbu-site/archive/commons/web_resoure/framework/favicon/favicon.ico"
            }
        ]
}
```


### 背景图

`"backgroundImage": "C:\\Users\\x5322\\Pictures\\Saved Pictures\\bg.png"`

<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200802081839.png" />

### 自定义主题/copy主题

将主题配置diy/copy在`schemes`里  
然后在配置文件里引用，比如`"colorScheme": "Frost"`
如果不想自己diy可以下面网址上获取  
https://atomcorp.github.io/themes/

### 绑定快捷键

写在`keybindings`里
```json
// 使用快捷键 <kbd>Alt</kbd>+f4 关闭终端窗口
{ "command": "closeWindow", "keys": "<kbd>Alt</kbd>+f4" }
```


```json
// 使用快捷键 <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+1 在终端中打开一个新选项卡
{ "command": { "action": "newTab", "index": 0 }, "keys": "<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+1" }
```

更多参考[官网配置](https://docs.microsoft.com/zh-cn/windows/terminal/customize-settings/key-bindings)

### 常用快捷键
-   <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>W</kbd> 关闭当前标签页
-   <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>T</kbd> 新建标签页
-   <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>index</kbd> 打开对应索引的标签页
-   <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>D</kbd> 切割当前窗口，方向按最长的方向
-   <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>±</kbd> 切割当前窗口，指定方向切割
-   <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>F</kbd> 搜索
-   <kbd>Alt</kbd> + <kbd>Enter</kbd> 全屏 (有那味了
-   <kbd>Alt</kbd> + <kbd>↑↓←→</kbd> 移动窗格焦点
-   <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>↑↓←→</kbd> 调整窗格大小
-   <kbd>Ctrl</kbd> + <kbd>±/滚轮</kbd> 字体缩放
-   <kbd>Ctrl</kbd> + <kbd>0</kbd> 重置字体
-   <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>滚轮</kbd> 调整不透明度

### Powerline 
> Powerline 提供自定义的命令提示符体验，提供 Git 状态颜色编码和提示符。

#### 安装
```shell
# 如果下载速度过慢可以使用`-Proxy uri` 来使用代理
# Posh-Git 将 Git 状态信息添加到提示，并为 Git 命令、参数、远程和分支名称添加 tab 自动补全
# -Scope如果要为所有用户安装，使用AllUsers（需管理员权限
Install-Module posh-git -Scope CurrentUser
# Oh-My-Posh 为 PowerShell 提示符提供主题功能
Install-Module oh-my-posh -Scope CurrentUser

# 如果使用的是PowerShell Core，还要安装 PSReadline：
Install-Module -Name PSReadLine -Scope CurrentUser -Force -SkipPublisherCheck
```

#### 自定义 PowerShell 提示符
>根据下图找到对应的PowerShell配置文件  
比如`C:\Users\x5322\Documents\WindowsPowerShell\profile.ps1`  

<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200802102127.png" />

然后把下面这部分追加到文件末尾
```shell
# 自定义 PowerShell 提示符
Import-Module posh-git
Import-Module oh-my-posh
# 设置主题，可以是[其他的](https://github.com/JanDeDobbeleer/oh-my-posh#themes)
Set-Theme Paradox
```

此时你打开PowerShell看到的应该就是新的界面了
<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200802102807.png"/>

#### 设置字体
>上图看到的其实是不完整的，因为主题里用到了很多字形  
而我们自带的字体通常不支持这些字形  
所以我们要另外下载  
这里使用官方推荐的[Cascadia Code PL](https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/CascadiaCode-2007.01.zip)  
这里我用了自己的链接，大家也可以去github[下载](https://github.com/microsoft/cascadia-code/releases)  
下载安装后在WindowsTerminal的配置文件里设置FontFace  
`"fontFace":"Cascadia Code PL"'

<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200802103352.png" />

对比一下Git目录
没有使用Cascadia Code PL
<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200802103535.png" />

使用Cascadia Code PL
<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200802103619.png" />

#### Anaconda
如果你使用了Anaconda，那么会出现下面这种情况

<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200802103813.png" />

这是由于Anaconda他这个环境的图标不包含在Cascadia Code PL这个字体里，我们需要找另外的字体  
比如这个[Caskaydia Cove Regular Nerd Font Complete.ttf](https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/Caskaydia%20Cove%20Regular%20Nerd%20Font%20Complete.ttf)

安装完记得修改WindowsTerminal的字体  
`"fontFace": "CaskaydiaCove Nerd Font"`

<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200802104054.png" />

#### VS Code 
>如果你使用了VS Code  
需要配置一下终端的字体  

`"terminal.integrated.fontFamily": "CaskaydiaCove Nerd Font,YaHei Consolas Hybrid"`

<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200802104234.png">

#### WSL ubuntu
请参考[官方文档](https://docs.microsoft.com/zh-cn/windows/terminal/tutorials/powerline-setup#set-up-powerline-in-wsl-ubuntu)

## 结语
酸爽。。  
因为Anaconda的原因一直以为配置PowerLine失败  
不过也是学到了很多吧  
看issue很重要.jpg

