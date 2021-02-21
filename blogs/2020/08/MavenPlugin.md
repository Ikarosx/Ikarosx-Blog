---    
title: MavenPlugin    
date: 2020-8-9 23:48:24 
categories:    
 - Web
tags:    
 - Maven
 - Plugin    
 - Tomcat
publish: true    
---   

## 起因
以往在编写SSM的Maven项目的时候  
有时候需要手动导入jar包（不通过Maven导入  
然后就会出现莫名其妙的**ClassNotFoundException**  
需要去   
`Project Structure -> Artifacts -> 中右键put into output root`  
但每次这样子就非常麻烦，所以想花时间了解一下这个问题是怎么回事  

解决以下问题
- import可以正确识别包，智能提示也可以，但Run/Debug ClassNotFound  
- mvn packing打包出现ClassNotFound

## IDEA Tomcat

我们正常通过Tomcat启动SSM项目时  
先添加了tomcat的配置文件然后添加Artifacts  

<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200809173235.png">

最后通过Run/Debug来启动项目

<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200809172942.png">

在我们点击Run/Debug的时候  
其实在配置文件里有写执行了哪些操作

<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200809174256.png">

也就是目前我的项目启动时会执行
build  
build 项目:war exploded

::: tip exploded
exploded指的是war包解压后的文件  
而没有带exploded模式是一个war包
:::

## IDEA build

查阅了IDEA[官网资料](https://www.jetbrains.com/help/idea/compiling-applications.html)  
::: details
The IntelliJ IDEA compilation and building process compiles source files and brings together external libraries, properties files, and configurations to produce a living application. IntelliJ IDEA uses a compiler that works according to the Java specification.  

You can compile a single file, use the incremental build for a module or a project, and rebuild a project from scratch.

If you have a pure Java or a Kotlin project we recommend that you use IntelliJ IDEA to build your project since IntelliJ IDEA supports the incremental build which significantly speeds up the building process.

However, IntelliJ IDEA native builder might not correctly build the Gradle or Maven project if its build script file uses custom plugins or tasks. **In this case, the build delegation to Gradle or Maven can help you build your project correctly.**
:::

从第一段可知，build所做的工作是**编译以及整合资源**，并且默认是使用IDEA去build项目  
从最后一段可知，如果你是maven项目，可能会有自定义配置的问题，此时使用IDEA去build项目会出现无法预期的错误  
所以这个时候可以开启委托，将build的工作给maven实现，即**maven插件**  
[官网参考地址](https://www.jetbrains.com/help/idea/delegate-build-and-run-actions-to-maven.html#delegate_to_maven)  

默认是不开启的  

<img id="delegation" src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200809183330.png">

由于两种机制，可能会出现各方面的差异  
比如加载resources文件/compile的差异  
idea默认会加载标记为resources的文件夹（就那个几根黄线的  
但使用maven去打包的时候是不识别这个resources文件夹的  
而我平常的使用习惯是  
- 测试用Run/Debug  
- 上线用mvn packing  
这就会导致开发测试环境很有可能跟上线的不同  

## Run/Debug ClassNotFound
根据上面两种模式，我们解决Run/Debug ClassNotFound有两种思路
- 使用IDEA自己的build
- 将build委托给Maven

### IDEA自己build

我们在maven项目中用lib文件夹来存放jar包  
首先是右键lib add as library  
根据[官网](https://www.jetbrains.com/help/idea/library.html?q=add%20as%20library)  
::: details Libraries
A library is a collection of compiled code that a module can depend on.   

After you define a library and add it to module dependencies, the IDE will be supplying its contents to you as you write your code. IntelliJ IDEA will also use the code from the libraries to build and deploy your application.
:::

可以得知，如果我们添加library之后，IDEA则会将其加入**智能提示**，并且IDEA会使用库中的代码来**build**和**deploy**我们的应用

我们可以通过进行和不进行add as library来测试build，我测试的结果是  
- add as library之后，build正常
- 没有add as library，build ClassNotFound

还记得前面提到的Run/Debug时两个步骤
- build
- build artifact

第一步build已经解决了，问题还有第二步  
build artifact时，我们需要在Output Layout面板中的Available Elements操作一下    
即`put into output root`  
根据[官方文档](https://www.jetbrains.com/help/idea/output-layout-tab.html#reorder_items)
::: details  Available Elements
The Available Elements pane shows the elements that can be but are not yet added to the artifact.
:::
Available Elements面板展示了可以被加入artifact中的但以前没有被添加过的元素    
当我们添加完之后再看build之后的classes就可以看到我们lib目录下的jar包了  

### maven build

参考[前面图片(点我)](#delegation)开启build委托给maven  
然后maven配置参考下文

## maven


### maven plugin

在maven中，只要在同一个生命周期， 
你执行后面的阶段，那么前面的阶段也会被执行  
而且不需要额外去输入前面的阶段  
这也是为什么比如我们执行mvn compile的时候  
会执行针对resources的操作  

<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200809180638.png">

对于maven-resources-plugin，我们可以在pom.xml中指定版本  
也可以不指定，不指定的时候，使用默认绑定的插件版本

::: tip 如何查看默认maven插件版本
`mvn -v`查看maven版本  
官网查看，将数字改为你查看到的版本即可（可能存在目录不对应，这个我没有测试过  
如果目录不对应自己翻翻官网找一下即可  
https://maven.apache.org/ref/3.5.3/maven-core/default-bindings.html
:::

```xml
<!-- 手动指定 -->
<pluginManagement><!-- lock down plugins versions to avoid using Maven defaults (may be moved to parent pom) -->
    <plugins>
        <plugin>
            <artifactId>maven-resources-plugin</artifactId>
            <version>3.0.2</version>
        </plugin>
    </plugins>
</pluginManagement>
```

### maven-resources-plugin
对于maven-resources-plugin  
如果我们什么都不配置  
默认会打包src/main/resources目录  
但有时候我们需要自己指定要打包哪些文件  
这时我们可以自己配置  
```xml
<build>
    <resources>
      <resource>
        <directory>src/main/java</directory>
        <includes>
          <include>**/*.xml</include>
        </includes>
      </resource>
      <resource>
        <directory>src/main/resources</directory>
        <includes>
          <include>**/*.xml</include>
          <include>**/*.properties</include>
          <include>**/excel/**</include>
        </includes>
      </resource>
    </resources>
</build>
```
比如上面这段配置就是打包src/main/java里所有的xml文件  
以及src/main/resources下所有的xml和properties以及所有excel目录下的所有文件  
注意如果配置了resources，那么只会遵循你配置的resources目录  
所以如果有时候**classpath找不到文件**，请检查是否将资源文件打包进去了   
更多详情参考[官网](https://maven.apache.org/plugins/maven-resources-plugin/examples/resource-directory.html)

### maven-compiler-plugin

compile的时候基本上就是看配置  
因为内置build的配置文件和mvn compile的配置是不公用  
所以我们需要给compiler插件添加上lib目录  
```xml
<plugin>
  <artifactId>maven-compiler-plugin</artifactId>
  <version>3.8.0</version>
  <configuration>
    <!-- 添加lib目录 -->
    <compilerArgs>
      <arg>-extdirs</arg>
      <arg>${project.basedir}/lib</arg>
    </compilerArgs>
  </configuration>
</plugin>
```

这部分配置完mvn compile即可正常运行  

### maven-war-plugin

同样，由于是war包，所以packing会执行war插件  
我们需要给war插件配置jar包目录  

```xml
<plugin>
  <artifactId>maven-war-plugin</artifactId>
  <version>3.2.2</version>
  <!-- 加载自定义lib -->
  <configuration>
    <webResources>
      <resource>
        <directory>lib/</directory>
        <targetPath>WEB-INF/lib</targetPath>
        <includes>
          <include>**/*.jar</include>
        </includes>
      </resource>
    </webResources>
  </configuration>
</plugin>
```

经过上面的配置，我们在packing时也可以正常运行了  
这就解决了第二个问题

## 结语

上面其实很多东西可以扩展  
- 比如部署在Tomcat的项目是并不是在Tomcat的Webapp下，而是让Tomcat扫描IDEA给他的目录
- Maven的生命周期

然后总结起来就是  
如果我们启用了build委托给maven  
那么只需要在pom.xml中配置compile和war插件即可  
如果使用IDEA自带的build  
那么需要配置IDEA和maven插件