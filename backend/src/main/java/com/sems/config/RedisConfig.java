package com.sems.config;

/**
 * DEPRECATED - Replaced by CacheConfig.java
 * 
 * This file has been replaced by a more robust, fail-safe cache configuration
 * in CacheConfig.java which supports:
 * - Conditional Redis caching (when spring.cache.type=redis)
 * - Automatic fallback to in-memory cache (when Redis unavailable)
 * - Production-ready configuration
 * 
 * To enable Redis: Set spring.cache.type=redis in application.properties
 * Default: Uses in-memory SimpleCacheManager
 * 
 * This file is kept empty to avoid bean conflicts.
 * TODO: Delete this file completely once verified working.
 */
public class RedisConfig {
    // All functionality moved to CacheConfig.java
    // No beans defined here to avoid BeanDefinitionOverrideException
}
