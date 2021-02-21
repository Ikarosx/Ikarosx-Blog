---
title: Centos搭建Ftp服务器
date: 2020-10-12 17:31:28
categories:    
 - Tools    
tags:    
 - Ftp  
publish: true    
---

## 起因
舍友录完office的视频  
想要把视频分享给其他的同学  
然后就在研究怎么上传到服务器  
给别人查看  
一开始我们想的是用**scp**命令  
即在服务器上创建一个用户用于上传下载  
后面又**不想让这个用户可以ssh**连接到服务器  
所以我们考虑使用sftp  
并限制不允许ssh登陆   
但是sftp无法用`ftp://xx.xx`这种形式访问  
对使用的人来说有一些不便  
最后研究使用vsftpd自搭ftp服务器

## 搭建环境
```shell
# Centos 7
# 安装vsftpd
yum -y install vsftpd
# 启动
systemctl start vsftpd
# 查看是否启动
ps -ef | grep vsftpd
```

## 配置文件

默认配置文件
`/etc/vsftpd/vsftpd.conf`
我们需要对配置文件做一些修改

### 基本配置
```shell
# 使用ipv4监听，二者二选一,
listen=YES
listen_ipv6=NO
# 默认端口21
listen_port=21
###### 主动模式/被动模式 二选一 ######
## 主动模式
pasv_enable=no

## 被动模式
pasv_enable=yes
# 设置被动模式的端口范围
pasv_min_port=50000
pasv_max_port=50100
# 公网IP
pasv_address=8.210.20.141
```
### 主动模式与被动模式
主动模式是客户端告诉服务器自己要用哪个端口传输数据  
被动模式是服务器告诉客户端自己要用哪个端口传输数据  
在阿里云这种云主机下由于可能被防火墙拦截  
使用被动模式要注意开放范围端口  
并设置好公网IP  


### 匿名用户
```shell
###### 配置匿名用户登陆 ######
# 允许匿名
anonymous_enable=YES
# 允许匿名用户上传文件
anon_upload_enable=YES
# 允许匿名用户创建文件夹
anon_mkdir_write_enable=YES
# 允许匿名用户删除/重命名文件
anon_other_write_enable=YES
# 权限掩码,777-022=755,这样子才有权限
anon_umask=022
# 根目录,实际目录/var/ftp下有pub文件夹,注意/var和/var/ftp的owner必须是root
anon_root=/var/ftp
```

### 本地用户
```shell
###### 配置本地用户登陆 ######
# 根目录可写
allow_writeable_chroot=YES
# 允许本地用户模式
local_enable=YES                
# 设置可写入权限
write_enable=YES                
# 本地用户模式创建文件的umask值
local_umask=022                 
# 参数值为YES即禁止名单中的用户，参数值为NO则代表仅允许名单中的用户
userlist_deny=YES               
# 允许"禁止登陆名单",名单文件为ftpusers与user_list,默认禁止root用户
userlist_enable=YES     
# 限制活动范围，不能访问其他目录
chroot_local_user=YES
# 根目录    
local_root=/var/ftp
```

### 虚拟用户
```shell
### vsftpd.conf ###
# 允许匿名用户
guest_enable=YES
# 要映射到的用户
guest_username=vsftpd
# 配置虚拟用户文件夹
user_config_dir=/etc/vsftpd/vconf

### shell操作 ###
# 创建编辑用户文件
vim /etc/vsftpd/virtusers
# 第一行为用户名，第二行为密码。不能使用root作为用户名 
Ikarosxx
123456

# 生成用户数据文件
db_load -T -t hash -f /etc/vsftpd/virtusers /etc/vsftpd/virtusers.db
# 设定PAM验证文件，并指定对虚拟用户数据库文件进行读取
chmod 600 /etc/vsftpd/virtusers.db 

# 修改前先备份 
cp /etc/pam.d/vsftpd /etc/pam.d/vsftpd.bak
vim /etc/pam.d/vsftpd
# 先将配置文件中原有的 auth 及 account 的所有配置行均注释掉
auth sufficient /lib64/security/pam_userdb.so db=/etc/vsftpd/virtusers 
account sufficient /lib64/security/pam_userdb.so db=/etc/vsftpd/virtusers 
# 如果系统为32位，上面改为lib

# 添加用户，登录终端设为/bin/false，使之不能登录系统
useradd vsftpd -d /home/vsftpd -s /bin/false
chown -R vsftpd:vsftpd /home/vsftpd

mkdir /etc/vsftpd/vconf
cd /etc/vsftpd/vconf

# 这里建立虚拟用户Ikarosxx配置文件
touch Ikarosxx
# 编辑Ikarosxx用户配置文件，内容如下，其他用户类似
vim Ikarosxx

local_root=/home/vsftpd/Ikarosxx/
write_enable=YES
anon_world_readable_only=NO
anon_upload_enable=YES
anon_mkdir_write_enable=YES
anon_other_write_enable=YES

# 建立虚拟用户根目录
mkdir -p /home/vsftpd/Ikarosxx/
```

## Centos使用ftp
```shell
yum -y install ftp
# 查看帮助
man ftp
```

## 关闭SELinux
SElinux会影响Permission denied
为啥我也不知道。。
```shell
# 查看selinux状态
sestatus
# 修改配置文件
vim /etc/selinux/config
# enforcing、permissive、disabled
SELINUX=disabled
# 重启
```


### 总结
对于linux的权限控制和用户管理更加熟悉了一些  
对于ftp的使用也更加深刻  
（感觉像在写实验报告



