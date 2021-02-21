---    
title: 搭建Wiki知识库    
date: 2020-8-5 22:08:44    
categories:    
 - ECSTraining    
tags:    
 - Wiki    
publish: true    
---    
    
## 环境准备    
基于LAMP，为了开发方便      
采用docker部署环境    
    
### 安装docker    
这是我编写的安装[docker脚本](https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/docker_install_Ikarosx.sh),大家可以使用/参考    
::: danger docker_install_Ikarosx.sh    
本脚本仅适用于CentOS使用      
另外里面有一个初始化服务器的选项      
包括了      
1. 关闭SELINUX      
2. 更换yum源为阿里云      
**请注意有需要才使用**    
:::    
    
### 获取镜像    
    
```shell    
# 搜索lamp相关镜像，--filter=stars=10表示过滤出stars>=10的镜像    
docker search --filter=stars=10 lamp    
# 从下面图片可以看到哪个是收藏数最多的，把它pull下来    
docker pull mattrayner/lamp    
```    
    
<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200805222221.png">    
    
查看[mattrayner/lamp说明](https://hub.docker.com/r/mattrayner/lamp)      
::: details mattrayner/lamp说明    
Using the image    
# On the command line    
This is the quickest way        

```shell      
# Launch a 18.04 based image        
docker run -p "80:80" -v ${PWD}/app:/app mattrayner/lamp:latest-1804    
    
# Launch a 16.04 based image    
docker run -p "80:80" -v ${PWD}/app:/app mattrayner/lamp:latest-1604    
    
# Launch a 14.04 based image    
docker run -p "80:80" -v ${PWD}/app:/app mattrayner/lamp:latest-1404  
```

# With a Dockerfile  

```shell 
FROM mattrayner/lamp:latest-1804    
    
# Your custom commands    
    
CMD ["/run.sh"]    
```

# MySQL Databases    
By default, the image comes with a root MySQL account that has no password. This account is only available locally, i.e. within your application. It is not available from outside your docker image or through phpMyAdmin.    
    
When you first run the image you'll see a message showing your admin user's password. This user can be used locally and externally, either by connecting to your MySQL port (default 3306) and using a tool like MySQL Workbench or Sequel Pro, or through phpMyAdmin.    
    
If you need this login later, you can run docker logs CONTAINER_ID and you should see it at the top of the log.    
    

## Creating a database    
So your application needs a database - you have two options...    
    
1. PHPMyAdmin    
2. Command line    
### PHPMyAdmin    
Docker-LAMP comes pre-installed with phpMyAdmin available from http://DOCKER_ADDRESS/phpmyadmin.    
    
**NOTE**: you cannot use the root user with PHPMyAdmin. We recommend logging in with the admin user mentioned in the introduction to this section.    
    
### Command Line    
First, get the ID of your running container with docker ps, then run the below command replacing CONTAINER_ID and DATABASE_NAME with your required values:    
    
`docker exec CONTAINER_ID  mysql -uroot -e "create database DATABASE_NAME"`  

# Adding your own content    
The 'easiest' way to add your own content to the lamp image is using Docker volumes. This will effectively 'sync' a particular folder on your machine with that on the docker container.    
    
The below examples assume the following project layout and that you are running the commands from the 'project root'.    

```text    
/ (project root)    
/app/ (your PHP files live here)    
/mysql/ (docker will create this and store your MySQL data here) 
```   
In english, your project should contain a folder called app containing all of your app's code. That's pretty much it.    
    
## Adding your app    
The below command will run the docker image mattrayner/lamp:latest interactively, exposing port 80 on the host machine with port 80 on the docker container. It will then create a volume linking the app/ directory within your project to the /app directory on the container. This is where Apache is expecting your PHP to live.    
    
`docker run -i -t -p "80:80" -v ${PWD}/app:/app mattrayner/lamp:latest`    
## Persisting your MySQL    
The below command will run the docker image mattrayner/lamp:latest, creating a mysql/ folder within your project. This folder will be linked to /var/lib/mysql where all of the MySQL files from container lives. You will now be able to stop/start the container and keep your database changes.    
    
You may also add -p 3306:3306 after -p 80:80 to expose the mysql sockets on your host machine. This will allow you to connect an external application such as SequelPro or MySQL Workbench.    
    
`docker run -i -t -p "80:80" -v ${PWD}/mysql:/var/lib/mysql mattrayner/lamp:latest`    
## Doing both    
The below command is our 'recommended' solution. It both adds your own PHP and persists database files. We have created a more advanced alias in our .bash_profile files to enable the short commands ldi and launchdocker. See the next section for an example.    
    
`docker run -i -t -p "80:80" -v ${PWD}/app:/app -v ${PWD}/mysql:/var/lib/mysql mattrayner/lamp:latest`    
:::    
> 可以得知以下信息
> 1. mysql root默认无密码，但只能本地使用
> 2. 在第一次运行镜像的时候可以看到生成的mysql账号admin的密码
> 3. 如果密码忘了可以通过查看docker日志docker logs lamp
> 4. PHPAdmin访问地址http://DOCKER_ADDRESS/phpmyadmin
> 5. 创建容器可以使用根据自己的要求，持久化mysql/php
> 6. 如果要添加自己的应用，放在根目录下的app即可

### 使用镜像
```shell
# 运行容器 -p映射端口，-v映射数据卷，--name指定名字为lamp，-d守护模式运行
docker run -p 80:80 -v ${PWD}/app:/app --name lamp -d mattrayner/lamp
# 查看容器日志，寻找mysql密码
docker logs lamp | grep connect
```
<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200805230224.png">

现在就可以访问你的phpadmin了  
http://DOCKER_ADDRESS/phpmyadmin  
账号为admin，密码为你刚才从docker日志查看到的  
<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200805230547.png">

## 安装MediaWiki
[下载](https://releases.wikimedia.org/mediawiki/1.29/mediawiki-1.29.1.tar.gz)
```shell
# 下载文件到你刚才映射的app文件夹
wget https://releases.wikimedia.org/mediawiki/1.29/mediawiki-1.29.1.tar.gz -O ~/app/mediawiki-1.29.1.tar.gz
# 解压
tar xf mediawiki-1.29.1.tar.gz 

```
现在就可以访问你的wiki了
<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200805231115.png">
当然还需要配置
1. 点击set-up
2. 继续继续继续
3. 直到输入数据库那里填一下账号密码
4. 继续继续继续

最后出现了下载LocalSettings.php  
<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200805231358.png">  

我们利用scp/其他工具上传到服务器上,将其放置在**app/mediawiki-1.29.1**文件夹下    
然后点击**进入您的wiki**  
然后就能看到首页了  
<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200805231746.png">

右上角可以登录  
然后点击页面可以编辑  
访问一个新的词条可以创建词条  

## 结语
::: warning app
这是我第二次搭建了  
我第一次搭建的时候没认真看文档  
直接把项目放在了/var/www/里  
这次看文档很好奇为什么放在/app里也可以  
然后ll一看发现其实是用了软链接  
:::
<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200805223830.png">    

::: warning DockerFile
我们可以使用docker history 来查看DockerFile  
`docker history --no-trunc mattrayner/lamp`
:::