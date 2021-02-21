---
title: SpringCache+Redis 
date: 2020-10-4 22:32:33   
categories:    
 - Java    
tags:    
 - SpringCache
 - Redis
 - SpringBoot    
publish: true    
---


## 起因
最近在练习Redis，刚好有一些小的SpringBoot项目，就直接在上面应用  
然后按以往的使用方式  

- 每个方法使用RedisTemplate
- **AOP**使用RedisTemplate


然后突然知道了有**SpringCache**这个东西  
可以方便地使用Redis  
于是尝试了一下  
我的问题主要出现在**序列化与反序列化**上。。  

## 依赖
```xml
<!-- redis -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<!-- cache包含在spring-context包里 -->
```

## 配置文件
这里主要有三个方法
- keyGenerator：重写key的生成策略
- cacheManager：缓存管理器
- redisCacheConfiguration：Redis缓存配置

```java
@Configuration
@EnableCaching
public class RedisConfig extends CachingConfigurerSupport {

  /**
   * 不重写的话 ，采用默认策略
   * ①如果方法没有参数，则使用0作为key
   * ②如果只有一个参数的话则使用该参数作为key。
   * ③如果参数多于一个的话则使用所有参数的hashCode作为key
   */
  @Override
  public KeyGenerator keyGenerator() {
    // 当没有指定缓存的 key时来根据类名、方法名和方法参数来生成key
    return (target, method, params) -> {
      StringBuilder sb = new StringBuilder();
      sb.append(target.getClass().getName()).append(':').append(method.getName());
      if (params.length > 0) {
        sb.append('[');
        for (Object obj : params) {
          if (obj != null) {
            sb.append(obj.toString());
          }
        }
        sb.append(']');
      }
      return sb.toString();
    };
  }

  /**
   * 申明缓存管理器，会创建一个切面（aspect）并触发Spring缓存注解的切点（pointcut）
   * 根据类或者方法所使用的注解以及缓存的状态，这个切面会从缓存中获取数据，将数据添加到缓存之中或者从缓存中移除某个值
   *
   * @return
   */
  @Bean
  public RedisCacheManager cacheManager(RedisConnectionFactory redisConnectionFactory) {
    return RedisCacheManager.builder(redisConnectionFactory)
        // 让Cache管理器使用我们的配置文件，因为需要自定义序列化
        .cacheDefaults(redisCacheConfiguration())
        .build();
  }

  @Bean
  public RedisCacheConfiguration redisCacheConfiguration() {

    Jackson2JsonRedisSerializer<Object> jackson2JsonRedisSerializer =
        new Jackson2JsonRedisSerializer<>(Object.class);
    // 重点
    ObjectMapper om = new ObjectMapper();
    // 访问控制权限
    om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
    // 反序列化时候遇到不匹配的属性并不抛出异常
    om.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    // 序列化时候遇到空对象不抛出异常
    om.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
    // 反序列化的时候如果是无效子类型,不抛出异常
    // 这里如果不抛出的话可能会导致获取值为null
    // om.configure(DeserializationFeature.FAIL_ON_INVALID_SUBTYPE, false);
    // 不使用默认的dateTime进行序列化,
    om.configure(SerializationFeature.WRITE_DATE_KEYS_AS_TIMESTAMPS, false);
    // 使用JSR310提供的序列化类,里面包含了大量的JDK8时间序列化类
    om.registerModule(new JavaTimeModule());
    // 启用反序列化所需的类型信息,在属性中添加@class
    om.activateDefaultTyping(
        LaissezFaireSubTypeValidator.instance,
        ObjectMapper.DefaultTyping.NON_FINAL,
        JsonTypeInfo.As.PROPERTY);
    jackson2JsonRedisSerializer.setObjectMapper(om);

    // 构建配置文件
    RedisCacheConfiguration configuration =
        RedisCacheConfiguration.defaultCacheConfig()
            .serializeValuesWith(
                RedisSerializationContext.SerializationPair.fromSerializer(
                    jackson2JsonRedisSerializer))
            .entryTtl(Duration.ofMinutes(30));

    return configuration;
  }
}

```

## 注解使用

- @EnableCaching：开启缓存功能
- @Cacheable：定义缓存，用于触发缓存
- @CachePut：定义更新缓存，触发缓存更新
- @CacheEvict：定义清除缓存，触发缓存清除
- @Caching：组合定义多种缓存功能
- @CacheConfig：定义公共设置，位于class之上

```java
@GetMapping("/{classId}/user/all")
@ApiOperation(value = "查询班级成员")
@Cacheable("listAllManageClassUser")
public ResponseResult listAllManageClassUser(@PathVariable String classId, Integer status) {
    List<ManageClassDetailInfoUser> list =
        manageClassService.listAllManageClassUser(classId, status);
    return CommonCodeEnum.SUCCESS.addData("list", list);
}
```

<img src="https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20201004230803.png">

## 问题

### 序列化

序列化可以自己采用fastjson或者和我一样的jackson  
我遇到的问题有几个  
①需要在序列化的类上加上@JsonTypeInfo注解增加@class属性以便于让序列化成功  
`@JsonTypeInfo(use = Id.CLASS, include = As.PROPERTY, property = "@class", visible = true)`  
②由于我是对enum类进行序列化，所以需要在类上加入@JsonDeserialize注解指定自定义反序列化方法  
`@JsonDeserialize(using = ResponseResultDeserialize.class)`  

```java
/**
 * 处理ResponseResult反序列化
 *
 * @author Ikarosx
 * @date 2020/10/5 19:12
 */
public class ResponseResultDeserialize extends JsonDeserializer<ResponseResult> {

  @Override
  public ResponseResult deserialize(JsonParser jp, DeserializationContext ctxt)
      throws IOException, JsonProcessingException {
    JsonNode node = jp.getCodec().readTree(jp);
    boolean success = node.get("success").booleanValue();
    String message = node.get("message").asText();
    int code = (int) node.get("code").numberValue();
    JsonNode data = node.get("data");
    ObjectMapper mapper = new ObjectMapper();
    mapper.activateDefaultTyping(
        LaissezFaireSubTypeValidator.instance, ObjectMapper.DefaultTyping.NON_FINAL, As.PROPERTY);
    Map result = mapper.convertValue(data, Map.class);
    ResponseResultImpl responseResult = new ResponseResultImpl(success, code, message);
    responseResult.setData(result);
    return responseResult;
  }
}
```
### @Cacheable能存入Redis但不会从Redis取出
我的情况下出现了@Cacheable能够存入Redis  
但是后续请求仍然执行业务操作  
而不是取出缓存直接返回  
后来查看追踪源码发现是readValue失败返回空  
也即是反序列化失败  
又因为把异常报错屏蔽了   
所以表现出来的现象就是能存入Redis但是无法从Redis取出   
解决方法如上让反序列化成功  


## 思考
虽然只是看起来比较简单的SpringCache和Redis的应用  
但我学习了两天。。  
总结起来就是对Jackson的应用不熟悉  

