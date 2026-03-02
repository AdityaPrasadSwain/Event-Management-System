package com.sems.service;

import com.sems.entity.Category;

import java.util.List;

public interface CategoryService {
    Category createCategory(String name, String description);

    List<Category> getAllCategories();

    Category getCategoryById(Long id);

    Category updateCategory(Long id, String name, String description);

    void deleteCategory(Long id);
}
