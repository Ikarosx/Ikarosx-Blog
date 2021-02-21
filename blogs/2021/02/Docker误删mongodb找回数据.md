---
title: Docker误删mongodb找回数据
date: 2021-2-21 11:12:42
categories:
 - Docker
tags:
 - mongodb
 - 恢复
publish: true
---

## 起因
**命令写错**，本来应该是start的  
结果按了↑，只改了容器名  
吓坏了，冷静下来后百度了一番   
还是得到了解决方案  



## 解决
::: warning 前提条件
rm删除的时候没有-v    
容器的数据还没有被删除  
:::

```shell
# 找到容器实际存放的位置
# 我这里是/var/lib/docker/volumes
find / -name volumes
# 查看
ls
```
<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora20210221113410.png">

能看到上面有很多文件夹，这些就是数据  
```shell
# 搜索mongodb的数据在哪个文件夹
# 我这里搜索出了几个，说明是我之前建了几个容器
find /var/lib/docker/volumes/ -name *mongo*
# 重新创建容器，使用-v映射，--auth为启用认证（上面如果搜出多个就一个一个试
docker run -d -p 27017:27017 -v /var/lib/docker/volumes/xxxx/_data:/data/db --name mongodb mongo --auth
```
<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora20210221130117.png">

创建完成后即可测试连接了

