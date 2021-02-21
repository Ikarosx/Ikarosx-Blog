---    
title: java文件操作
date: 2020-8-11 22:19:57   
categories:    
 - Java    
tags:    
 - File
 - Java
publish: true    
---    

## 起因

在项目中少不了读取文件，比如读取application.yaml/密钥/模板文件  
但一直分不清classpath:xx.xx和xx.xx应该怎么使用  
所以想好好理解一下java对于文件的操作方式  

## File

### 构造File对象
```java
// 这应该是我们最熟悉的使用方式了
// 构造一个File对象
File file = new File("1.txt");

// 操作对象
// 创建文件
file.createNewFile();
// 判断是否存在
file.exists();
// 列出文件
file.list();
// 判断是否是文件夹
file.isDirectory();
```


::: warning 父目录要存在
`new File("a/1.txt")`  
a目录要存在，不然会报错
:::

### 项目中new File相对路径

我遇到了这么一个问题  
根据文档，构造File对象传入的参数可以是绝对路径也可以是相对路径  
但是使用相对路径时一直有毛病  
```java
// projectName/src/main/java/Test.java
new File("1.txt").createNewFile();
// 预料中的效果应该是创建了projectName/src/main/java/1.txt
// 结果运行之后创建了projectName/1.txt
// 这明显就不符合相对路径
```

后来发现这里的相对路径指的是运行时的相对路径  
启发来自下图

<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200811171343.png">

然后一脸兴奋点开，想着应该是这里指定了当前的目录  
结果发现这里只是指定了classpath和encoding  

然后幸好是之前在写[MavenPlugin](http://blog.ikarosx.cn/docs/views/Web/2020/08/MavenPlugin.html)时的经验  
因为我们在IDEA里运行是点击Run/Debug  
那么就有相应的配置文件  

<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200811171836.png">

果然发现了罪魁祸首WorkingDirectory  
查看[官网资料](https://www.jetbrains.com/help/idea/run-debug-configuration-java-scratch.html)
::: details WorkingDirectory
Specify the working directory to be used for running the application. This directory is the starting point for all relative input and output paths. By default, the field contains the directory where the project file resides. To specify another directory, click the Browse button and select the directory.
:::

WorkingDirectory是相关的输入输出路径的起点，所以相对路径是以这个设置为准  
这也是为什么我们的相对路径跑到了项目根目录去了

## ClassPath

ClassPath是JVM去搜索我们使用的类的地方

对于War项目，classpath是打包后的WEB-INF中的classes，lib目录  
对于IDEA普通项目，classpath通常是out/project  

### getResource

```java
// 路径在类中是相对于包的相对路径，比如Test类在test包下
// 则a.txt表示test/a.txt，/a.txt表示a.txt
Test.class.getResource("").getPath();
// 路径在ClassLoader中是绝对路径，如果填的是/a.txt，则会去根目录寻找
Test.class.getClassLoader().getResource("").getPath();
```

### getResourceAsStream

```java
// 这样也可以获取文件，只不过返回一个InputStream 对象
InputStream inputStream =Test.class.getClassLoader().getResourceAsStream("");
```

### Spring Resource

```java
// Resource类比File对象，可以执行比如exists等方法
Resource resource = new ClassPathResource("1.txt");

// 通过ResourceUtils，支持classpath:和file:前缀
File file = ResourceUtils.getFile("classpath:1.txt");
```

::: tip classpath:
我们经常在Spring里写classpath:application.properties  
就是去classpath寻找  
但要注意`new File("classpath:1.txt")`这种写法是不支持的  
:::

## Path

Path是jdk1.7引入的用来在文件系统中定位一个文件的对象  
配合Files工具类使用可以很方便对文件进行操作  
```java
Path path = new Path("1.txt")
// new Path(Test.class.getClassLoader.getResource("1.txt"))
Files.copy(Path source, Path target, CopyOption... options);
Files.delete(Path path);
Files.move(Path source, Path target, CopyOption... options);
```

## 结语
在项目中用到classpath的地方很多  
但总是由于不熟悉获取不到  
希望之后可以一举解决该类问题哈哈

