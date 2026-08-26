package furniture_shop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import furniture_shop.entity.Order;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

	List<Order> findByCustomerEmailOrderByOrderDateDesc(String customerEmail);

	List<Order> findByOrderNumberAndCustomerEmail(String orderNumber, String customerEmail);

}