---
title: SpringMVC接收Date
date: 2020-10-10 11:48:42
categories:    
 - Web    
tags:    
 - SpringMVC
 - Date  
publish: true    
---

## 起因
在项目中会经常遇见需要接收Date类型的数据  
然后就会遇到因为格式不对接收不了的问题  

## 接收
接收参数上写上  
`@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")`
pattern可以根据自己需求修改  


值得一提的是yyyy与YYYY有些区别  
Y是week year，会导致计算出错    
而H代表24H制    
h代表12H制  
更多可以参考**SimpleDateFormat类**的说明

::: warning @RequestBody接收@DateTimeFormat不生效
因为@RequestBody接收参数会采用**HttpMessageConverter**  
见下文`@RequestBody参数处理`
:::

## @DateTimeFormat原理
我们都知道SpringMVC会帮我们自动处理参数  
其原理是通过一系列的Handler和Adapter实现的  
由于我对SpringMVC的源码也不了解  
只能通过查询[教程](https://www.jianshu.com/p/0e4dd9494384?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation)了解大概    

我的主要关注点是在于加了@DateTimeFormat和没加的处理逻辑  
经过教程指点  
在`org.springframework.beans.AbstractNestablePropertyAccessor#convertForProperty`  
发现获取到的td不同  

<img src='https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20201010150331.png'>

<img src='https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20201010150500.png'>

这大概就是菜鸡与大佬的区别吧。。

## @RequestBody参数处理  
我发现当我使用**@RequestBody**注解接收json参数时  
并不会走上面提到的方法  
查了一下得知SpringMVC会使用**HandlerAdapter**配置的**HttpMessageConverters**来解析json或者xml数据   
@DateTimeFormat对于json/xml数据**不生效**  
默认解析json的Converter是  
`org.springframework.http.converter.json.MappingJackson2HttpMessageConverter`  
所以我们需要配置Jackson让其能够正确解析Date类型  
 
- 每个字段@JsonFormat(pattern="yyyy-MM-dd",timezone = "GMT+8")
- SpringBoot可以全局配置application.yaml，`jackson.date-format=yyyy-MM-dd HH:mm:ss jackson.time-zone=GMT+8`
- SSM配置一个String转Date的转化器并注册  

::: tip 序列化与反序列化都可用
配置之后不管是接收还是返回json串都生效
:::

### 转化器

```java
// 编写转化器
public class StringToDateConverter implements Converter<String, Date> {
 
    @Override
    public Date convert(String source) {
        Date target = null;
        if(!StringUtils.isEmpty(source)) {
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            try {
                target =  format.parse(source);
            } catch (ParseException e) {
                throw new RuntimeException(String.format("parser %s to Date fail", source));
            }
        }
        return target;
    }
}

```

```xml
<context:component-scan base-package="com" annotation-config="true"/>
<mvc:annotation-driven conversion-service="myDateConverter"/>
<!-- 注册转换器 -->
<bean id="myDateConverter" class="org.springframework.format.support.FormattingConversionServiceFactoryBean">
    <property name="converters">
        <set>
            <bean class="xx.xx.xx.StringToDateConverter"></bean>
            <bean class="org.springframework.core.convert.support.StringToBooleanConverter"></bean>
        </set>
    </property>
</bean>
```



## 总结
我现在还是只会使用但不知道为什么的那种类型  
实在是佩服写出这些框架的人。。  
希望一点点进步  
希望一点点努力  

