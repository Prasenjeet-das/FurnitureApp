package furniture_shop.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import furniture_shop.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByRazorpayOrderIdAndUserEmail(String orderId, String userEmail);
}