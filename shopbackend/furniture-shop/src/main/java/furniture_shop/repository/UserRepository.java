package furniture_shop.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import furniture_shop.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

}