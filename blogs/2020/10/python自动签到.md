---
title: Python自动签到 
date: 2020-10-7 13:21:40   
categories:    
 - Tools    
tags:    
 - Python
 - BeautifulSoup
 - Schedule    
publish: true    
---

## 起因
最近学校弄了个自动签到打卡的  
在身体健康的情况下   
本着学tou习lan的精神  
重温一下**python requests**库  



## 自动签到
自动签到其实就是代码模拟我们正常签到发的网络请求  
携带上正常的参数即可  

### import库
```python
import requests
import time
import urllib3
from bs4 import BeautifulSoup
# 禁用warning
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
# 填写账号密码
userAccounts = [
    # ['username1', 'password1'],
    # ['username2', 'password2']
]
```

### 分析请求

#### 登陆
我们都知道未登录的话会被跳转  
所以需要先解决登陆问题  
登陆有几种解决方案，**session/JWT**之类的   
分析请求可知比较简单是通过session存储的   
那么只要获取到**JSESSIONID**即可    


<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20201007133058.png">

从图片可以看出需要参数有三个
- username
- password
- rememberme

那么我们可以通过如下python代码模拟登陆  
```python
# 账号密码登陆后返回请求需要headers
def login(username, password):
    data = {
        'username': username,
        'password': password,
        'rememberMe': 'false'
    }
    # 模拟post请求，verify=False禁用https检测
    response = requests.post(
        url='https://tb.gdei.edu.cn/login', data=data, verify=False)
    # 获取setCookie字段
    setCookie = response.headers['Set-Cookie']
    # 获取JSESSIONID
    JSESSIONID = setCookie[:setCookie.index(';')]
    # 模拟正常请求构造headers，很多头其实也可以不用
    headers = {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-US;q=0.7',
        'Connection': 'keep-alive',
        'Cookie': JSESSIONID,
        'Host': 'tb.gdei.edu.cn',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
    }
    return headers
```
  
#### 签到

学校有两个签到的地方  
一个是每天的打卡，点击一下即可  
一个是填写体温，早上和中午各一次  

<img src='https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20201007134039.png'>

##### 打卡

点击打卡后可以发现请求是get请求，参数只有一个_=13位数字  
嗯13位时间戳  
`https://domain.cn/system/yqdc/yjtb?_=1602048483670`

那么就很简单了  
解决打卡只需求模拟get请求  
生成一个**13位时间戳**，带上**JSESSIONID**即可  

python代码
```python
# process函数处理打卡和签到
def process():
    # 遍历账号
    for userAccount in userAccounts:
        # 登陆，获取headers
        headers = login(userAccount[0], userAccount[1])
        # 模拟打卡
        requests.get('https://tb.gdei.edu.cn/system/yqdc/yjtb?_=%d' %
                     (int(round(time.time() * 1000))), verify=False, headers=headers)
        print('%s打卡成功' % (userAccount[0]))
```

##### 体温签到

签到有**晨检**和**午检**  
我们需要知道参数和请求链接是否一样  
经过我的测试  
发现早上和中午的请求链接是一样的 
参数不同  

<img src='https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20201007135529.png'>



从页面代码看参数有**两部分**
- 需要填写的，如体温，状态：正常/不适
- 不需要填写的，如系别、宿舍号等，这部分是隐藏input
  
那么我们可以有以下**思路**：  
①访问页面   
②用BeautifulSoup解析页面获取不需要填写的参数  
③手动填入体温和状态   
④发起请求 

python代码
```python
# 构造体温签到参数
def getMrcjParams(headers):
    # get请求
    response = requests.get(
        url='https://tb.gdei.edu.cn/system/mrcj/add', headers=headers, verify=False)
    # BeautifulSoup解析html代码
    soup = BeautifulSoup(response.text, 'lxml')
    # 构造params
    params = {
        # 'id': '',
        # 'bushi': '',
        # 找到id为username的input标签的value值
        'username': soup.find('input', id='username')['value'],
        'suse': soup.find('input', id='suse')['value'],
        'fanghao': soup.find('input', id='fanghao')['value'],
        'phone': soup.find('input', id='phone')['value'],
        'tbname': soup.find('input', id='tbname')['value'],
        'xh': soup.find('input', id='xh')['value'],
        'depid': soup.find('input', id='depid')['value'],
        'xm': soup.find('input', id='xm')['value'],
        'dep': soup.find('input', id='dep')['value'],
        'banji': soup.find('input', id='banji')['value'],
        # 需要我们填写的值
        'tiwen': 36.6,
        'zt': '正常'
    }
    return params

# process函数在原有基础上增加体温签到代码
def process():
    # 遍历账号
    for userAccount in userAccounts:
        # 登陆，获取headers
        headers = login(userAccount[0], userAccount[1])
        # 模拟打卡
        requests.get('https://tb.gdei.edu.cn/system/yqdc/yjtb?_=%d' %
                     (int(round(time.time() * 1000))), verify=False, headers=headers)
        print('%s打卡成功' % (userAccount[0]))
        # 获取体温签到参数
        mrcjParams = getMrcjParams(headers)
        print(mrcjParams)
        # post请求,注意指定params和headers
        requests.post(url='https://tb.gdei.edu.cn/system/mrcj/add',
                      params=mrcjParams, headers=headers, verify=False)
        print('%s体温签到成功' % (userAccount[0]))

# 最后记得main函数调用process执行
if __name__ == '__main__':
    process()
```

## 自动定时执行

win10下使用自带的定时任务

### 添加定时任务
首先我们需要编写一个bat用于win10自动执行
```bat
:: xxx.bat
:: 这个bat用于让win10执行，所以内容为python 代码文件
python xxx.py
```

接下来需要添加定时任务，让win10自动执行我们上面编写的文件
```bat
:: 可以直接powershell执行
:: /tn 定时任务的名称
:: /st startTime
:: /sc daily 每天
:: /tr 执行程序
schtasks /create /tn 晨检 /st 09:00 /sc daily /tr C:\Users\x5322\Desktop\xxx.bat
schtasks /create /tn 午检 /st 12:00 /sc daily /tr C:\Users\x5322\Desktop\xxx.bat
```

### 删除定时任务
```bat
schtasks /delete/ /tn 晨检
schtasks /delete/ /tn 午检
```

::: tip 通过'管理'

右键我的电脑->管理->任务计划程序->任务计划程序库也可以进行设置和删除

:::

### Centos定时任务

2020-10-13 15:11:02 更新
由于自己win10执行需要开电脑  
偶尔忘了就很麻烦  
所以就放在云服务器上定时执行  
#### 安装crontabs
```shell
yum install crontabs
systemctl enable crontabs
systemctl start crontabs
```
#### 配置定时规则
```shell
vim /etc/crontab
# 分钟（0~59）、小时（0~23）、天（1~31）、月(1~12)、星期(0~6)、用户名、要执行的命令或者脚本
# *表示每天每月每星期
# 每天8点和12点打卡
00 08 * * * root python /opt/xxx.py
00 12 * * * root python /opt/xxx.py

# 修改生效
crontab /etc/crontab

# 查看定时任务
crontab -l
```

#### 题外话
写完才发现执行不了  
试了一下curl发现卡住了  
加上-v参数查看  
应该是只能内网访问  
这就尴尬了。。  
但不管怎么说学了一下Centos的定时任务  


## 总结
重温了一下requests的使用  
以及使用函数来编写python  
之前写的python文件基本都是直接写  
没有函数，看起来乱乱的  
代码的结构确实会好看很多哈哈  

另外就是前面的体温我是写死的36.6  
其实也可以让其随机在36.5-36.9这样子  
就不会固定了太过明显(haipa)  

定时也可以用程序自身来实现  
但需要一直运行就觉得用win10自带的来实现也可以  