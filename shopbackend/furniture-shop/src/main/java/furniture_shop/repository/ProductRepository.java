package furniture_shop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import furniture_shop.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

}