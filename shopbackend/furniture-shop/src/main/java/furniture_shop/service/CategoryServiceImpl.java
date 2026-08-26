package furniture_shop.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import furniture_shop.entity.Category;
import furniture_shop.repository.CategoryRepository;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository repository;

    @Override
    public Category saveCategory(Category category) {
        return repository.save(category);
    }

    @Override
    public List<Category> getAllCategories() {
        return repository.findAll();
    }

    @Override
    public Category getCategoryById(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Category updateCategory(Long id, Category category) {

        Category existingCategory = repository.findById(id).orElse(null);

        if (existingCategory != null) {

            existingCategory.setCategoryName(category.getCategoryName());
            existingCategory.setDescription(category.getDescription());

            return repository.save(existingCategory);
        }

        return null;
    }

    @Override
    public void deleteCategory(Long id) {
        repository.deleteById(id);
    }

}