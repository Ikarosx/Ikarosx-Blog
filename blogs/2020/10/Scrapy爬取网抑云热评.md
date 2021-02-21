---
title: Scrapy爬取网抑云热评 
date: 2020-10-8 23:13:59   
categories:    
 - Tools    
tags:    
 - Python
 - Scrapy
 - Sad    
publish: true    
---

## 起因
昨天写了python自动签到  
今天  
大概就想试试**网抑云**

## 目标
抓取网易云歌曲点赞1w以上热评

## 思路
爬虫思路基本一致   
就是模拟请求  
研究了一下官网    
发现有api可以直接获取到评论
`https://music.163.com/weapi/comment/resource/comments/get?csrf_token=`

携带两个参数，**params**和**encSecKey**，嗯一看就是加密的

<img src='https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20201008232125.png'>

<img src='https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20201008232032.png'>

有以上基础之后  
我爬取主要思路就是构造出需要的两个参数**params**和**encSecKey**  
然后发起请求  
但首先我们得知道这两个参数如何生成  

## 参数获取
首先我们是可以很容易注意到地址栏是有携带一个**songId**的  
可以大胆猜想获取评论需要参数其中之一就是songId

<img src='https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20201008232555.png'>

我们可以从F12追踪请求调用链  

<img src='https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20201008232731.png'>

可以确定基本是从这个core....js文件发起的  

<img src='https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20201008233218.png'>

从浏览器打开看到做了压缩，我们复制到编辑器格式化一下  
并且通过搜索encSecKey看到只出现了三次  

<img srs='https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20201008233509.png'>

<img src='https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20201008233532.png'>

从两张图可以看出图一是具体生成值的地方  

```javascript
// JavaScript四个关键函数

// 生成长度为a随机字符串
function a(a) {
    var d,
      e,
      b = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      c = "";
    for (d = 0; a > d; d += 1)
      (e = Math.random() * b.length), (e = Math.floor(e)), (c += b.charAt(e));
    return c;
  }
  // AES加密，模式CBC
  function b(a, b) {
    var c = CryptoJS.enc.Utf8.parse(b),
      d = CryptoJS.enc.Utf8.parse("0102030405060708"),
      e = CryptoJS.enc.Utf8.parse(a),
      f = CryptoJS.AES.encrypt(e, c, { iv: d, mode: CryptoJS.mode.CBC });
    return f.toString();
  }
  // RSA加密  
  function c(a, b, c) {
    var d, e;
    return (
      setMaxDigits(131),
      (d = new RSAKeyPair(b, "", c)),
      (e = encryptedString(d, a))
    );
  }
  function d(d, e, f, g) {
    var h = {},
      // 生成随机16位字符串
      i = a(16);
    return (
      // AES加密两次
      // d、g
      (h.encText = b(d, g)),
      (h.encText = b(h.encText, i)),
      // RSA加密   
      // e、f
      (h.encSecKey = c(i, e, f)),
      h
    );
  }
```

从以上代码我们就可以看出i是随机生成的值  
要生成params和encSecKey需要defg四个参数  
但具体是什么参数    
不得而知  
我就卡在了这里  
最后百度了之后  
参考[简书教程](https://www.jianshu.com/p/069e88181488)  
发现可以**打断点**  
最后发现结果确实如教程所说  
efg三个值是固定的  
还有一个是利用参数（songId,limit,offset等）构造起来的json字符串  

<img src='https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20201008234630.png'>

::: tip 两个不同api地址
我在测试的时候发现我获取热评的api地址和教程里不同  
我是  
`https://music.163.com/weapi/comment/resource/comments/get?csrf_token=`  
教程里是   
`http://music.163.com/weapi/v1/resource/comments/R_SO_4_{}?csrf_token=`  
两者的区别是参数d，即需要构造的json字符串不同  
这里需要注意一下，不然会报400错误
:::


## 流程
既然已经知道参数如何生成  
那么就直接用python模拟加密过程即可  
需要的参数只有songId  
我们可以和上次自动签到一样用**requests**模拟  
不过这次我使用**Scrapy**框架来编写代码  
我的基本思路是这样子的：  
从网易云首页出发  
遍历所有的a标签  
①遇到/song?id=就拿到其中的songId  
然后发请求拿到热评  
写入数据库mongodb  
②遇到其他链接就加入爬取队列继续递归获取a标签  

## 代码实现


```shell
# 安装Scrapy
pip install scrapy
# 创界项目
scrapy startproject music163
# 创建spider
scrapy genspider HotComment
```

Scrapy需要编写3部分文件  
- Spider,即我们创建的spider/HotComment.py，主要业务逻辑
- Item，items.py，数据对象
- pipelines.py，管道，用于进行数据清洗，数据保存等操作

这里由于代码较多  
故上传到[github](https://github.com/Ikarosx/Music163Comment)  

::: warning pipelines启用
pipelines编写后生效需要在settings.py设置优先级  
`  
ITEM_PIPELINES = {  
   'Music163Spider.pipelines.HotCommentPipeline': 300,  
   'Music163Spider.pipelines.MongoPipeline': 500,  
}
`
:::

## 运行
```shell
# Music163Spider/Music163Spider目录下
scrapy crawl HotComment 
# 暂时中断
scrapy crawl HotComment -s JOBDIR=crawls/HotComment
# https://docs.scrapy.org/en/latest/intro/tutorial.html
```

## 总结
这种遍历方式无法遍历到所有的歌曲  
也许可以试试id逐个 + 1  
对于js的研究确实没有那么透彻  
加解密原来也可以这么用  

写完了  
好像并不会觉得网抑云哈哈
