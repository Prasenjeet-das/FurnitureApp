package furniture_shop.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import furniture_shop.entity.Order;
import furniture_shop.repository.OrderRepository;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository repository;

    @Override
    public Order saveOrder(Order order) {
        return repository.save(order);
    }

    @Override
    public List<Order> getAllOrders() {
        return repository.findAll();
    }

    @Override
    public List<Order> getOrdersByCustomerEmail(String customerEmail) {
        return repository.findByCustomerEmailOrderByOrderDateDesc(customerEmail);
    }

    @Override
    public Order cancelOrder(Long id, String customerEmail) {
        Order order = repository.findById(id).orElse(null);

        if (order == null || !customerEmail.equals(order.getCustomerEmail())) {
            return null;
        }

        if (!"CANCELLED".equals(order.getStatus())) {
            order.setStatus("CANCELLED");
            return repository.save(order);
        }

        return order;
    }

    @Override
    public List<Order> cancelOrderGroup(String orderNumber, String customerEmail) {
        List<Order> orders = repository.findByOrderNumberAndCustomerEmail(
                orderNumber,
                customerEmail);

        if (orders.isEmpty()) {
            return orders;
        }

        orders.forEach(order -> order.setStatus("CANCELLED"));
        return repository.saveAll(orders);
    }

    @Override
    public Order getOrderById(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public Order updateOrder(Long id, Order order) {

        Order existingOrder = repository.findById(id).orElse(null);

        if (existingOrder != null) {

            existingOrder.setCustomerName(order.getCustomerName());
            existingOrder.setCustomerEmail(order.getCustomerEmail());
            existingOrder.setOrderNumber(order.getOrderNumber());
            existingOrder.setOrderDate(order.getOrderDate());
            existingOrder.setProductName(order.getProductName());
            existingOrder.setQuantity(order.getQuantity());
            existingOrder.setTotalPrice(order.getTotalPrice());
            existingOrder.setStatus(order.getStatus());

            return repository.save(existingOrder);
        }

        return null;
    }

    @Override
    public void deleteOrder(Long id) {
        repository.deleteById(id);
    }

}