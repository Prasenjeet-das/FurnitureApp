package furniture_shop.service;

import java.util.List;

import furniture_shop.entity.Order;

public interface OrderService {

    Order saveOrder(Order order);

    List<Order> getAllOrders();

    List<Order> getOrdersByCustomerEmail(String customerEmail);

    Order cancelOrder(Long id, String customerEmail);

    List<Order> cancelOrderGroup(String orderNumber, String customerEmail);

    Order getOrderById(Long id);

    Order updateOrder(Long id, Order order);

    void deleteOrder(Long id);

}