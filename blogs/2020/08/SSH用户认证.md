---
title: SSH用户认证
date: 2020-8-1 15:29:40
categories:
 - Web
tags:
 - Git
 - SSH
publish: true
---

::: tip
昨天发的搭建vuepress，用到了scp来上传到云服务器  
于是打算发一篇SSH登陆的  
虽然以前也有用过  
但不是很熟悉  
:::

## 预备知识
### 两种级别的安全验证
SSH有两种级别的安全验证
-   基于口令
-   基于密钥

### 非对称加密
非对称加密有两个密钥：公钥和私钥    
公钥加密的需要用私钥解密  
私钥加密的需要用公钥解密  


## 登陆命令  
```shell
# 如果没有配置SSH密钥，回车后需要输入账号的密码
ssh 用户名@主机
```
## 口令登陆原理
<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/SSH%E5%AF%86%E7%A0%81%E7%99%BB%E9%99%86%E5%8E%9F%E7%90%86.png"/>

## 密钥登陆原理
<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/SSH%E5%85%8D%E5%AF%86%E7%99%BB%E9%99%86%E5%8E%9F%E7%90%86.png"/>

## 生成公私钥
```shell
# -t指定密钥算法，-C为备注
ssh-keygen -t rsa -C "youemail@xx.com"
# 然后会让你是否输入私钥的密码，测试用可以不输入
```
::: warning 私钥密码
不设置的时候，ssh可以直接免密登陆,但得确保证书不泄露  
设置的时候，ssh需要输入私钥密码(**不是用户密码**)     
:::
生成的文件默认放在了`~/.ssh/`下
-   id_rsa 
-   id_rsa.pub

## 证书登陆部署公钥到服务器
### 手动追加文件
把公钥追加到~/.ssh/authorized_keys文件里  
上传公钥到服务器,用命令`cat id_rsa.pub >> authorized_keys`
### ssh-copy-id
```shell
# -i指定你的公钥文件目录，后面跟上你要指定的用户名和服务器
# 如果windows下命令未找到，可以尝试使用wsl里的命令
# 我能在git上找到对应的命令，但无法运行，可能是不支持？
ssh-copy-id -i ~/.ssh/id_rsa.pub ikarosx@ikarosx.cn
```
::: tip 服务器如何寻找authorized_keys
根据你选择的用户名,找到服务器对应用户下的.ssh目录的authorized_keys  
如果不指定用户名，会先去`~/.ssh/config`找  
如果没有找到，就会使用当前登录用户作为用户名
:::

## 登录
部署公钥到服务器之后就可以使用证书登陆了
```shell
ssh Ikarosx@ikarosx.cn
```

### 中间人攻击
使用口令登陆可能存在中间人攻击
<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/SSH%E4%B8%AD%E9%97%B4%E8%80%85.png"/>

#### 指纹验证
在第一次连接的时候会有一个提示
>The authenticity of host 'xxxxx' can't be established.  
ECDSA key fingerprint is SHA256:+0HbtPMHKf/OpdTOi4ze9yxz99YC37VtCH+6K8Re9kE.  
Are you sure you want to continue connecting (yes/no)?

这个就是让我们确认这个主机的指纹是否是正确的
::: tip 指纹哪里来
指纹是来自服务器的ECDSA公钥指纹
我们可以通过下面命令自己校验一下
```shell
# -E可以指定算法,-l为查看指纹,-f指定文件 服务器的公钥存放在/etc/ssh里
ssh-keygen -lf /etc/ssh/ssh_host_ecdsa_key.pub
```
:::

当我们输入yes的时候即表示信任该服务器  
然后就会存放入`~/.ssh/known_hosts`里

## .ssh

### config
我们在`.ssh/`下新建文件`config`  
对其进行配置，以满足我们多样化的需求  
默认情况下，不指定`-i`证书位置    
会按顺序找下面几个文件，如果都不满足则要求你输入登陆密码
- ~/.ssh/id_rsa
- ~/.ssh/id_dsa
- ~/.ssh/id_ecdsa
- ~/.ssh/id_ed25519


默认情况下不管我们连接哪台服务器都会去找几个私钥  
那么当我们想要为多个服务器配置多个密钥就可以用config来指定  

```shell
# 别名，即@之后的名字，如果@之后的是ikarosx1.cn，就会找到这里的HostName，这是实际访问的主机
Host ikarosx1.cn
    # 当ssh命令为ssh ikarosx.cn时会先来config找这里的User，找不到才是当前登陆用户
    User Ikarosx
    # 实际主机名
    HostName ikarosx.cn
    # 证书位置
    IdentityFile ~/.ssh/ikarosx/id_rsa

Host github.com
    User Ikarosx
    HostName github.com
    IdentityFile ~/.ssh/github/id_rsa
```
### known_hosts
存放信任的主机

## 结语
-   本文所描述的是认证阶段，前面应该还有版本协商、算法协商和通过DH算法来交换密钥的过程
-   中间人攻击会发生在第一次连接的时候，所以要确保指纹验证是正确的
-   SSL和SSH有点类似，但SSH是人工验证指纹，而SSL使用的是CA机构来认证