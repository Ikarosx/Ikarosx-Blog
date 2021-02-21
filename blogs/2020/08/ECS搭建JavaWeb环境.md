---    
title: ECS搭建JavaWeb环境
date: 2020-8-9 15:30:26    
categories:    
 - ECSTraining    
tags:    
 - 环境
 - Java    
publish: true    
---    

## 环境准备

### 免费创建一台临时服务器  

<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200810084202.png">

### SSH登陆

```shell
ssh username@ip
```

<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200810084455.png">

::: tip SSH
SSH可以配置证书登陆  
其中我们在初次访问时有指纹确认，这个是为了防止中间人攻击    
详情可以参考我的另一篇博客[SSH用户认证](http://blog.ikarosx.cn/docs/views/Web/2020/08/SSH%E7%94%A8%E6%88%B7%E8%AE%A4%E8%AF%81.html)
:::

### 安装JDK

```shell
# 查看yum源中JDK版本
yum list java*
# 使用yum安装JDK1.8
# -y 表示对于弹出的提示自动输入y，不必手动输入
yum -y install java-1.8.0-openjdk*
# 查看是否安装成功
java -version
```

<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200810091209.png">
可以看到目前openjdk8版本是8u262  
而查了一下目前oracle jdk8最新是8u261  
这也不难理解，oracle jdk是基于open jdk编写的  

更多OracleJDK和OpenJDK可以查看[StackOverFlow](https://stackoverflow.com/questions/22358071/differences-between-oracle-jdk-and-openjdk?r=SearchResults)

### 安装mysql

```shell
# 安装wget下载mysql官方的Yum Repository
yum -y install wget
# 下载mysql官方的Yum Repository
wget http://dev.mysql.com/get/mysql57-community-release-el7-10.noarch.rpm
# 安装mysql官方的Yum Repository
yum -y install mysql57-community-release-el7-10.noarch.rpm
# 安装mysql-server
yum -y install mysql-community-server
# 启动Mysql数据库
systemctl start mysqld.service
# 查看MySQL初始密码
grep "password" /var/log/mysqld.log
# 登陆mysql
mysql -uroot -p
# 修改MySQL默认密码
set global validate_password_policy=0;  #修改密码安全策略为低（只校验密码长度，至少8位）。
ALTER USER 'root'@'localhost' IDENTIFIED BY '12345678';
# 授予root用户远程管理权限
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';
```

### 安装Tomcat
```shell
# 下载Tomcat压缩包
wget https://mirror.bit.edu.cn/apache/tomcat/tomcat-8/v8.5.57/bin/apache-tomcat-8.5.57.tar.gz
# 解压
tar -xf apache-tomcat-8.5.57.tar.gz 
# 重命名
mv apache-tomcat-8.5.57 /usr/local/Tomcat8.5
# 为sh脚本文件授权
# +x表示执行权限
chmod +x /usr/local/Tomcat8.5/bin/*.sh
# 修改Tomcat默认端口8080为80
# sed 流编辑器，-i是edit in place
sed -i 's/Connector port="8080"/Connector port="80"/' /usr/local/Tomcat8.5/conf/server.xml
# 启动tomcat
/usr/local/Tomcat8.5/bin/./startup.sh
```

### 访问Tomcat
由于配置了Tomcat端口为80，所以直接输入IP即可访问

<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200810102109.png">

### 脚本
为了简便起见我写了一个简单的[脚本](https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/ECS_java_web_env_install.sh)  
脚本没有实现更改mysql密码  
