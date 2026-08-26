package furniture_shop.service;

import java.util.List;

import furniture_shop.entity.Cart;

public interface CartService {

    Cart saveCart(Cart cart);

    List<Cart> getAllCarts();

    Cart getCartById(Long id);

    Cart updateCart(Long id, Cart cart);

    void deleteCart(Long id);
}