package furniture_shop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import furniture_shop.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

}