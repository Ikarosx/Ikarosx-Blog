---
title: SSM项目中使用MyBatis-Plus的自动填充
date: 2020-07-10 20:04:33
categories:
 - Web
tags:
 - SSM
 - MybatisPlus
publish: true
---

## 版本

> Spring 4.2.15.RELEASE
>
> Mybatis-Plus 3.0.RELEASE
> 
:::warning
<b>不敢用太高，怕Spring和MP版本不兼容</b>
:::

## 起因

目前是在SSM项目中使用MP，因为很多表都有createTime和updateTime

所以看到了官网的[自动填充](https://mybatis.plus/guide/auto-fill-metainfo.html)

结果遇到了问题，特此记录一下

## 尝试

①按照官网的文档在实体类字段上加入相应的注解

```java
@TableField(fill = FieldFill.INSERT)
```

FieldFill有几种类型，代表在对应情况下就进行注入操作

```java
public enum FieldFill {
    DEFAULT, // 默认不处理
    INSERT, // 插入时
    UPDATE, // 更新时
    INSERT_UPDATE; // 插入和更新时
}
```





```java
public class User {
  ...

  @TableField(fill = FieldFill.INSERT)
  private Date createTime;

  @TableField(fill = FieldFill.INSERT_UPDATE)
  private Date updateTime;
    
  ...
}
```



②自定义类实现MetaObjectHandler ，告诉MP应该怎么填充

MP会**自动**根据你的实现类去实时填充操作

```java
@Slf4j
@Component
public class MyMetaObjectHandler implements MetaObjectHandler {

    @Override
    public void insertFill(MetaObject metaObject) {
        log.info("start insert fill ....");
        this.strictInsertFill(metaObject, "createTime", LocalDateTime.class, LocalDateTime.now()); // 起始版本 3.3.0(推荐使用)
        this.fillStrategy(metaObject, "createTime", LocalDateTime.now()); // 也可以使用(3.3.0 该方法有bug请升级到之后的版本如`3.3.1.8-SNAPSHOT`)
        /* 上面选其一使用,下面的已过时(注意 strictInsertFill 有多个方法,详细查看源码) */
        //this.setFieldValByName("operator", "Jerry", metaObject);
        //this.setInsertFieldValByName("operator", "Jerry", metaObject);
    }
}
```

然后正常来讲只要你是SpringBoot开发，那么到这里就已经结束了

然而我是SSM

所以就会遇到，emm怎么注入为null，调试发现根本就不执行对应方法

## 解决

问题出在了SpringBoot会进行自动装配

SSM项目的话需要手动

在对应的XML配置里/或者Java注解配置也可以

对`MybatisSqlSessionFactoryBean`这个类进行配置

```xml
<bean id="sqlSessionFactory" class="com.baomidou.mybatisplus.extension.spring.MybatisSqlSessionFactoryBean">
    <!-- 注入数据源 -->
    <property name="dataSource" ref="dataSource"/>
    <!-- 扫描所有的Mapper文件 -->
    <property name="mapperLocations" value="classpath:/mapper/*.xml"/>
    <!-- 扫描所有的模型类(实体类) -->
    <property name="typeAliasesPackage" value="cn.ikarosx.model"/>
    
    
    <!-- 看下面部分 -->
    
    <!-- 划重点，这里，需要配置这个globalConfig -->
    <property name="globalConfig" ref="globalConfig"/>
</bean>
<!-- 注意是core包下，不是generate包的 -->
<bean id="globalConfig" class="com.baomidou.mybatisplus.core.config.GlobalConfig">
	<!-- 注入我们自己的实现类 -->
    <property name="metaObjectHandler">
        <bean class="cn.ikarosx.handler.MPMetaObjectHandler"/>
    </property>
    <!-- 这是第二个坑，上面的做完之后一直报NPE，这是GlobalConfig的一个静态内部类 -->
    <property name="dbConfig">
        <bean class="com.baomidou.mybatisplus.core.config.GlobalConfig.DbConfig"/>
    </property>
</bean>
```



另外有看到说Date和LocalDateTime也可能会导致null值注入，这个没遇到过