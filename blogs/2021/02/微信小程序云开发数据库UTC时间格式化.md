---
title: 微信小程序云开发数据库UTC时间格式化
date: 2021-2-23 18:49:17
categories:
 - 前端
tags:
 - 小程序
 - 格式化
publish: true
---

## 起因
最近练习开发小程序  
采用云开发  
存入数据库时使用Date.now()  
前端取出时是UTC格式  
如2021-02-23T09:16:26.851Z  

## 解决

由于获取到的格式通过typeof查看为string  
所以不能直接调用date.getXXX()方法  
需要先转成date类型  
```javascript
// 假如数据库取出来的为这样子
var utcDateString = "2021-02-23T09:16:26.851Z"  
// 通过Date.parse得到时间戳
var timestamp = Date.parse(utcDateString)
// 通过new Date得到日期对象
var date = new Date(timestamp)
// 通过以下函数得到格式化后的时间
function dateFormat(date) => {
  let fmt = 'yyyy-MM-dd hh:mm:ss'
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分钟
    's+': date.getSeconds() //秒
  }

  if(/(y+)/.test(fmt)){
    fmt = fmt.replace(RegExp.$1,date.getFullYear())
  }
  for(let k in o){
    if(new RegExp('('+k+')').test(fmt)){
     fmt =  fmt.replace(RegExp.$1, o[k].toString().length == 1 ? '0' + o[k] : o[k])
    }
  }
  // console.log(fmt)
  return fmt
}
```
