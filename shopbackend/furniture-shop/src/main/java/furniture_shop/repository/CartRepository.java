package furniture_shop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import furniture_shop.entity.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {

}