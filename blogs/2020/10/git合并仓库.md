---
title: git合并仓库
date: 2020-10-9 23:36:14  
categories:    
 - Tools    
tags:    
 - Git  
publish: true    
---

## 起因

有时候我们可能想把多个仓库合并在一起

比如一个前端一个后端

但由于创建时没想太多

所以需要弥补一下



## 操作

现在有A仓库和B仓库

我们想把A和B合并在C

A仓库的内容放在C/A文件夹下

B仓库的内容放在C/B文件夹下



### 创建C仓库

在github上操作一下创建仓库

本地拉取下来

`git clone c.git`



### 合并A仓库

```shell
# 在C仓库下添加A仓库的git地址
git remote add A a.git
# fetch
git fetch A
# 拉取A仓库的master分支到本地分支localA
git branch -b localA A/master
# 切换到本地master
git checkout master
# 合并localA到master
git merge localA
# 删除多余的branch和remote
git remote remove A
git branch -d localA
# 但此时我们合并过来的A仓库代码是在根目录，需要移动位置
# 代表将xxx移动到A文件夹下
git mv xxx A
```

移动位置借助powershell遍历

```powershell
# Get-ChildItem . 表示列出当前目录下的文件
# | 管道操作
# ForEach-Object -Process 遍历
Get-ChildItem . | ForEach-Object -Process {
	# 判断文件名字不等于A
	if($_.name -ne 'A'){
		# 执行git mv操作
		git mv $_.name A;
	}
}
```

### 合并B仓库

同上

