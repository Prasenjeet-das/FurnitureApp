package furniture_shop.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import furniture_shop.entity.Order;
import furniture_shop.service.OrderService;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService service;

    // Save Order
    @PostMapping
    public Order saveOrder(@RequestBody Order order) {
        return service.saveOrder(order);
    }

    // Get All Orders
    @GetMapping
    public List<Order> getAllOrders() {
        return service.getAllOrders();
    }

    @GetMapping("/my")
    public List<Order> getMyOrders(Authentication authentication) {
        return service.getOrdersByCustomerEmail(authentication.getName());
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Order> cancelOrder(@PathVariable Long id,
                                             Authentication authentication) {
        Order cancelledOrder = service.cancelOrder(id, authentication.getName());

        if (cancelledOrder == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(cancelledOrder);
    }

    @PutMapping("/group/{orderNumber}/cancel")
    public ResponseEntity<List<Order>> cancelOrderGroup(
            @PathVariable String orderNumber,
            Authentication authentication) {
        List<Order> cancelledOrders = service.cancelOrderGroup(
                orderNumber,
                authentication.getName());

        if (cancelledOrders.isEmpty()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(cancelledOrders);
    }

    // Get Order By Id
    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {
        return service.getOrderById(id);
    }

    // Update Order
    @PutMapping("/{id}")
    public Order updateOrder(@PathVariable Long id,
                             @RequestBody Order order) {
        return service.updateOrder(id, order);
    }

    // Delete Order
    @DeleteMapping("/{id}")
    public String deleteOrder(@PathVariable Long id) {
        service.deleteOrder(id);
        return "Order Deleted Successfully";
    }

}