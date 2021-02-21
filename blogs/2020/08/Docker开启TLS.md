---    
title: Docker开启TLS
date: 2020-8-12 20:15:50
categories:    
 - Container    
tags:    
 - Docker   
 - Security 
publish: true    
---    

## 起因

因为要使用maven打包SpringBoot项目为docker镜像并上传到远程服务器  
跟着教程开了2375端口  
结果在某一天收到了告警  
cpu占用100%  
交了工单后  

<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200812123117.png">

给大佬点赞  
给菜鸡踩踩（我）

默认开启2375端口是无认证的，这样子就很不安全  
实际上我们应该使用TLS传输并使用CA认证

## 目标
开启docker TLS

## 生成CA密钥和证书

```shell
# 创建CA证书私钥
# genrsa 生成rsa私钥
# -aes256 指定加密方式为aes256
# -out 输出文件名   
# 4096 生成4096bit的私钥
openssl genrsa -aes256 -out ca-key.pem 4096
# 根据私钥创建CA证书
# req 证书请求和生成的工具
# -new 生成一个新的证书请求，提示让用户输入相关的字段，字段的配置在配置文件和其他的扩展里
# -x509 输出自签证书而不是证书请求
# -days 当使用-x509选项时，此选项指定要为其验证证书的天数。默认值为30天
# -key 指定要读取私钥的地方
# -sha256 指定用于签名的摘要算法，可以使用openssl dgst -h 查看所有可用的
openssl req -new -x509 -days 365 -key ca-key.pem -sha256 -out ca.pem
```

## 生成服务器密钥和证书签名请求(CSR)

```shell
# 生成服务器私钥
openssl genrsa -out server-key.pem 4096
# 生成证书签名请求(CSR)
openssl req -sha256 -new -key server-key.pem -out server.csr
```

## 创建CA证书签名好的服务端证书
```shell
openssl x509 -req -days 365 -sha256 -in server.csr -CA ca.pem -CAkey ca-key.pem -CAcreateserial -out server-cert.pem
```
## 创建客户端密钥及签名
```shell
# 
openssl genrsa -out key.pem 4096
# 签名
openssl req -new -key key.pem -out client.csr
# 创建配置文件
echo extendedKeyUsage=clientAuth > extfile.cnf
# 签名
openssl x509 -req -days 1000 -sha256 -in client.csr -CA ca.pem -CAkey ca-key.pem -CAcreateserial -out cert.pem -extfile extfile.cnf
# 删除多余文件
rm -rf ca.srl client.csr extfile.cnf server.csr
```

## 修改docker服务
```shell
vim /lib/systemd/system/docker.service
# 修改ExecStart=/usr/bin/dockerd
ExecStart=/usr/bin/dockerd --tlsverify --tlscacert=/ssl/ca.pem --tlscert=/ssl/server-cert.pem --tlskey=/ssl/server-key.pem -H tcp://0.0.0.0:2376 -H unix:///var/run/docker.sock
# 重启后台
systemctl daemon-reload
# 重启docker
systemctl restart docker
```

## 复制证书文件到客户端
/ssl/ca.pem /ssl/cert.pem /ssl/key.pem

## docker测试
docker --tlsverify --tlscacert=ca.pem --tlscert=cert.pem --tlskey=key.pem -H tcp://ip:2376 version

::: tip dockerfile-maven  
需要修改环境变量  
DOCKER_HOST   
DOCKER_CERT_PATH  
:::