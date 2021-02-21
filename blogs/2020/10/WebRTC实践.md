---
title: WebRTC实践
date: 2020-10-23 19:37:25
categories:    
 - Demo    
tags:    
 - 校园网
 - 直播
 - P2P
publish: true    
---

## 起因
舍友不知道哪里看到了WebRTC这个东西    
然后就怂恿我去学这个  

结果来说截止2020年2020年10月25日01:36:37实现了  
①一对一
②[一对多]直播间(https://parva.cool/zbj/) 虾哥友情赞助 2020年10月25日00:10:36更新
③多对多

demo以及源代码地址https://stun.ikarosx.cn/wx/20201023WebRTC%E5%AE%9E%E8%B7%B5  

实现基于P2P  
也就是流量不经过服务器  
而是客户端之间直接通信  

## WebRTC
WebRTC是指网络实时通信**Web Real Time Communication**   
Google是WebRTC的主要支持者和开发者  

- Web Real-Time Communications (WEBRTC) W3C Working Group是负责定义浏览器接口部分标准的组织[w3cWebRTC文档](https://www.w3.org/TR/webrtc/)  
- Real-Time Communication in Web-browsers (RTCWEB) 是 IETF 工作组，负责定义协议，数据格式，安全，以及一切技术底层，[draft以及rfc地址](https://datatracker.ietf.org/doc/search?name=rtc&sort=&rfcs=on&activedrafts=on&by=group&group=)

通过浏览器音视频实时通信底层需要处理很多问题  
比如不断波动的带宽和延迟，音视频编码解码  
W3C规范定义了一组跟媒体捕获与流相关的**JavaScript API**  
方便开发者使用  

## JS相关

### 主要对象

- RTCPeerConnection，表示本地计算机和远程计算机之间的WebRTC连接
- navigator.mediaDevices，navigator对象包含有关浏览器的信息，所有浏览器都包含这个对象，mediaDevices则是提供了与媒体设备交互的能力，比如摄像头、麦克风以及屏幕分享等

### 获取摄像头demo


```html
<body>
    <!-- 展示窗口标签 -->
    <video id="localVideo" autoplay></video>
    <script>
        function getLocalCamera() {
            // 配置参数，是否获取音频和视频，更多配置请看
            // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
            let constraints = {
                video: true,
                audio: true,
            };
            // 通过navigator.mediaDevices.getUserMedia获取摄像头和麦克风
            // 这里要注意，有两种写法
            // 一种是navigator.getUserMedia(constraints, successCallBack, failureCallBack)
            // 第二种是navigator.mediaDevices.getUserMedia(constraints).thenc写法
            // 现在是推荐第二种，第一种已经deprecated过期了
            navigator.mediaDevices
                .getUserMedia(constraints)
                .then((stream) => {
                    // 成功回调
                    // 将获取到的流设置到我们的标签上
                    document.querySelector("#localVideo").srcObject = stream;
                })
                .catch((error) => {
                    // 异常打印信息
                    console.log("获取摄像头失败:" + error);
                });
        }
        // 调用一下函数
        getLocalCamera();
    </script>
</body>       
```

将上面代码复制成一个html文件即可访问本机  

<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20201024001238.png">

### 本地测试一对一

相关知识
- STUN/TURN服务器
- NAT
- SDP
- P2P
- WebSocket

#### NAT
WebRTC需要实现音视频**P2P**点对点  
点对点指的是我们传输的时候直接连接到对方的IP:port  
而不需要经过服务器  
但由于IPV4地址不够  
所以我们现在很多主机IP都是10.0.x.x/192.168.x.x  
这些都是通过**NAT**转换而来的  
比如网络出口IP为1.2.3.4  
那么  
内网IP为192.168.1.3对应的外网IP可能是1.2.3.4:222  
内网IP为192.168.1.4对应的外网IP可能是1.2.3.4:223  
实际上的NAT转换还分**锥型**NAT和**对称型**NAT  
- 完全锥型NAT，Full Cone NAT
- 受限锥型NAT，Restricted Cone NAT
- 端口受限型NAT，Port Restricted Cone NAT
- 对称型NAT，Symmetric NAT

#### STUN/TURN
我们的STUN/TURN服务器就是为了解决NAT问题  
**STUN**可以解决**Full Cone NAT**型的NAT  
google提供了**免费**的STUN服务器`stun:stun.l.google.com:19302`    
当STUN无法解决时则需要TURN服务器  
TURN服务器充当了一个**中转**的角色  
即A与B通信，实际是A发往TURN，TURN发往B这样子  
从这层意义上来说不能算完全的P2P  

#### 交互流程

[参考该篇文章](https://www.twilio.com/docs/stun-turn/faq#faq-how-does-nat-work)制作出来的交互图  

<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/WebRTC.png">

这里我们需要一个信令服务器  
虽然是P2P，但只是传输数据的时候不通过我们的服务器  
但把客户端联系起来还是需要到信令服务器的    
本篇文章采用WebSocket  

所以实现部分除了页面代码  
还需要搭建一个**WebSocket**服务器  

WebSocket服务器主要负责存储用户连接   
以及转发各种事件  
比如offer/answer/candidate等  
采用nodejs实现  

这里由于代码过多  
已经放在了开头
代码里都有注释  

### 一对多
思路其实和一对一 一样  
问题在于一的一方需要维护多个RTCPeerConnection  
以及WebSocket需要处理转发给多个webSocket对象  

类似实现就是**直播间**  
贴上舍友写的demo
https://parva.cool/zbj/

### 多对多
同上，每一个用户都维护多个RTCPeerConnection  


### 屏幕分享
我们除了可以获取摄像头  
也可以获取屏幕分享  
很多人在线上笔试的时候也许有发现一个屏幕分享的功能  
那个就是用
`navigator.mediaDevices.getDisplayMedia`实现的  
其他部分没什么区别  
会了摄像头很简单就能切换到屏幕分享  
但仅限chrome  
这也是为什么很多笔试面试都要求使用chrome的特定版本以上  

### 总结
通过这几天对于WebRTC的学习  
明白了会使用是不够的  
真的要会懂原理  
而最好的方法就是看协议  
rfc  
比如期间使用TURN服务器遇到的问题  
不明白运作原理根本无从下手  





