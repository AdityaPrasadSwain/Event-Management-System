package com.sems;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@org.springframework.boot.autoconfigure.domain.EntityScan(basePackages = "com.sems.entity")
@org.springframework.data.jpa.repository.config.EnableJpaRepositories(basePackages = "com.sems.repository")
public class SemsBackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(SemsBackendApplication.class, args);
	}

}
