package furniture_shop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import furniture_shop.entity.Wishlist;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

}