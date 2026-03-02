package com.sems.config;

import com.sems.entity.Category;
import com.sems.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@Order(3) // Run after DatabaseFixer and DataInitializer
@RequiredArgsConstructor
public class CategoryInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() == 0) {
            List<Category> defaultCategories = Arrays.asList(
                    Category.builder().name("Music").description("Music concerts and festivals").build(),
                    Category.builder().name("Sports").description("Sports events and competitions").build(),
                    Category.builder().name("Education").description("Educational workshops and seminars").build(),
                    Category.builder().name("Technology").description("Tech conferences and meetups").build(),
                    Category.builder().name("Arts").description("Art exhibitions and performances").build(),
                    Category.builder().name("Business").description("Business networking and conferences").build());

            categoryRepository.saveAll(defaultCategories);
            System.out.println("✅ Default categories created: Music, Sports, Education, Technology, Arts, Business");
        } else {
            System.out.println("ℹ️  Categories already exist");
        }
    }
}
