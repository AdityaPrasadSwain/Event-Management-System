package com.sems.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;

/**
 * Fail-safe Cache Configuration
 * 
 * Supports two modes:
 * 1. Simple Cache (default) - In-memory caching, no Redis required
 * 2. Redis Cache (optional) - Distributed caching when Redis is available
 * 
 * Configuration:
 * - Default: spring.cache.type=simple (or not set)
 * - Redis: spring.cache.type=redis
 */
@Configuration
@EnableCaching
public class CacheConfig {

    /**
     * Redis Cache Configuration
     * Only activated when:
     * - spring.cache.type=redis
     * - RedisConnectionFactory is available on classpath
     */
    @Configuration
    @ConditionalOnProperty(name = "spring.cache.type", havingValue = "redis")
    @ConditionalOnClass(RedisConnectionFactory.class)
    static class RedisCacheConfig {

        @Bean
        @ConditionalOnMissingBean
        public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
            RedisTemplate<String, Object> template = new RedisTemplate<>();
            template.setConnectionFactory(connectionFactory);
            template.setKeySerializer(new StringRedisSerializer());
            template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
            template.setHashKeySerializer(new StringRedisSerializer());
            template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());
            return template;
        }

        @Bean
        @ConditionalOnMissingBean
        public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
            RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                    .entryTtl(Duration.ofMinutes(10))
                    .disableCachingNullValues()
                    .serializeKeysWith(
                            RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                    .serializeValuesWith(RedisSerializationContext.SerializationPair
                            .fromSerializer(new GenericJackson2JsonRedisSerializer()));

            return RedisCacheManager.builder(connectionFactory)
                    .cacheDefaults(config)
                    .build();
        }
    }

    /**
     * Simple In-Memory Cache Configuration
     * Activated when:
     * - spring.cache.type=simple
     * - OR spring.cache.type is not set (default)
     * 
     * Benefits:
     * - No external dependencies
     * - Works without Redis
     * - Perfect for development
     * - Fast in-memory access
     */
    @Configuration
    @ConditionalOnProperty(name = "spring.cache.type", havingValue = "simple", matchIfMissing = true)
    static class SimpleCacheConfig {

        @Bean
        @ConditionalOnMissingBean
        public CacheManager cacheManager() {
            // Define all cache names used in @Cacheable annotations
            return new ConcurrentMapCacheManager(
                    "adminDashboard",
                    "organizerDashboard",
                    "events",
                    "upcomingEvents",
                    "categories");
        }
    }
}
