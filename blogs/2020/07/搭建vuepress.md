---
title: 搭建VuePress
date: 2020-7-31 18:20:26
categories:
 - ECSTraining
tags:
 - VuePress
publish: true
---

## 默认主题
### 流程
```shell
# yarn安装
yarn global add vuepress
# npm安装
npm install -g vuepress
# 创建一个文件夹
mkdir blog
# 初始化README.md
echo '# Hello VuePress!' > README.md
# 开发环境运行，.表示默认页面路由地址
vuepress dev .
# 构建静态文件
vuepress build .
```
::: danger echo PowerShell乱码
`echo '# Hello VuePress!' > README.md`    
执行这句之后，运行访问出现乱码，这是因为默认PowerShell选择UTF-16编码  
执行下面这句将编码指定为UTF-8   
`$PSDefaultParameterValues['Out-File:Encoding'] = 'utf8'`  
:::

运行完出现的应该就是下面这样子  

<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200805192219.png" style="box-shadow: 1px 1px 20px #888888;">

### 添砖加瓦
这是基本的目录结构，当我们使用
`vuepress dev docs`
所有的访问路径都是基于docs文件夹
```shell
.  
├── docs  
│   ├── .vuepress  # 用于存放全局的配置、组件、静态资源等
│   │   ├── config.js  # 配置文件的入口文件，也可以是 YML 或 toml
│   │   └── public # 静态资源目录
│   └── README.md # 默认页面
└── package.json  

3 directories, 4 files  
```

下面我们修改一下README.md主页
```markdown
---
home: true
heroImage: /hero.png
heroText: Hero 标题
tagline: Hero 副标题
actionText: 快速上手 →
actionLink: /zh/guide/
features:
- title: 简洁至上
  details: 以 Markdown 为中心的项目结构，以最少的配置帮助你专注于写作。
- title: Vue驱动
  details: 享受 Vue + webpack 的开发体验，在 Markdown 中使用 Vue 组件，同时可以使用 Vue 来开发自定义主题。
- title: 高性能
  details: VuePress 为每个页面预渲染生成静态的 HTML，同时在页面被加载的时候，将作为 SPA 运行。
footer: MIT Licensed | Copyright © 2018-present Evan You
---
```

就能看到下面的效果


<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200805212023.png" style="box-shadow: 1px 1px 20px #888888;">

然后再docs下新建文件夹或者新建md文件  
然后访问对应的路径，就可以访问到文件  
比如以下目录  
```shell
.
├── README.md  
├── docs  
│   ├── .vuepress  
│   │   ├── config.js  
│   │   └── public  
│   ├── 2020  
│   │   └── b.md  
│   ├── README.md  
│   └── a.md  
└── package.json  

4 directories, 6 files  
```
<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200805212828.png" style="box-shadow: 1px 1px 20px #888888;" >
<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200805212901.png" style="box-shadow: 1px 1px 20px #888888;" >


## Reco主题

::: tip 主题
如果你和我一样不擅长前端开发的话  
使用现成的主题也不失为一个好的方案  
这里选择了Reco  
:::

### 安装

```shell
# 全局安装reco提供的cli工具，比较方便
npm install @vuepress-reco/theme-cli -g
# 项目初始化,跟着他的操作来就可以了
# 最后有一个style的选择,我三个都试了,没发现什么区别
theme-cli init
```
::: tip theme-cli无法找到
没有配置npm全局包的环境变量  
npm config list查看prefix =后面的值  
将其加入环境变量即可  
:::

```shell
# 进入你刚刚创建的文件夹
cd blog   
# 安装依赖
npm install
```

### 运行

```shell
# 开发环境
npm run dev
# 编译
npm run build
```
运行起来之后就能看到跟我这个博客一样的界面了
### 配置
主要是针对`.vuepress/config.js`的修改  
[官网](https://www.vuepress.cn/guide)和[主题](https://vuepress-theme-reco.recoluan.com/views/1.x/)的文档都非常详细，建议参考官方文档
### 采坑
#### 热加载
启动之后一直无法热加载，网上说的是md文件可以，config.js不行
但我md文件也不行  
最后在[issue](https://github.com/vuejs/vuepress/issues/221)上找到了答案  
```shell
vuepress dev . --host localhost
```
::: warning
注意不能写在package.json的script里，无法生效  
要直接运行vuepress dev . --host localhost
:::
#### build
我还在想build之后我们是如何更新新的文章  
结果发现其实需要我们手动去替换新生成的文件  
这里我们可以使用脚本来解决  
```shell
# upload.sh
# 先删除本地文件
rm -rf blog
# 编译
vuepress build .
# 编译之后是public，我们重命名为想要的文件名
mv public blog
# 使用scp -r上传
scp -r blog root@ikarosx.cn:/usr/share/nginx/yps/html/
```
我用这种做法是因为我是将网站部署在自己的云服务器  
如果你是部署在github可以参考[官方](https://www.vuepress.cn/guide/deploy.html#github-pages)
::: tip scp乱码
更改为git带的scp命令  
可以用Get-Command查看命令地址，类似于which  
2021-2-20 22:22:51更新

:::


### 插件
有很多好用的插件,比如[评论](https://valine.js.org/vuepress.html)、[背景音乐](https://github.com/vuepress-reco/vuepress-plugin-bgm-player)

<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200805213501.png" style="box-shadow: 1px 1px 20px #888888;">

下面是我的配置文件
```javascript
plugins: [
    [
      'vuepress-plugin-comment',
      {
        choosen: 'valine', 
        // options选项中的所有参数，会传给Valine的配置
        options: {
          el: '#valine-vuepress-comment',
          // 需要去注册，很简单
          appId: 'your app Id',
          appKey: 'your app Key'
        }
      }
    ],
    [
      '@vuepress-reco/vuepress-plugin-bgm-player',
      {
        audios: [
          {
            name: '野孩子',
            // bgm目录放在.vuepress/public下
            url: '/bgm/杨千嬅 - 野孩子.mp3',
            cover: '/bgm/1.jpg'
          }
        ]
      }
    ]
  ],
```
