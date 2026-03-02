package com.sems.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import lombok.Data;

@Configuration
@ConfigurationProperties(prefix = "file")
@Data
public class AppConfig {
    private String uploadDir = "uploads/";
}
