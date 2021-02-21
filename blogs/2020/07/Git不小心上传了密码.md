---
title: Git不小心上传了密码
date: 2020-07-24 15:33:31
categories:
 - Web
tags:
 - Git
publish: true
---


::: tip
解决思路：对于每一个版本都删除，然后上传版本覆盖远程仓库的版本
:::


## 本地删除

`git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch src/main/resources/application.yaml' --prune-empty --tag-name-filter cat -- --all`

可能遇到

`Cannot rewrite branches: You have unstaged changes`

解决：执行`git stash`

## 覆盖远程仓库

覆盖所有的branch和tags

`git push origin --force --all`

`git push origin --force --tags`

## 强制解除对本地存储库中的所有对象的引用和垃圾收集

- git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin
- git reflog expire --expire=now --all
- git gc --prune=now